import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module.js';
import { JobsSearchController } from './controllers/jobs-search.controller.js';
import { JobsController } from './controllers/jobs.controller.js';
import { JobsSearchService } from './services/jobs-search.service.js';
import { JobsService } from './services/jobs.service.js';

@Module({
  imports: [PrismaModule],
  controllers: [JobsController, JobsSearchController],
  providers: [JobsService, JobsSearchService],
  exports: [JobsService, JobsSearchService],
})
export class JobsModule {}
