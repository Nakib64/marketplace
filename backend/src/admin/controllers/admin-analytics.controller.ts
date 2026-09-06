import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { AnalyticsQueryDto } from '../dto/analytics-query.dto.js';
import { AdminCategoriesStatsService } from '../services/admin-categories-stats.service.js';
import { AdminFinancialsService } from '../services/admin-financials.service.js';
import { AdminLiquidityService } from '../services/admin-liquidity.service.js';

@Roles(Role.ADMIN)
@Controller('admin/analytics')
export class AdminAnalyticsController {
  constructor(
    private readonly financialsService: AdminFinancialsService,
    private readonly liquidityService: AdminLiquidityService,
    private readonly categoriesStatsService: AdminCategoriesStatsService,
  ) {}

  @Get('overview')
  async getFinancialOverview(@Query() query: AnalyticsQueryDto) {
    return this.financialsService.getFinancialOverview(query.timeframe);
  }

  @Get('liquidity')
  async getLiquidityMetrics(@Query() query: AnalyticsQueryDto) {
    return this.liquidityService.getLiquidityMetrics(query.timeframe);
  }

  @Get('categories')
  async getCategoryAnalytics(@Query() query: AnalyticsQueryDto) {
    return this.categoriesStatsService.getCategoryAnalytics(query.timeframe);
  }
}
