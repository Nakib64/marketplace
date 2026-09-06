import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContractStatus, JobStatus, WithdrawalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { CreateRefundDto } from '../dto/create-refund.dto.js';
import { RequestWithdrawalDto } from '../dto/request-withdrawal.dto.js';
import { WithdrawalQueryDto } from '../dto/withdrawal-query.dto.js';

@Injectable()
export class WalletService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves current wallet balance and history for the authenticated user.
   */
  async getWalletBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        walletBalance: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const withdrawals = await this.prisma.withdrawal.findMany({
      where: { freelancerId: userId },
      orderBy: { createdAt: 'desc' },
    });

    const refunds = await this.prisma.refund.findMany({
      where: { clientId: userId },
      include: {
        contract: {
          select: {
            id: true,
            jobId: true,
            job: { select: { id: true, title: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return {
      walletBalance: Number(user.walletBalance),
      withdrawals,
      refunds,
    };
  }

  /**
   * Submits a withdrawal request and immediately deducts the amount from the freelancer's balance.
   */
  async requestWithdrawal(freelancerId: string, dto: RequestWithdrawalDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: freelancerId },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const currentBalance = Number(user.walletBalance);
    if (currentBalance < dto.amount) {
      throw new BadRequestException('Insufficient wallet balance for this withdrawal.');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Immediately deduct the requested amount
      await tx.user.update({
        where: { id: freelancerId },
        data: { walletBalance: { decrement: dto.amount } },
      });

      // 2. Create pending withdrawal record
      const withdrawal = await tx.withdrawal.create({
        data: {
          freelancerId,
          amount: dto.amount,
          method: dto.method,
          accountNumber: dto.accountNumber,
          status: WithdrawalStatus.PENDING,
        },
      });

      return {
        message: 'Withdrawal request submitted successfully.',
        withdrawal,
      };
    });
  }

  /**
   * Lists withdrawal requests for admin with optional status filter.
   */
  async getAdminWithdrawals(query: WithdrawalQueryDto) {
    return await this.prisma.withdrawal.findMany({
      where: query.status ? { status: query.status } : {},
      include: {
        freelancer: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Admin marks a withdrawal request as APPROVED once funds are sent.
   */
  async approveWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found.');
    }
    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('Only pending withdrawal requests can be approved.');
    }

    return await this.prisma.withdrawal.update({
      where: { id: withdrawalId },
      data: { status: WithdrawalStatus.APPROVED },
    });
  }

  /**
   * Admin rejects a withdrawal request and transactionally refunds the amount to the freelancer.
   */
  async rejectWithdrawal(withdrawalId: string) {
    const withdrawal = await this.prisma.withdrawal.findUnique({
      where: { id: withdrawalId },
    });

    if (!withdrawal) {
      throw new NotFoundException('Withdrawal request not found.');
    }
    if (withdrawal.status !== WithdrawalStatus.PENDING) {
      throw new BadRequestException('Only pending withdrawal requests can be rejected.');
    }

    return await this.prisma.$transaction(async (tx) => {
      // 1. Mark withdrawal status as REJECTED
      const updatedWithdrawal = await tx.withdrawal.update({
        where: { id: withdrawalId },
        data: { status: WithdrawalStatus.REJECTED },
      });

      // 2. Refund balance back to freelancer
      await tx.user.update({
        where: { id: withdrawal.freelancerId },
        data: { walletBalance: { increment: withdrawal.amount } },
      });

      return {
        message: 'Withdrawal rejected and amount refunded to freelancer balance.',
        withdrawal: updatedWithdrawal,
      };
    });
  }

  /**
   * Admin cancels/rejects a funded project, refunds escrow to client wallet, and stores a permanent refund record.
   */
  async refundContract(adminId: string, contractId: string, dto: CreateRefundDto) {
    const contract = await this.prisma.contract.findUnique({
      where: { id: contractId },
    });

    if (!contract) {
      throw new NotFoundException('Contract not found.');
    }
    if (contract.status === ContractStatus.COMPLETED) {
      throw new BadRequestException('Completed contracts cannot be refunded.');
    }
    if (contract.status === ContractStatus.REFUNDED) {
      throw new ConflictException('Contract has already been refunded.');
    }

    const escrowAmount = Number(contract.escrowAmount);

    return await this.prisma.$transaction(async (tx) => {
      // 1. Update contract status to REFUNDED
      const updatedContract = await tx.contract.update({
        where: { id: contractId },
        data: { status: ContractStatus.REFUNDED },
      });

      // 2. Update job status to CANCELED
      await tx.job.update({
        where: { id: contract.jobId },
        data: { status: JobStatus.CANCELED },
      });

      // 3. Refund escrow amount to client wallet balance
      await tx.user.update({
        where: { id: contract.clientId },
        data: { walletBalance: { increment: escrowAmount } },
      });

      // 4. Create permanent Refund audit record
      const refund = await tx.refund.create({
        data: {
          contractId,
          clientId: contract.clientId,
          amount: escrowAmount,
          reason: dto.reason,
          adminId,
        },
      });

      return {
        message: 'Project rejected and escrow refunded to client wallet successfully.',
        refund,
        contract: updatedContract,
      };
    });
  }

  /**
   * Retrieves all refund records for admin review.
   */
  async getAdminRefunds() {
    return await this.prisma.refund.findMany({
      include: {
        client: {
          select: {
            id: true,
            email: true,
          },
        },
        contract: {
          select: {
            id: true,
            jobId: true,
            escrowAmount: true,
            status: true,
            job: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
