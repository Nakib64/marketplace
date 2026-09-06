import { Injectable } from '@nestjs/common';
import { ContractStatus } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto.js';
import { calculateDateRange } from '../utils/timeframe.util.js';

@Injectable()
export class AdminCategoriesStatsService {
  constructor(private readonly prisma: PrismaService) {}

  async getCategoryPerformance(query: AnalyticsQueryDto) {
    const { startDate, endDate } = calculateDateRange(
      query.timeframe,
      query.startDate,
      query.endDate,
    );

    const dateFilter =
      startDate && endDate ? { createdAt: { gte: startDate, lte: endDate } } : {};

    const completedContracts = await this.prisma.contract.findMany({
      where: {
        status: ContractStatus.COMPLETED,
        ...dateFilter,
      },
      include: {
        job: {
          select: {
            categoryId: true,
            category: { select: { id: true, name: true } },
          },
        },
      },
    });

    const categoryMap = new Map<
      string,
      { categoryId: string; name: string; volume: number; netFee: number; contractsCount: number }
    >();

    for (const contract of completedContracts) {
      const categoryId = contract.job?.categoryId || 'uncategorized';
      const categoryName = contract.job?.category?.name || 'Uncategorized';
      const escrow = Number(contract.escrowAmount);
      const fee = Number(contract.platformFee);

      const existing = categoryMap.get(categoryId) || {
        categoryId,
        name: categoryName,
        volume: 0,
        netFee: 0,
        contractsCount: 0,
      };

      existing.volume += escrow;
      existing.netFee += fee;
      existing.contractsCount += 1;

      categoryMap.set(categoryId, existing);
    }

    return Array.from(categoryMap.values()).sort((a, b) => b.volume - a.volume);
  }
}
