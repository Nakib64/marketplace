import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, JobStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';

@Injectable()
export class ContractLifecycleSubService {
  constructor(private readonly prisma: PrismaService) {}

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
}
