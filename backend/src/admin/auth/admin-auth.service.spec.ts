import { createHash } from 'node:crypto';
import { UnauthorizedException } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminAuthService } from './admin-auth.service.js';
import { AdminAuthCredentialsSubService } from './services/admin-auth-credentials-sub.service.js';
import { AdminAuthTokensSubService } from './services/admin-auth-tokens-sub.service.js';

describe('AdminAuthService (Facade & Sub-Services)', () => {
  let adminAuthService: AdminAuthService;
  let credentialsService: AdminAuthCredentialsSubService;
  let tokensService: AdminAuthTokensSubService;
  let prismaMock: any;
  let jwtServiceMock: any;
  let configServiceMock: any;
  let redisMock: any;

  beforeEach(() => {
    prismaMock = {
      admin: {
        findUnique: vi.fn(),
        update: vi.fn().mockResolvedValue({}),
      },
    };

    jwtServiceMock = {
      signAsync: vi.fn().mockImplementation((payload, opts) => {
        if (opts?.expiresIn === '24h') return Promise.resolve('mocked_admin_access_token');
        return Promise.resolve('mocked_admin_refresh_token');
      }),
      verifyAsync: vi.fn(),
    };

    configServiceMock = {
      get: vi.fn().mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'admin_access_secret';
        if (key === 'JWT_REFRESH_SECRET') return 'admin_refresh_secret';
        return 'secret';
      }),
    };

    redisMock = {
      set: vi.fn().mockResolvedValue('OK'),
      get: vi.fn(),
      del: vi.fn().mockResolvedValue(1),
    };

    credentialsService = new AdminAuthCredentialsSubService(prismaMock);
    tokensService = new AdminAuthTokensSubService(
      jwtServiceMock,
      configServiceMock,
      redisMock,
      prismaMock,
    );
    adminAuthService = new AdminAuthService(credentialsService, tokensService);
  });

  describe('login', () => {
    it('should authenticate admin and issue dual tokens with 24h refresh in Redis', async () => {
      const passwordHash = await bcrypt.hash('AdminPassword123!', 10);
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        passwordHash,
        name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
        twoFactorEnabled: false,
      });

      const result = await adminAuthService.login({
        email: 'admin@marketplace.com',
        password: 'AdminPassword123!',
      });

      expect(result.accessToken).toBe('mocked_admin_access_token');
      expect(result.refreshToken).toBe('mocked_admin_refresh_token');
      expect(result.expiresIn).toBe('24h');
      expect(result.admin.email).toBe('admin@marketplace.com');
      expect(result.admin.role).toBe(AdminRole.SUPER_ADMIN);
      expect(prismaMock.admin.update).toHaveBeenCalledWith({
        where: { id: 'admin-uuid-1' },
        data: { lastLoginAt: expect.any(Date) },
      });
      const expectedHash = createHash('sha256').update('mocked_admin_refresh_token').digest('hex');
      expect(redisMock.set).toHaveBeenCalledWith(
        'admin:refresh:admin-uuid-1',
        expectedHash,
        604800,
      );
    });

    it('should throw UnauthorizedException if admin does not exist', async () => {
      prismaMock.admin.findUnique.mockResolvedValue(null);

      await expect(
        adminAuthService.login({
          email: 'unknown@marketplace.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if admin is deactivated', async () => {
      const passwordHash = await bcrypt.hash('password123', 10);
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-2',
        email: 'inactive@marketplace.com',
        passwordHash,
        isActive: false,
      });

      await expect(
        adminAuthService.login({
          email: 'inactive@marketplace.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password does not match', async () => {
      const passwordHash = await bcrypt.hash('correct_password', 10);
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        passwordHash,
        isActive: true,
      });

      await expect(
        adminAuthService.login({
          email: 'admin@marketplace.com',
          password: 'wrong_password',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('refreshToken', () => {
    it('should rotate admin refresh token successfully', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({
        sub: 'admin-uuid-1',
        tokenType: 'admin_refresh',
        userType: 'ADMIN',
      });
      const rawToken = 'valid_admin_token';
      const hashedToken = createHash('sha256').update(rawToken).digest('hex');
      redisMock.get.mockResolvedValue(hashedToken);
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
      });

      const result = await adminAuthService.refreshToken('valid_admin_token');

      expect(result.accessToken).toBe('mocked_admin_access_token');
      expect(result.refreshToken).toBe('mocked_admin_refresh_token');
      expect(result.admin.email).toBe('admin@marketplace.com');
    });

    it('should throw and revoke if token was reused or stolen', async () => {
      jwtServiceMock.verifyAsync.mockResolvedValue({
        sub: 'admin-uuid-1',
        tokenType: 'admin_refresh',
        userType: 'ADMIN',
      });
      redisMock.get.mockResolvedValue('different_stored_token');

      await expect(
        adminAuthService.refreshToken('stale_token'),
      ).rejects.toThrow(UnauthorizedException);

      expect(redisMock.del).toHaveBeenCalledWith('admin:refresh:admin-uuid-1');
    });
  });

  describe('logout', () => {
    it('should revoke active admin refresh session in redis', async () => {
      const result = await adminAuthService.logout('admin-uuid-1');
      expect(result.message).toBe('Admin logged out successfully.');
      expect(redisMock.del).toHaveBeenCalledWith('admin:refresh:admin-uuid-1');
    });
  });

  describe('getProfile', () => {
    it('should return staff profile when active', async () => {
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
        twoFactorEnabled: false,
        lastLoginAt: new Date(),
        createdAt: new Date(),
      });

      const profile = await adminAuthService.getProfile('admin-uuid-1');
      expect(profile.email).toBe('admin@marketplace.com');
      expect(profile.role).toBe(AdminRole.SUPER_ADMIN);
    });

    it('should throw if admin is deactivated', async () => {
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        isActive: false,
      });

      await expect(adminAuthService.getProfile('admin-uuid-1')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
