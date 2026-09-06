import { ContractStatus, WithdrawalStatus } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Timeframe } from './dto/analytics-query.dto.js';
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
      },
      user: {
        aggregate: vi.fn(),
      },
      withdrawal: {
        aggregate: vi.fn(),
      },
    };

    financialsService = new AdminFinancialsService(prismaMock);
    liquidityService = new AdminLiquidityService(prismaMock);
    categoriesStatsService = new AdminCategoriesStatsService(prismaMock);
  });

  describe('AdminFinancialsService.getTreasuryOverview', () => {
    it('should aggregate gross escrow volume and net platform revenue', async () => {
      prismaMock.contract.aggregate
        .mockResolvedValueOnce({ _sum: { escrowAmount: 15000 } })
        .mockResolvedValueOnce({ _sum: { platformFee: 1500 } });

      const res = await financialsService.getTreasuryOverview({ timeframe: Timeframe.MONTH });

      expect(res.grossMarketplaceVolume).toBe(15000);
      expect(res.netPlatformRevenue).toBe(1500);
      expect(res.period.timeframe).toBe(Timeframe.MONTH);
      expect(res.period.startDate).toBeDefined();
      expect(res.period.endDate).toBeDefined();
    });
  });

  describe('AdminLiquidityService.getLiquidityPositions', () => {
    it('should calculate active escrows, wallet liabilities, and total platform liability', async () => {
      prismaMock.contract.aggregate.mockResolvedValueOnce({ _sum: { escrowAmount: 20000 } });
      prismaMock.user.aggregate.mockResolvedValueOnce({ _sum: { walletBalance: 35000 } });
      prismaMock.withdrawal.aggregate.mockResolvedValueOnce({ _sum: { amount: 5000 } });

      const res = await liquidityService.getLiquidityPositions();

      expect(res.activeEscrowHeld).toBe(20000);
      expect(res.totalUserWalletLiabilities).toBe(35000);
      expect(res.pendingWithdrawalLiabilities).toBe(5000);
      expect(res.totalPlatformLiabilities).toBe(60000);

      expect(prismaMock.contract.aggregate).toHaveBeenCalledWith({
        _sum: { escrowAmount: true },
        where: {
          status: { in: [ContractStatus.FUNDED, ContractStatus.DISPUTED] },
        },
      });
      expect(prismaMock.withdrawal.aggregate).toHaveBeenCalledWith({
        _sum: { amount: true },
        where: { status: WithdrawalStatus.PENDING },
      });
    });
  });

  describe('AdminCategoriesStatsService.getCategoryPerformance', () => {
    it('should aggregate contract volume and fee revenue grouped by category', async () => {
      prismaMock.contract.findMany.mockResolvedValueOnce([
        {
          id: 'c-1',
          escrowAmount: 5000,
          platformFee: 500,
          job: {
            categoryId: 'cat-web',
            category: { id: 'cat-web', name: 'Web Development' },
          },
        },
        {
          id: 'c-2',
          escrowAmount: 3000,
          platformFee: 300,
          job: {
            categoryId: 'cat-web',
            category: { id: 'cat-web', name: 'Web Development' },
          },
        },
        {
          id: 'c-3',
          escrowAmount: 4000,
          platformFee: 400,
          job: {
            categoryId: 'cat-design',
            category: { id: 'cat-design', name: 'Design & Creative' },
          },
        },
      ]);

      const res = await categoriesStatsService.getCategoryPerformance({ timeframe: Timeframe.MONTH });

      expect(res).toHaveLength(2);
      expect(res[0].categoryId).toBe('cat-web');
      expect(res[0].volume).toBe(8000);
      expect(res[0].netFee).toBe(800);
      expect(res[0].contractsCount).toBe(2);

      expect(res[1].categoryId).toBe('cat-design');
      expect(res[1].volume).toBe(4000);
      expect(res[1].netFee).toBe(400);
      expect(res[1].contractsCount).toBe(1);
    });
  });
});
