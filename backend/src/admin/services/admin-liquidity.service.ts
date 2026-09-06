import { Injectable } from '@nestjs/common';
import { ContractStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AnalyticsTimeframe } from '../dto/analytics-query.dto.js';
import { getStartDate } from '../utils/timeframe.util.js';

@Injectable()
export class AdminLiquidityService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves marketplace liquidity, job conversion velocity, and funnel metrics.
   */
  async getLiquidityMetrics(timeframe?: AnalyticsTimeframe) {
    const startDate = getStartDate(timeframe);
    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    const [totalJobs, fundedContracts, totalProposals, completedContracts, disputedContracts, refundedContracts] =
      await Promise.all([
        this.prisma.job.count({ where: dateFilter }),
        this.prisma.contract.findMany({
          where: dateFilter,
          select: {
            jobId: true,
            createdAt: true,
            job: { select: { createdAt: true } },
          },
        }),
        this.prisma.proposal.count({ where: dateFilter }),
        this.prisma.contract.count({
          where: { ...dateFilter, status: ContractStatus.COMPLETED },
        }),
        this.prisma.contract.count({
          where: { ...dateFilter, status: ContractStatus.DISPUTED },
        }),
        this.prisma.contract.count({
          where: { ...dateFilter, status: ContractStatus.REFUNDED },
        }),
      ]);

    const uniqueJobsFunded = new Set(fundedContracts.map((c) => c.jobId)).size;
    const jobFillRate =
      totalJobs > 0 ? Number(((uniqueJobsFunded / totalJobs) * 100).toFixed(1)) : 0;

    let totalTTHHours = 0;
    for (const c of fundedContracts) {
      if (c.job?.createdAt) {
        const diffMs = c.createdAt.getTime() - c.job.createdAt.getTime();
        totalTTHHours += diffMs / (1000 * 60 * 60);
      }
    }
    const averageTimeToHireHours =
      fundedContracts.length > 0
        ? Number((totalTTHHours / fundedContracts.length).toFixed(1))
        : 0;

    const averageProposalsPerJob =
      totalJobs > 0 ? Number((totalProposals / totalJobs).toFixed(1)) : 0;

    const totalOutcomes = completedContracts + disputedContracts + refundedContracts;
    const disputeRate =
      totalOutcomes > 0
        ? Number(((disputedContracts / totalOutcomes) * 100).toFixed(1))
        : 0;

    return {
      timeframe: timeframe || AnalyticsTimeframe.ALL_TIME,
      totalJobs,
      uniqueJobsFunded,
      jobFillRate,
      averageTimeToHireHours,
      totalProposals,
      averageProposalsPerJob,
      outcomes: {
        completed: completedContracts,
        disputed: disputedContracts,
        refunded: refundedContracts,
      },
      disputeRate,
    };
  }
}
