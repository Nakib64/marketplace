import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, JobStatus, ProposalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { SslCommerzService } from './sslcommerz.service.js';

@Injectable()
export class ContractsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sslCommerzService: SslCommerzService,
  ) {}

  /**
   * Retrieves or initializes default platform fee percentage from PlatformSetting table.
   */
  async getPlatformFeePercentage(): Promise<number> {
    const setting = await this.prisma.platformSetting.findUnique({
      where: { id: 'default' },
    });
    if (!setting) {
      const created = await this.prisma.platformSetting.create({
        data: { id: 'default', platformFeePercentage: 10.0 },
      });
      return created.platformFeePercentage;
    }
    return setting.platformFeePercentage;
  }

  /**
   * Updates platform fee percentage (Admin only).
   */
  async updatePlatformFeePercentage(percentage: number) {
    return await this.prisma.platformSetting.upsert({
      where: { id: 'default' },
      update: { platformFeePercentage: percentage },
      create: { id: 'default', platformFeePercentage: percentage },
    });
  }

  /**
   * Accepts a proposal, creates a contract, and locks client escrow funds.
   */
  async acceptProposal(clientId: string, proposalId: string) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { job: true, freelancer: true },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found.');
    }
    if (proposal.job.clientId !== clientId) {
      throw new ForbiddenException('You are not authorized to accept proposals for this job.');
    }
    if (proposal.job.status !== JobStatus.OPEN) {
      throw new BadRequestException('Job is not open for proposal acceptance.');
    }
    if (proposal.status !== ProposalStatus.PENDING) {
      throw new BadRequestException('Proposal is no longer pending.');
    }

    const existingContract = await this.prisma.contract.findUnique({
      where: { proposalId },
    });
    if (existingContract) {
      throw new ConflictException('A contract has already been formed for this proposal.');
    }

    const escrowAmount = Number(proposal.bidAmount);
    const feePercentage = await this.getPlatformFeePercentage();
    const platformFee = Number(((escrowAmount * feePercentage) / 100).toFixed(2));

    const clientUser = await this.prisma.user.findUnique({
      where: { id: clientId },
    });

    if (!clientUser) {
      throw new NotFoundException('Client user record not found.');
    }

    const clientBalance = Number(clientUser.walletBalance);

    if (clientBalance < escrowAmount) {
      // Wallet balance insufficient: Return payment gateway initialization link
      const tranId = `TRAN_${Date.now()}_${proposalId.slice(0, 8)}`;
      const gatewayResponse = await this.sslCommerzService.initPayment({
        tranId,
        totalAmount: escrowAmount,
        cusName: clientUser.email,
        cusEmail: clientUser.email,
      });

      return {
        paymentRequired: true,
        message: 'Insufficient wallet balance. Please complete payment via gateway.',
        gatewayUrl: gatewayResponse.gatewayUrl,
        tranId,
        contract: null,
      };
    }

    // Client has sufficient wallet balance: Execute transactional escrow lock
    const contract = await this.prisma.$transaction(async (tx) => {
      // 1. Deduct escrow amount from client wallet balance
      await tx.user.update({
        where: { id: clientId },
        data: { walletBalance: { decrement: escrowAmount } },
      });

      // 2. Create Contract record
      const createdContract = await tx.contract.create({
        data: {
          proposalId,
          jobId: proposal.jobId,
          clientId,
          freelancerId: proposal.freelancerId,
          escrowAmount,
          platformFee,
          status: ContractStatus.FUNDED,
        },
      });

      // 3. Update Job status to IN_PROGRESS
      await tx.job.update({
        where: { id: proposal.jobId },
        data: { status: JobStatus.IN_PROGRESS },
      });

      // 4. Update Proposal status to ACCEPTED
      await tx.proposal.update({
        where: { id: proposalId },
        data: { status: ProposalStatus.ACCEPTED },
      });

      return createdContract;
    });

    return {
      paymentRequired: false,
      message: 'Proposal accepted and escrow funded successfully.',
      contract,
    };
  }

  /**
   * Freelancer submits completed work for review.
   */
  async submitWork(freelancerId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.freelancerId !== freelancerId) {
      throw new ForbiddenException('You are not authorized to submit work for this contract.');
    }
    if (contract.status !== ContractStatus.FUNDED) {
      throw new BadRequestException(`Cannot submit work for contract in ${contract.status} status.`);
    }

    return await this.prisma.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.PENDING_APPROVAL },
    });
  }

  /**
   * Client approves work, releasing net payout (escrowAmount - platformFee) to Freelancer.
   */
  async approveWork(clientId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.clientId !== clientId) {
      throw new ForbiddenException('You are not authorized to approve work for this contract.');
    }
    if (contract.status !== ContractStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Contract is not pending approval.');
    }

    const escrowAmount = Number(contract.escrowAmount);
    const platformFee = Number(contract.platformFee);
    const netPayout = Number((escrowAmount - platformFee).toFixed(2));

    return await this.prisma.$transaction(async (tx) => {
      // 1. Mark contract as COMPLETED
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.COMPLETED },
      });

      // 2. Transfer net payout to Freelancer's wallet balance
      await tx.user.update({
        where: { id: contract.freelancerId },
        data: { walletBalance: { increment: netPayout } },
      });

      // 3. Update Freelancer Profile stats
      await tx.freelancerProfile.update({
        where: { userId: contract.freelancerId },
        data: {
          earnings: { increment: netPayout },
          totalProjects: { increment: 1 },
        },
      });

      // 4. Update Client Profile stats
      await tx.clientProfile.update({
        where: { userId: clientId },
        data: { totalSpent: { increment: escrowAmount } },
      });

      // 5. Update Job status to COMPLETED
      await tx.job.update({
        where: { id: contract.jobId },
        data: { status: JobStatus.COMPLETED },
      });

      return updatedContract;
    });
  }

  /**
   * Flags a contract as DISPUTED.
   */
  async disputeContract(userId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You are not a participant in this contract.');
    }
    if (
      contract.status !== ContractStatus.FUNDED &&
      contract.status !== ContractStatus.PENDING_APPROVAL
    ) {
      throw new BadRequestException(`Cannot dispute contract in ${contract.status} status.`);
    }

    return await this.prisma.contract.update({
      where: { id: contractId },
      data: { status: ContractStatus.DISPUTED },
    });
  }

  /**
   * Retrieves single contract detail.
   */
  async getContract(userId: string, contractId: string) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
      include: {
        job: true,
        client: { select: { id: true, email: true, clientProfile: true } },
        freelancer: { select: { id: true, email: true, freelancerProfile: true } },
        proposal: true,
      },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.clientId !== userId && contract.freelancerId !== userId) {
      throw new ForbiddenException('You are not authorized to view this contract.');
    }

    return contract;
  }

  /**
   * Retrieves list of user's active & past contracts.
   */
  async getUserContracts(userId: string) {
    return await this.prisma.contract.findMany({
      where: {
        OR: [{ clientId: userId }, { freelancerId: userId }],
      },
      include: {
        job: { select: { id: true, title: true, status: true } },
        client: { select: { id: true, email: true } },
        freelancer: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
