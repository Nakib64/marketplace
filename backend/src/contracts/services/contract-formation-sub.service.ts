import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, JobStatus, ProposalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import { SslCommerzService } from './sslcommerz.service.js';

@Injectable()
export class ContractFormationSubService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly sslCommerzService: SslCommerzService,
    private readonly redis: RedisService,
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
      // Insufficient wallet balance: Save intent to Redis and return SSLCommerz checkout URL
      const tranId = `TRAN_${Date.now()}_${proposalId.replace(/-/g, '').slice(0, 8)}`;

      const paymentIntent = {
        type: 'CONTRACT_ESCROW',
        clientId,
        proposalId,
        jobId: proposal.jobId,
        freelancerId: proposal.freelancerId,
        escrowAmount,
        platformFee,
        createdAt: new Date().toISOString(),
      };
      await this.redis.set(`payment:intent:${tranId}`, JSON.stringify(paymentIntent), 7200);

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
   * Handles SSLCommerz payment success webhook:
   * Validates transaction, retrieves intent from Redis, and creates Contract.
   */
  async handlePaymentSuccess(payload: any) {
    const isValid = this.sslCommerzService.validatePayload(payload);
    if (!isValid) {
      return {
        success: false,
        status: 'FAILED',
        message: 'Invalid payment payload signature or unverified transaction status.',
      };
    }

    const tranId = payload.tran_id;
    const intentRaw = await this.redis.get(`payment:intent:${tranId}`);

    if (!intentRaw) {
      // Check if contract already exists for this tranId (idempotent webhook retry)
      const existingContract = await this.prisma.contract.findUnique({
        where: { sslcommerzId: tranId },
      });
      if (existingContract) {
        return {
          success: true,
          status: 'ALREADY_PROCESSED',
          message: 'Payment has already been processed for this contract.',
          contract: existingContract,
        };
      }
      return {
        success: false,
        status: 'INTENT_EXPIRED_OR_NOT_FOUND',
        message: `No active payment intent found for transaction ${tranId}. It may have expired.`,
      };
    }

    const intent = JSON.parse(intentRaw);

    // Form the contract in database atomically
    const contract = await this.prisma.$transaction(async (tx) => {
      // 1. Create Contract
      const created = await tx.contract.create({
        data: {
          proposalId: intent.proposalId,
          jobId: intent.jobId,
          clientId: intent.clientId,
          freelancerId: intent.freelancerId,
          escrowAmount: intent.escrowAmount,
          platformFee: intent.platformFee,
          sslcommerzId: tranId,
          status: ContractStatus.FUNDED,
        },
      });

      // 2. Update Job status to IN_PROGRESS
      await tx.job.update({
        where: { id: intent.jobId },
        data: { status: JobStatus.IN_PROGRESS },
      });

      // 3. Update Proposal status to ACCEPTED
      await tx.proposal.update({
        where: { id: intent.proposalId },
        data: { status: ProposalStatus.ACCEPTED },
      });

      // 4. Update Client Profile total spent
      await tx.clientProfile.update({
        where: { userId: intent.clientId },
        data: { totalSpent: { increment: intent.escrowAmount } },
      });

      return created;
    });

    // Remove intent from Redis once executed
    await this.redis.del(`payment:intent:${tranId}`);

    return {
      success: true,
      status: 'SUCCESS',
      message: 'Contract successfully formed and escrow funded via SSLCommerz.',
      contract,
    };
  }
}
