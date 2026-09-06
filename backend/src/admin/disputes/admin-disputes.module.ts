import { Module } from '@nestjs/common';
import { AdminAuditModule } from '../audit/admin-audit.module.js';
import { AdminDisputesController } from './controllers/admin-disputes.controller.js';
import { AdminDisputesQueryService } from './services/admin-disputes-query.service.js';
import { AdminDisputesVerdictsService } from './services/admin-disputes-verdicts.service.js';

@Module({
  imports: [AdminAuditModule],
  controllers: [AdminDisputesController],
  providers: [AdminDisputesQueryService, AdminDisputesVerdictsService],
  exports: [AdminDisputesQueryService, AdminDisputesVerdictsService],
})
export class AdminDisputesModule {}
