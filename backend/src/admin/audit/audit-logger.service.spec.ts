import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrismaService } from '../../prisma/prisma.service.js';
import { AdminAuditController } from './controllers/admin-audit.controller.js';
import { AuditLoggerService } from './services/audit-logger.service.js';

describe('AuditLoggerService & AdminAuditController', () => {
  let service: AuditLoggerService;
  let controller: AdminAuditController;

  const mockPrisma = {
    auditLog: {
      create: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    service = new AuditLoggerService(mockPrisma as unknown as PrismaService);
    controller = new AdminAuditController(service);
  });

  describe('logAction', () => {
    it('should create an audit log with complete parameters', async () => {
      const mockCreated = {
        id: 'audit-1',
        adminId: 'admin-uuid',
        action: 'USER_BANNED',
        targetType: 'USER',
        targetId: 'user-uuid',
        details: 'Violation of terms',
        ipAddress: '127.0.0.1',
        createdAt: new Date(),
      };
      mockPrisma.auditLog.create.mockResolvedValue(mockCreated);

      const result = await service.logAction({
        adminId: 'admin-uuid',
        action: 'USER_BANNED',
        targetType: 'USER',
        targetId: 'user-uuid',
        details: 'Violation of terms',
        ipAddress: '127.0.0.1',
      });

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          adminId: 'admin-uuid',
          action: 'USER_BANNED',
          targetType: 'USER',
          targetId: 'user-uuid',
          details: 'Violation of terms',
          ipAddress: '127.0.0.1',
        },
      });
      expect(result).toEqual(mockCreated);
    });

    it('should create an audit log with optional fields omitted', async () => {
      const mockCreated = {
        id: 'audit-2',
        adminId: 'admin-uuid',
        action: 'FEE_UPDATED',
        targetType: 'SETTING',
        targetId: undefined,
        details: undefined,
        ipAddress: undefined,
        createdAt: new Date(),
      };
      mockPrisma.auditLog.create.mockResolvedValue(mockCreated);

      const result = await service.logAction({
        adminId: 'admin-uuid',
        action: 'FEE_UPDATED',
        targetType: 'SETTING',
      });

      expect(mockPrisma.auditLog.create).toHaveBeenCalledWith({
        data: {
          adminId: 'admin-uuid',
          action: 'FEE_UPDATED',
          targetType: 'SETTING',
          targetId: undefined,
          details: undefined,
          ipAddress: undefined,
        },
      });
      expect(result).toEqual(mockCreated);
    });
  });

  describe('getAuditLogs', () => {
    it('should query audit logs with pagination and filters', async () => {
      const mockLogs = [
        { id: 'audit-1', action: 'USER_BANNED', targetType: 'USER', adminId: 'admin-1' },
      ];
      mockPrisma.auditLog.findMany.mockResolvedValue(mockLogs);
      mockPrisma.auditLog.count.mockResolvedValue(1);

      const result = await service.getAuditLogs({
        action: 'USER_BANNED',
        targetType: 'USER',
        adminId: 'admin-1',
        page: 2,
        limit: 10,
      });

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith({
        where: { action: 'USER_BANNED', targetType: 'USER', adminId: 'admin-1' },
        skip: 10,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
      expect(mockPrisma.auditLog.count).toHaveBeenCalledWith({
        where: { action: 'USER_BANNED', targetType: 'USER', adminId: 'admin-1' },
      });
      expect(result).toEqual({
        logs: mockLogs,
        pagination: {
          page: 2,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      });
    });

    it('should use default page=1 and limit=25 when not specified', async () => {
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.auditLog.count.mockResolvedValue(0);

      const result = await service.getAuditLogs({});

      expect(mockPrisma.auditLog.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 25,
        orderBy: { createdAt: 'desc' },
      });
      expect(result.pagination).toEqual({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0,
      });
    });
  });

  describe('AdminAuditController', () => {
    it('should delegate getAuditLogs to the service', async () => {
      const mockResult = {
        logs: [],
        pagination: { page: 1, limit: 25, total: 0, totalPages: 0 },
      };
      mockPrisma.auditLog.findMany.mockResolvedValue([]);
      mockPrisma.auditLog.count.mockResolvedValue(0);

      const result = await controller.getAuditLogs({});
      expect(result).toEqual(mockResult);
    });
  });
});
