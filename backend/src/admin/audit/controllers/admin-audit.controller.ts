import { Controller, Get, Query } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Roles } from '../../../auth/decorators/roles.decorator.js';
import { AuditLogQueryDto } from '../dto/audit-log-query.dto.js';
import { AuditLoggerService } from '../services/audit-logger.service.js';

@Roles(Role.ADMIN)
@Controller('admin/audit-logs')
export class AdminAuditController {
  constructor(private readonly auditLoggerService: AuditLoggerService) {}

  @Get()
  async getAuditLogs(@Query() query: AuditLogQueryDto) {
    return this.auditLoggerService.getAuditLogs(query);
  }
}
