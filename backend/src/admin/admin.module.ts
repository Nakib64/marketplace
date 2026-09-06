import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminAnalyticsController } from './controllers/admin-analytics.controller.js';
import { AdminDisputesController } from './controllers/admin-disputes.controller.js';
import { AdminUsersController } from './controllers/admin-users.controller.js';
import { AdminCategoriesStatsService } from './services/admin-categories-stats.service.js';
import { AdminDisputesQueryService } from './services/admin-disputes-query.service.js';
import { AdminDisputesVerdictsService } from './services/admin-disputes-verdicts.service.js';
import { AdminFinancialsService } from './services/admin-financials.service.js';
import { AdminLiquidityService } from './services/admin-liquidity.service.js';
import { AdminUsersActionsService } from './services/admin-users-actions.service.js';
import { AdminUsersQueryService } from './services/admin-users-query.service.js';

@Module({
  imports: [AuthModule],
  controllers: [
    AdminAnalyticsController,
    AdminDisputesController,
    AdminUsersController,
  ],
  providers: [
    AdminFinancialsService,
    AdminLiquidityService,
    AdminCategoriesStatsService,
    AdminDisputesQueryService,
    AdminDisputesVerdictsService,
    AdminUsersQueryService,
    AdminUsersActionsService,
  ],
  exports: [
    AdminFinancialsService,
    AdminLiquidityService,
    AdminCategoriesStatsService,
    AdminDisputesQueryService,
    AdminDisputesVerdictsService,
    AdminUsersQueryService,
    AdminUsersActionsService,
  ],
})
export class AdminModule {}
