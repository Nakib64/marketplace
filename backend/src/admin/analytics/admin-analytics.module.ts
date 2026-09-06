import { Module } from '@nestjs/common';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller.js';
import { AdminCategoriesStatsService } from './services/admin-categories-stats.service.js';
import { AdminFinancialsService } from './services/admin-financials.service.js';
import { AdminLiquidityService } from './services/admin-liquidity.service.js';

@Module({
  controllers: [AdminAnalyticsController],
  providers: [
    AdminFinancialsService,
    AdminLiquidityService,
    AdminCategoriesStatsService,
  ],
  exports: [
    AdminFinancialsService,
    AdminLiquidityService,
    AdminCategoriesStatsService,
  ],
})
export class AdminAnalyticsModule {}
