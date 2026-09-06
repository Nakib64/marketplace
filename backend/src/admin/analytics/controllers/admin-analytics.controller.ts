import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../../auth/decorators/roles.decorator.js';
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
}
