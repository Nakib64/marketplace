import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ContractStatus, JobStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AuditLoggerService } from '../../audit/services/audit-logger.service.js';
import { DisputeResolutionDto } from '../dto/dispute-resolution.dto.js';
import { DisputeSplitDto } from '../dto/dispute-split.dto.js';

@Injectable()
export class AdminDisputesVerdictsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogger: AuditLoggerService,
  ) {}

  async forceRefundToClient(adminId: string, contractId: string, dto: DisputeResolutionDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.status !== ContractStatus.DISPUTED) {
      throw new BadRequestException('Only DISPUTED contracts can be resolved through arbitration.');
    }

    const escrowAmount = Number(contract.escrowAmount);

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.REFUNDED },
      });

      await tx.job.update({
        where: { id: contract.jobId },
        data: { status: JobStatus.CANCELED },
      });

      await tx.user.update({
        where: { id: contract.clientId },
        data: { walletBalance: { increment: escrowAmount } },
      });

      const refund = await tx.refund.create({
        data: {
          contractId,
          clientId: contract.clientId,
          amount: escrowAmount,
          reason: `Arbitration Verdict (Full Refund): ${dto.adminNotes}`,
          adminId,
        },
      });

      return {
        message: 'Dispute resolved in favor of Client. Full escrow refunded.',
        contract: updatedContract,
        refund,
        verdict: 'FULL_REFUND',
      };
    });

    await this.auditLogger.logAction({
      adminId,
      action: 'DISPUTE_REFUND',
      targetType: 'CONTRACT',
      targetId: contractId,
      details: dto.adminNotes,
    });

    return result;
  }

  async forceReleaseToFreelancer(adminId: string, contractId: string, dto: DisputeResolutionDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.status !== ContractStatus.DISPUTED) {
      throw new BadRequestException('Only DISPUTED contracts can be resolved through arbitration.');
    }

    const escrowAmount = Number(contract.escrowAmount);
    const platformFee = Number(contract.platformFee);
    const netPayout = Number((escrowAmount - platformFee).toFixed(2));

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.COMPLETED },
      });

      await tx.user.update({
        where: { id: contract.freelancerId },
        data: { walletBalance: { increment: netPayout } },
      });

      await tx.freelancerProfile.update({
        where: { userId: contract.freelancerId },
        data: {
          earnings: { increment: netPayout },
          totalProjects: { increment: 1 },
        },
      });

      await tx.clientProfile.update({
        where: { userId: contract.clientId },
        data: { totalSpent: { increment: escrowAmount } },
      });

      await tx.job.update({
        where: { id: contract.jobId },
        data: { status: JobStatus.COMPLETED },
      });

      return {
        message: 'Dispute resolved in favor of Freelancer. Net payout released.',
        contract: updatedContract,
        netPayout,
        verdict: 'FULL_RELEASE',
      };
    });

    await this.auditLogger.logAction({
      adminId,
      action: 'DISPUTE_RELEASE',
      targetType: 'CONTRACT',
      targetId: contractId,
      details: dto.adminNotes,
    });

    return result;
  }

  async resolveSplitSettlement(adminId: string, contractId: string, dto: DisputeSplitDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.status !== ContractStatus.DISPUTED) {
      throw new BadRequestException('Only DISPUTED contracts can be split-settled.');
    }

    const totalEscrow = Number(contract.escrowAmount);
    const clientRefundAmount = Number(((totalEscrow * dto.clientRefundPercentage) / 100).toFixed(2));
    const freelancerGross = Number((totalEscrow - clientRefundAmount).toFixed(2));

    const feeRate = totalEscrow > 0 ? Number(contract.platformFee) / totalEscrow : 0.1;
    const platformFee = Number((freelancerGross * feeRate).toFixed(2));
    const freelancerNet = Number((freelancerGross - platformFee).toFixed(2));

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: {
          status: ContractStatus.COMPLETED,
          platformFee,
        },
      });

      await tx.user.update({
        where: { id: contract.clientId },
        data: { walletBalance: { increment: clientRefundAmount } },
      });

      await tx.user.update({
        where: { id: contract.freelancerId },
        data: { walletBalance: { increment: freelancerNet } },
      });

      await tx.freelancerProfile.update({
        where: { userId: contract.freelancerId },
        data: { earnings: { increment: freelancerNet } },
      });

      await tx.clientProfile.update({
        where: { userId: contract.clientId },
        data: { totalSpent: { increment: freelancerGross } },
      });

      const refund = await tx.refund.create({
        data: {
          contractId,
          clientId: contract.clientId,
          amount: clientRefundAmount,
          reason: `Arbitration Split Settlement (${dto.clientRefundPercentage}%): ${dto.adminNotes}`,
          adminId,
        },
      });

      await tx.job.update({
        where: { id: contract.jobId },
        data: { status: JobStatus.COMPLETED },
      });

      return {
        message: 'Dispute split settlement executed successfully.',
        contract: updatedContract,
        clientRefund: clientRefundAmount,
        freelancerNet,
        platformFee,
        refund,
        verdict: 'SPLIT_SETTLEMENT',
      };
    });

    await this.auditLogger.logAction({
      adminId,
      action: 'DISPUTE_SPLIT',
      targetType: 'CONTRACT',
      targetId: contractId,
      details: `Client: ${dto.clientRefundPercentage}%, Notes: ${dto.adminNotes}`,
    });

    return result;
  }
}
