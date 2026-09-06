# Phase 9: Admin Financial Analytics & Treasury Ledger

## 1. Purpose
The purpose of Phase 9 is to provide C-level executive visibility and real-time treasury ledger control over the platform's financial health, marketplace liquidity, and category performance. Designed for high-volume marketplace operations, this module aggregates transaction volume (GMV), platform take-rate revenue, floating escrow liabilities, and liquidity velocity metrics across customizable timeframes (`24h`, `7d`, `30d`, `year`, `all`).

---

## 2. What To Do
- [x] Create `AdminAnalyticsController` and `AdminAnalyticsService` inside `src/admin/`.
- [x] Implement `AnalyticsQueryDto`:
  - `timeframe?`: `@IsOptional()`, `@IsEnum(['24h', '7d', '30d', 'year', 'all'])`.
- [x] Implement `GET /admin/analytics/overview` (Restricted to `ADMIN` role):
  - **Gross Merchandise Value (GMV)**: Total escrow volume funded across all contracts within timeframe.
  - **Net Platform Revenue**: Total platform commission collected from `COMPLETED` contracts (`SUM(platformFee)`).
  - **Floating Escrow Liability**: Total client cash currently locked in `FUNDED` and `PENDING_APPROVAL` contracts (active liabilities).
  - **Outstanding Wallet Liability**: Total cash sitting in all user balances (`SUM(User.walletBalance)`).
  - **Total Disbursed Payouts**: Cumulative funds disbursed through `APPROVED` bKash & Nagad withdrawals.
  - **Total Refunded Escrow**: Cumulative funds refunded to clients from cancelled/rejected projects.
  - **Average Contract Size (AOV)**: Mean value per contract.
- [x] Implement `GET /admin/analytics/liquidity` (Restricted to `ADMIN` role):
  - **Job Fill Rate**: $\left(\frac{\text{Jobs that resulted in a funded Contract}}{\text{Total Jobs Posted}}\right) \times 100$.
  - **Average Time-to-Hire (TTH)**: Mean duration (in hours/days) from job creation to contract creation.
  - **Liquidity Depth**: Mean number of proposal bids received per job post.
  - **Contract Completion Rate**: Percentage of contracts successfully `COMPLETED` vs `DISPUTED` vs `REFUNDED`.
  - **Dispute Rate**: Percentage of contracts flagged as `DISPUTED`.
- [x] Implement `GET /admin/analytics/categories` (Restricted to `ADMIN` role):
  - Breakdown of GMV and contract count grouped by Job Category.
  - Top 10 Earning Freelancers (lifetime earnings, success rate, project count).
  - Top 10 Spending Clients (lifetime spend, job posts count).
- [x] Write unit & integration tests covering financial calculations, liability formulas, and liquidity conversion rates.

---

## 3. How To Do It (Implementation Details)

### A. Modular Sub-Service Architecture inside `src/admin/`
```
src/admin/analytics/
├── dto/
│   └── analytics-query.dto.ts            # Timeframe filter schema ('24h' | '7d' | '30d' | 'year' | 'all')
├── utils/
│   └── timeframe.util.ts                 # Timeframe start date calculation utility (~20 lines)
├── controllers/
│   └── admin-analytics.controller.ts     # Routes overview, liquidity & categories to sub-services (~30 lines)
├── services/
│   ├── admin-financials.service.ts       # GMV, net revenue & liability aggregations (~65 lines)
│   ├── admin-liquidity.service.ts        # Funnel fill rate, TTH & dispute rate (~75 lines)
│   └── admin-categories-stats.service.ts # Category GMV & top 10 earner/spender rankings (~70 lines)
├── admin-analytics.module.ts             # Dedicated Analytics submodule
└── admin-analytics.service.spec.ts       # Vitest unit test suite
```


### B. Validation Schema (`analytics-query.dto.ts`)
```ts
import { IsEnum, IsOptional } from 'class-validator';

export enum AnalyticsTimeframe {
  LAST_24_HOURS = '24h',
  LAST_7_DAYS = '7d',
  LAST_30_DAYS = '30d',
  LAST_YEAR = 'year',
  ALL_TIME = 'all',
}

export class AnalyticsQueryDto {
  @IsOptional()
  @IsEnum(AnalyticsTimeframe, {
    message: 'timeframe must be 24h, 7d, 30d, year, or all',
  })
  timeframe?: AnalyticsTimeframe = AnalyticsTimeframe.ALL_TIME;
}
```

### C. Financial Aggregation & Ledger Formulas
```ts
// Calculate Date Filter Threshold
function getStartDate(timeframe?: AnalyticsTimeframe): Date | undefined {
  const now = new Date();
  switch (timeframe) {
    case AnalyticsTimeframe.LAST_24_HOURS:
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case AnalyticsTimeframe.LAST_7_DAYS:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case AnalyticsTimeframe.LAST_30_DAYS:
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case AnalyticsTimeframe.LAST_YEAR:
      return new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
    default:
      return undefined;
  }
}

// 1. Executive Financial Overview
async getFinancialOverview(timeframe?: AnalyticsTimeframe) {
  const startDate = getStartDate(timeframe);
  const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

  // GMV: Total Escrow Funded
  const gmvAggregate = await this.prisma.contract.aggregate({
    where: { ...dateFilter },
    _sum: { escrowAmount: true },
    _count: { id: true },
  });

  // Net Platform Revenue: Total commission from completed contracts
  const revenueAggregate = await this.prisma.contract.aggregate({
    where: { ...dateFilter, status: ContractStatus.COMPLETED },
    _sum: { platformFee: true },
  });

  // Floating Escrow Liability: Cash held in active contracts
  const floatingEscrow = await this.prisma.contract.aggregate({
    where: {
      status: { in: [ContractStatus.FUNDED, ContractStatus.PENDING_APPROVAL] },
    },
    _sum: { escrowAmount: true },
  });

  // Outstanding Wallet Liability: Total withdrawable cash across all users
  const walletLiability = await this.prisma.user.aggregate({
    _sum: { walletBalance: true },
  });

  // Total Disbursed Payouts (Approved Withdrawals)
  const payoutsAggregate = await this.prisma.withdrawal.aggregate({
    where: { ...dateFilter, status: WithdrawalStatus.APPROVED },
    _sum: { amount: true },
  });

  // Total Refunded Escrow
  const refundsAggregate = await this.prisma.refund.aggregate({
    where: { ...dateFilter },
    _sum: { amount: true },
    _count: { id: true },
  });

  const totalGMV = Number(gmvAggregate._sum.escrowAmount || 0);
  const totalContracts = gmvAggregate._count.id;
  const averageOrderValue = totalContracts > 0 ? Number((totalGMV / totalContracts).toFixed(2)) : 0;

  return {
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
```

### D. Marketplace Liquidity & Funnel Velocity
```ts
async getLiquidityMetrics(timeframe?: AnalyticsTimeframe) {
  const startDate = getStartDate(timeframe);
  const dateFilter = startDate ? { createdAt: { gte: startDate } } : {};

  // Total jobs posted
  const totalJobs = await this.prisma.job.count({ where: { ...dateFilter } });

  // Jobs that formed a contract
  const fundedContracts = await this.prisma.contract.findMany({
    where: { ...dateFilter },
    select: { jobId: true, createdAt: true, job: { select: { createdAt: true } } },
  });

  const uniqueJobsFunded = new Set(fundedContracts.map((c) => c.jobId)).size;
  const jobFillRate = totalJobs > 0 ? Number(((uniqueJobsFunded / totalJobs) * 100).toFixed(1)) : 0;

  // Time-to-Hire (TTH) in hours
  let totalTTHHours = 0;
  for (const c of fundedContracts) {
    const diffMs = c.createdAt.getTime() - c.job.createdAt.getTime();
    totalTTHHours += diffMs / (1000 * 60 * 60);
  }
  const averageTimeToHireHours =
    fundedContracts.length > 0 ? Number((totalTTHHours / fundedContracts.length).toFixed(1)) : 0;

  // Total proposals count
  const totalProposals = await this.prisma.proposal.count({ where: { ...dateFilter } });
  const averageProposalsPerJob =
    totalJobs > 0 ? Number((totalProposals / totalJobs).toFixed(1)) : 0;

  // Contract outcome counts
  const completedContracts = await this.prisma.contract.count({
    where: { ...dateFilter, status: ContractStatus.COMPLETED },
  });
  const disputedContracts = await this.prisma.contract.count({
    where: { ...dateFilter, status: ContractStatus.DISPUTED },
  });
  const refundedContracts = await this.prisma.contract.count({
    where: { ...dateFilter, status: ContractStatus.REFUNDED },
  });

  const totalContractOutcomes = completedContracts + disputedContracts + refundedContracts;
  const disputeRate =
    totalContractOutcomes > 0
      ? Number(((disputedContracts / totalContractOutcomes) * 100).toFixed(1))
      : 0;

  return {
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
```

---

## 4. Status & What Is Done
- [x] `AnalyticsQueryDto` with timeframe presets (`24h`, `7d`, `30d`, `year`, `all`): **Completed**
- [x] `AdminAnalyticsService` (GMV, float, liabilities, revenue aggregations): **Completed**
- [x] `AdminAnalyticsController` (`GET /admin/analytics/overview`, `/liquidity`, `/categories`): **Completed**
- [x] Category GMV breakdown & top 10 earner/spender rankings: **Completed**
- [x] Vitest unit test suite covering financial aggregations & velocity formulas: **Completed**
- [x] TypeScript compilation (`npm run build` 0 errors): **Completed**
