import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Roles } from '../../auth/decorators/roles.decorator.js';
import { CreatePortfolioItemDto } from '../dto/create-portfolio-item.dto.js';
import { UpdatePortfolioItemDto } from '../dto/update-portfolio-item.dto.js';
import { PortfolioService } from '../services/portfolio.service.js';

@Roles(Role.FREELANCER)
@Controller('users/me/portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addPortfolioItem(
    @CurrentUser('id') userId: string,
    @Body() dto: CreatePortfolioItemDto,
  ) {
    return this.portfolioService.addPortfolioItem(userId, dto);
  }

  @Patch(':id')
  async updatePortfolioItem(
    @CurrentUser('id') userId: string,
    @Param('id') portfolioItemId: string,
    @Body() dto: UpdatePortfolioItemDto,
  ) {
    return this.portfolioService.updatePortfolioItem(userId, portfolioItemId, dto);
  }

  @Delete(':id')
  async deletePortfolioItem(
    @CurrentUser('id') userId: string,
    @Param('id') portfolioItemId: string,
  ) {
    return this.portfolioService.deletePortfolioItem(userId, portfolioItemId);
  }
}
