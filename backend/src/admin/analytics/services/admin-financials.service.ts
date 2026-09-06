import { Injectable } from '@nestjs/common';
import { ContractStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto.js';
import { calculateDateRange } from '../utils/timeframe.util.js';

@Injectable()
export class AdminFinancialsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTreasuryOverview(query: AnalyticsQueryDto) {
    const { startDate, endDate } = calculateDateRange(
      query.timeframe,
      query.startDate,
      query.endDate,
    );

    const dateFilter =
      startDate && endDate ? { createdAt: { gte: startDate, lte: endDate } } : {};

    const [grossVolumeResult, netFeeResult] = await Promise.all([
      this.prisma.contract.aggregate({
        _sum: { escrowAmount: true },
        where: {
          status: { in: [ContractStatus.FUNDED, ContractStatus.COMPLETED] },
          ...dateFilter,
        },
      }),
      this.prisma.contract.aggregate({
        _sum: { platformFee: true },
        where: {
          status: ContractStatus.COMPLETED,
          ...dateFilter,
        },
      }),
    ]);

    const grossMarketplaceVolume = Number(grossVolumeResult._sum.escrowAmount || 0);
    const netPlatformRevenue = Number(netFeeResult._sum.platformFee || 0);

    return {
      grossMarketplaceVolume,
      netPlatformRevenue,
      period: {
        timeframe: query.timeframe,
        startDate,
        endDate,
      },
    };
  }
}
