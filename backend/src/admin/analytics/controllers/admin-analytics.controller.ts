import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../../auth/decorators/roles.decorator.js';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto.js';
import { AdminCategoriesStatsService } from '../services/admin-categories-stats.service.js';
import { AdminFinancialsService } from '../services/admin-financials.service.js';
import { AdminLiquidityService } from '../services/admin-liquidity.service.js';
import { AdminDeepAnalyticsService } from '../services/admin-deep-analytics.service.js';

@Roles(Role.ADMIN)
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(
    private readonly financialsService: AdminFinancialsService,
    private readonly liquidityService: AdminLiquidityService,
    private readonly categoriesStatsService: AdminCategoriesStatsService,
    private readonly deepAnalyticsService: AdminDeepAnalyticsService,
  ) {}

  @Get('treasury')
  async getTreasuryOverview(@Query() query: AnalyticsQueryDto) {
    return this.financialsService.getTreasuryOverview(query);
  }

  @Get('liquidity')
  async getLiquidityPositions() {
    return this.liquidityService.getLiquidityPositions();
  }

  @Get('categories')
  async getCategoryPerformance(@Query() query: AnalyticsQueryDto) {
    return this.categoriesStatsService.getCategoryPerformance(query);
  }

  @Get('overview')
  async getOverview(@Query() query: AnalyticsQueryDto) {
    return this.deepAnalyticsService.getOverviewAnalytics(query);
  }

  @Get('freelancers')
  async getFreelancerAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.deepAnalyticsService.getFreelancerAnalytics(query);
  }

  @Get('clients')
  async getClientAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.deepAnalyticsService.getClientAnalytics(query);
  }

  @Get('cash-flow')
  async getCashFlowAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.deepAnalyticsService.getCashFlowAnalytics(query);
  }

  @Get('jobs')
  async getJobAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.deepAnalyticsService.getJobAnalytics(query);
  }

  @Get('proposals')
  async getProposalAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.deepAnalyticsService.getProposalAnalytics(query);
  }
}

