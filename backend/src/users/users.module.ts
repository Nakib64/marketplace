import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { FreelancersController } from './controllers/freelancers.controller.js';
import { PortfolioController } from './controllers/portfolio.controller.js';
import { UsersController } from './controllers/users.controller.js';
import { WorkHistoryController } from './controllers/work-history.controller.js';
import { FreelancersSearchService } from './services/freelancers-search.service.js';
import { PortfolioService } from './services/portfolio.service.js';
import { UsersService } from './services/users.service.js';
import { WorkHistoryService } from './services/work-history.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    UsersController,
    WorkHistoryController,
    PortfolioController,
    FreelancersController,
  ],
  providers: [
    UsersService,
    WorkHistoryService,
    PortfolioService,
    FreelancersSearchService,
  ],
  exports: [
    UsersService,
    WorkHistoryService,
    PortfolioService,
    FreelancersSearchService,
  ],
})
export class UsersModule {}
