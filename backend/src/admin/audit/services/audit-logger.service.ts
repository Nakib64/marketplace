import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/prisma.service.js';
import { AuditLogQueryDto } from '../dto/audit-log-query.dto.js';

export interface LogActionParams {
  adminId: string;
  action: string;
  targetType: string;
  targetId?: string;
  details?: string;
  ipAddress?: string;
}

@Injectable()
export class AuditLoggerService {
  constructor(private readonly prisma: PrismaService) {}

  async logAction(params: LogActionParams) {
    return this.prisma.auditLog.create({
      data: {
        adminId: params.adminId,
        action: params.action,
        targetType: params.targetType,
        targetId: params.targetId,
        details: params.details,
        ipAddress: params.ipAddress,
      },
    });
  }

  async getAuditLogs(query: AuditLogQueryDto) {
    const { action, targetType, adminId, page = 1, limit = 25 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.AuditLogWhereInput = {
      ...(action ? { action } : {}),
      ...(targetType ? { targetType } : {}),
      ...(adminId ? { adminId } : {}),
    };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return {
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
