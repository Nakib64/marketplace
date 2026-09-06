import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Role } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminUsersActionsService } from './services/admin-users-actions.service.js';
import { AdminUsersQueryService } from './services/admin-users-query.service.js';

describe('Admin Users Sub-Services', () => {
  let queryService: AdminUsersQueryService;
  let actionsService: AdminUsersActionsService;
  let prismaMock: any;
  let jwtServiceMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findMany: vi.fn(),
        count: vi.fn(),
        findUnique: vi.fn(),
        update: vi.fn(),
      },
    };

    jwtServiceMock = {
      signAsync: vi.fn().mockResolvedValue('mock_impersonation_jwt_token'),
    };

    const auditLoggerMock = {
      logAction: vi.fn().mockResolvedValue({ id: 'audit-log-id' }),
    };

    queryService = new AdminUsersQueryService(prismaMock);
    actionsService = new AdminUsersActionsService(prismaMock, jwtServiceMock, auditLoggerMock as any);
  });

  describe('AdminUsersQueryService.getUsers', () => {
    it('should return paginated user list with counts', async () => {
      prismaMock.user.findMany.mockResolvedValue([
        {
          id: 'u-1',
          email: 'user1@test.com',
          role: Role.FREELANCER,
          isBanned: false,
          walletBalance: 500,
        },
      ]);
      prismaMock.user.count.mockResolvedValue(1);

      const res = await queryService.getUsers({ role: Role.FREELANCER, page: 1, limit: 10 });

      expect(res.users).toHaveLength(1);
      expect(res.pagination.total).toBe(1);
      expect(res.pagination.totalPages).toBe(1);
    });
  });

  describe('AdminUsersQueryService.getUserDossier', () => {
    it('should throw NotFoundException if user not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(queryService.getUserDossier('invalid-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should strip passwordHash from returned user object', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'u-1',
        email: 'user1@test.com',
        passwordHash: 'secret_hash',
        clientProfile: null,
      });

      const res = await queryService.getUserDossier('u-1');

      expect(res.id).toBe('u-1');
      expect((res as any).passwordHash).toBeUndefined();
    });
  });

  describe('AdminUsersActionsService.updateUserStatus', () => {
    it('should prevent admin from banning their own account', async () => {
      await expect(
        actionsService.updateUserStatus('admin-1', 'admin-1', { isBanned: true }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update user isBanned flag successfully', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'u-2', isBanned: false });
      prismaMock.user.update.mockResolvedValue({
        id: 'u-2',
        email: 'badactor@test.com',
        role: Role.FREELANCER,
        isBanned: true,
      });

      const res = await actionsService.updateUserStatus('admin-1', 'u-2', {
        isBanned: true,
        reason: 'Violation of Terms of Service',
      });

      expect(res.user.isBanned).toBe(true);
      expect(res.message).toBe('User has been banned.');
    });
  });

  describe('AdminUsersActionsService.verifyUserEmail', () => {
    it('should set isEmailVerified to true', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'u-3', isEmailVerified: false });
      prismaMock.user.update.mockResolvedValue({
        id: 'u-3',
        email: 'client@test.com',
        isEmailVerified: true,
      });

      const res = await actionsService.verifyUserEmail('admin-1', 'u-3');

      expect(res.user.isEmailVerified).toBe(true);
      expect(res.message).toBe('User email has been manually verified.');
    });
  });

  describe('AdminUsersActionsService.generateImpersonationToken', () => {
    it('should throw BadRequestException if target user is an administrator', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'admin-2',
        role: Role.ADMIN,
      });

      await expect(
        actionsService.generateImpersonationToken('admin-1', 'admin-2'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should sign impersonation JWT with isImpersonated flag and admin ID', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'u-4',
        email: 'customer@test.com',
        role: Role.CLIENT,
      });

      const res = await actionsService.generateImpersonationToken('admin-1', 'u-4');

      expect(res.accessToken).toBe('mock_impersonation_jwt_token');
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(
        {
          sub: 'u-4',
          email: 'customer@test.com',
          role: Role.CLIENT,
          isImpersonated: true,
          impersonatedBy: 'admin-1',
        },
        { expiresIn: '1h' },
      );
    });
  });
});
