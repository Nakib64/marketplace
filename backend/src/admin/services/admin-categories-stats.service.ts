import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AnalyticsTimeframe } from '../dto/analytics-query.dto.js';
import { getStartDate } from '../utils/timeframe.util.js';

@Injectable()
export class AdminCategoriesStatsService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves category revenue distribution and top market leaders.
   */
  async getCategoryAnalytics(timeframe?: AnalyticsTimeframe) {
    const startDate = getStartDate(timeframe);
    const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

    const [contracts, topFreelancers, topClients] = await Promise.all([
      this.prisma.contract.findMany({
        where: dateFilter,
        select: {
          escrowAmount: true,
          job: {
            select: {
              categoryId: true,
              categoryName: true,
              category: { select: { name: true } },
            },
          },
        },
      }),
      this.prisma.freelancerProfile.findMany({
        take: 10,
        orderBy: { earnings: 'desc' },
        include: {
          user: { select: { id: true, email: true } },
        },
      }),
      this.prisma.clientProfile.findMany({
        take: 10,
        orderBy: { totalSpent: 'desc' },
        include: {
          user: { select: { id: true, email: true } },
        },
      }),
    ]);

    const categoryMap = new Map<string, { name: string; gmv: number; count: number }>();
    for (const c of contracts) {
      const catName =
        c.job?.category?.name || c.job?.categoryName || 'Uncategorized';
      const current = categoryMap.get(catName) || { name: catName, gmv: 0, count: 0 };
      current.gmv = Number((current.gmv + Number(c.escrowAmount)).toFixed(2));
      current.count += 1;
      categoryMap.set(catName, current);
    }

    const categoryBreakdown = Array.from(categoryMap.values()).sort((a, b) => b.gmv - a.gmv);

    return {
      timeframe: timeframe || AnalyticsTimeframe.ALL_TIME,
      categoryBreakdown,
      topFreelancers: topFreelancers.map((fp) => ({
        userId: fp.userId,
        email: fp.user.email,
        earnings: Number(fp.earnings),
        totalProjects: fp.totalProjects,
        successRate: fp.successRate,
      })),
      topClients: topClients.map((cp) => ({
        userId: cp.userId,
        email: cp.user.email,
        companyName: cp.companyName,
        totalSpent: Number(cp.totalSpent),
        totalJobPosts: cp.totalJobPosts,
      })),
    };
  }
}
