import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module.js';
import { AdminAuditModule } from '../audit/admin-audit.module.js';
import { AdminJobsController } from './controllers/admin-jobs.controller.js';
import { AdminJobsService } from './services/admin-jobs.service.js';

@Module({
  imports: [PrismaModule, AdminAuditModule],
  controllers: [AdminJobsController],
  providers: [AdminJobsService],
  exports: [AdminJobsService],
})
export class AdminJobsModule {}
