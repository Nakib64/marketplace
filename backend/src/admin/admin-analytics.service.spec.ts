import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AnalyticsTimeframe } from './dto/analytics-query.dto.js';
import { AdminCategoriesStatsService } from './services/admin-categories-stats.service.js';
import { AdminFinancialsService } from './services/admin-financials.service.js';
import { AdminLiquidityService } from './services/admin-liquidity.service.js';

describe('Admin Analytics Sub-Services', () => {
  let financialsService: AdminFinancialsService;
  let liquidityService: AdminLiquidityService;
  let categoriesStatsService: AdminCategoriesStatsService;
  let prismaMock: any;

  beforeEach(() => {
    prismaMock = {
      contract: {
        aggregate: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
      },
      user: {
        aggregate: vi.fn(),
      },
      withdrawal: {
        aggregate: vi.fn(),
      },
      refund: {
        aggregate: vi.fn(),
      },
      job: {
        count: vi.fn(),
      },
      proposal: {
        count: vi.fn(),
      },
      freelancerProfile: {
        findMany: vi.fn(),
      },
      clientProfile: {
        findMany: vi.fn(),
      },
    };

    financialsService = new AdminFinancialsService(prismaMock);
    liquidityService = new AdminLiquidityService(prismaMock);
    categoriesStatsService = new AdminCategoriesStatsService(prismaMock);
  });

  describe('AdminFinancialsService.getFinancialOverview', () => {
    it('should aggregate financial metrics and calculate correct AOV', async () => {
      prismaMock.contract.aggregate.mockResolvedValueOnce({
        _sum: { escrowAmount: 10000 },
        _count: { id: 4 },
      });
      prismaMock.contract.aggregate.mockResolvedValueOnce({
        _sum: { platformFee: 1000 },
      });
      prismaMock.contract.aggregate.mockResolvedValueOnce({
        _sum: { escrowAmount: 3000 },
      });
      prismaMock.user.aggregate.mockResolvedValueOnce({
        _sum: { walletBalance: 4500 },
      });
      prismaMock.withdrawal.aggregate.mockResolvedValueOnce({
        _sum: { amount: 2500 },
      });
      prismaMock.refund.aggregate.mockResolvedValueOnce({
        _sum: { amount: 500 },
        _count: { id: 1 },
      });

      const res = await financialsService.getFinancialOverview(AnalyticsTimeframe.LAST_30_DAYS);

      expect(res.gmv).toBe(10000);
      expect(res.netRevenue).toBe(1000);
      expect(res.floatingEscrowLiability).toBe(3000);
      expect(res.outstandingWalletLiability).toBe(4500);
      expect(res.totalPayoutsDisbursed).toBe(2500);
      expect(res.totalRefundedEscrow).toBe(500);
      expect(res.totalRefundsCount).toBe(1);
      expect(res.totalContracts).toBe(4);
      expect(res.averageOrderValue).toBe(2500);
    });
  });

  describe('AdminLiquidityService.getLiquidityMetrics', () => {
    it('should calculate job fill rate, average time to hire, and dispute rate', async () => {
      prismaMock.job.count.mockResolvedValue(10);

      const now = new Date('2026-09-06T12:00:00Z');
      const jobCreated = new Date('2026-09-06T06:00:00Z');
      prismaMock.contract.findMany.mockResolvedValue([
        { jobId: 'job-1', createdAt: now, job: { createdAt: jobCreated } },
        { jobId: 'job-2', createdAt: now, job: { createdAt: jobCreated } },
      ]);

      prismaMock.proposal.count.mockResolvedValue(40);

      prismaMock.contract.count.mockResolvedValueOnce(4);
      prismaMock.contract.count.mockResolvedValueOnce(1);
      prismaMock.contract.count.mockResolvedValueOnce(0);

      const res = await liquidityService.getLiquidityMetrics(AnalyticsTimeframe.ALL_TIME);

      expect(res.totalJobs).toBe(10);
      expect(res.uniqueJobsFunded).toBe(2);
      expect(res.jobFillRate).toBe(20.0);
      expect(res.averageTimeToHireHours).toBe(6.0);
      expect(res.averageProposalsPerJob).toBe(4.0);
      expect(res.disputeRate).toBe(20.0);
    });
  });

  describe('AdminCategoriesStatsService.getCategoryAnalytics', () => {
    it('should aggregate GMV by category and rank top freelancers and clients', async () => {
      prismaMock.contract.findMany.mockResolvedValue([
        {
          escrowAmount: 5000,
          job: { category: { name: 'Web Development' } },
        },
        {
          escrowAmount: 2000,
          job: { category: { name: 'Web Development' } },
        },
        {
          escrowAmount: 3000,
          job: { category: { name: 'UI/UX Design' } },
        },
      ]);

      prismaMock.freelancerProfile.findMany.mockResolvedValue([
        {
          userId: 'free-1',
          earnings: 15000,
          totalProjects: 12,
          successRate: 98.5,
          user: { id: 'free-1', email: 'topfree@test.com' },
        },
      ]);

      prismaMock.clientProfile.findMany.mockResolvedValue([
        {
          userId: 'client-1',
          companyName: 'Acme Corp',
          totalSpent: 25000,
          totalJobPosts: 8,
          user: { id: 'client-1', email: 'acme@test.com' },
        },
      ]);

      const res = await categoriesStatsService.getCategoryAnalytics();

      expect(res.categoryBreakdown).toHaveLength(2);
      expect(res.categoryBreakdown[0].name).toBe('Web Development');
      expect(res.categoryBreakdown[0].gmv).toBe(7000);
      expect(res.categoryBreakdown[0].count).toBe(2);

      expect(res.categoryBreakdown[1].name).toBe('UI/UX Design');
      expect(res.categoryBreakdown[1].gmv).toBe(3000);

      expect(res.topFreelancers).toHaveLength(1);
      expect(res.topFreelancers[0].earnings).toBe(15000);
      expect(res.topClients).toHaveLength(1);
      expect(res.topClients[0].totalSpent).toBe(25000);
    });
  });
});
