import { Injectable } from '@nestjs/common';
import { ContractStatus, WithdrawalStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AnalyticsTimeframe } from '../dto/analytics-query.dto.js';
import { getStartDate } from '../utils/timeframe.util.js';

@Injectable()
export class AdminFinancialsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves high-level executive financial metrics and treasury liabilities.
   */
  async getFinancialOverview(timeframe?: AnalyticsTimeframe) {
    const startDate = getStartDate(timeframe);
    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    const [gmvAggregate, revenueAggregate, floatingEscrow, walletLiability, payoutsAggregate, refundsAggregate] =
      await Promise.all([
        this.prisma.contract.aggregate({
          where: dateFilter,
          _sum: { escrowAmount: true },
          _count: { id: true },
        }),
        this.prisma.contract.aggregate({
          where: { ...dateFilter, status: ContractStatus.COMPLETED },
          _sum: { platformFee: true },
        }),
        this.prisma.contract.aggregate({
          where: {
            status: { in: [ContractStatus.FUNDED, ContractStatus.PENDING_APPROVAL] },
          },
          _sum: { escrowAmount: true },
        }),
        this.prisma.user.aggregate({
          _sum: { walletBalance: true },
        }),
        this.prisma.withdrawal.aggregate({
          where: { ...dateFilter, status: WithdrawalStatus.APPROVED },
          _sum: { amount: true },
        }),
        this.prisma.refund.aggregate({
          where: dateFilter,
          _sum: { amount: true },
          _count: { id: true },
        }),
      ]);

    const totalGMV = Number(gmvAggregate._sum.escrowAmount || 0);
    const totalContracts = gmvAggregate._count.id;
    const averageOrderValue =
      totalContracts > 0 ? Number((totalGMV / totalContracts).toFixed(2)) : 0;

    return {
      timeframe: timeframe || AnalyticsTimeframe.ALL_TIME,
      gmv: totalGMV,
      netRevenue: Number(revenueAggregate._sum.platformFee || 0),
      floatingEscrowLiability: Number(floatingEscrow._sum.escrowAmount || 0),
      outstandingWalletLiability: Number(walletLiability._sum.walletBalance || 0),
      totalPayoutsDisbursed: Number(payoutsAggregate._sum.amount || 0),
      totalRefundedEscrow: Number(refundsAggregate._sum.amount || 0),
      totalRefundsCount: refundsAggregate._count.id,
      totalContracts,
      averageOrderValue,
    };
  }
}
