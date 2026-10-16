import { Module } from '@nestjs/common';
import { AdminAuditController } from './controllers/admin-audit.controller.js';
import { AdminAuditInterceptor } from './interceptors/admin-audit.interceptor.js';
import { AuditLoggerService } from './services/audit-logger.service.js';

@Module({
  controllers: [AdminAuditController],
  providers: [AuditLoggerService, AdminAuditInterceptor],
  exports: [AuditLoggerService, AdminAuditInterceptor],
})
export class AdminAuditModule {}
