import { Module } from '@nestjs/common';
import { AdminAuditController } from './controllers/admin-audit.controller.js';
import { AuditLoggerService } from './services/audit-logger.service.js';

@Module({
  controllers: [AdminAuditController],
  providers: [AuditLoggerService],
  exports: [AuditLoggerService],
})
export class AdminAuditModule {}
