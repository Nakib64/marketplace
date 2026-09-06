import { Injectable } from '@nestjs/common';
import { ContractStatus, WithdrawalStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';

@Injectable()
export class AdminLiquidityService {
  constructor(private readonly prisma: PrismaService) {}

  async getLiquidityPositions() {
    const [escrowResult, userWalletsResult, pendingWithdrawalsResult] = await Promise.all([
      this.prisma.contract.aggregate({
        _sum: { escrowAmount: true },
        where: {
          status: { in: [ContractStatus.FUNDED, ContractStatus.DISPUTED] },
        },
      }),
      this.prisma.user.aggregate({
        _sum: { walletBalance: true },
      }),
      this.prisma.withdrawal.aggregate({
        _sum: { amount: true },
        where: {
          status: WithdrawalStatus.PENDING,
        },
      }),
    ]);

    const activeEscrowHeld = Number(escrowResult._sum.escrowAmount || 0);
    const totalUserWalletLiabilities = Number(userWalletsResult._sum.walletBalance || 0);
    const pendingWithdrawalLiabilities = Number(pendingWithdrawalsResult._sum.amount || 0);

    const totalPlatformLiabilities =
      activeEscrowHeld + totalUserWalletLiabilities + pendingWithdrawalLiabilities;

    return {
      activeEscrowHeld,
      totalUserWalletLiabilities,
      pendingWithdrawalLiabilities,
      totalPlatformLiabilities,
    };
  }
}
