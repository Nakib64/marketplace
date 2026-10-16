import { createHash } from 'node:crypto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { AdminRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminAuthService } from './admin-auth.service.js';
import { Admin2FaSubService } from './services/admin-2fa-sub.service.js';
import { AdminAuthCredentialsSubService } from './services/admin-auth-credentials-sub.service.js';
import { AdminAuthTokensSubService } from './services/admin-auth-tokens-sub.service.js';

describe('AdminAuthService (Facade & Sub-Services)', () => {
  let adminAuthService: AdminAuthService;
  let credentialsService: AdminAuthCredentialsSubService;
  let tokensService: AdminAuthTokensSubService;
  let admin2FaService: Admin2FaSubService;
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
        if (opts?.expiresIn === '5m') return Promise.resolve('mocked_pre_auth_token');
        return Promise.resolve('mocked_admin_refresh_token');
      }),
      verifyAsync: vi.fn(),
    };

    configServiceMock = {
      get: vi.fn().mockImplementation((key: string) => {
        if (key === 'JWT_ACCESS_SECRET') return 'admin_access_secret';
        if (key === 'JWT_ADMIN_ACCESS_SECRET') return 'admin_access_secret';
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
    admin2FaService = new Admin2FaSubService(
      prismaMock,
      jwtServiceMock,
      configServiceMock,
      tokensService,
    );
    adminAuthService = new AdminAuthService(credentialsService, tokensService, admin2FaService);
  });

  describe('login', () => {
    it('should authenticate admin and issue dual tokens when 2FA is disabled', async () => {
      const hashedPassword = await bcrypt.hash('CorrectAdminPassword123!', 10);
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        passwordHash: hashedPassword,
        name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
        twoFactorEnabled: false,
      });

      const result = await adminAuthService.login({
        email: 'admin@marketplace.com',
        password: 'CorrectAdminPassword123!',
      });

      expect(result.requires2FA).toBe(false);
      expect((result as any).accessToken).toBe('mocked_admin_access_token');
      expect((result as any).refreshToken).toBe('mocked_admin_refresh_token');
      expect((result as any).admin.email).toBe('admin@marketplace.com');
    });

    it('should return preAuthToken when 2FA is enabled for admin', async () => {
      const hashedPassword = await bcrypt.hash('CorrectAdminPassword123!', 10);
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        passwordHash: hashedPassword,
        name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
        twoFactorEnabled: true,
      });

      const result = await adminAuthService.login({
        email: 'admin@marketplace.com',
        password: 'CorrectAdminPassword123!',
      });

      expect(result.requires2FA).toBe(true);
      expect((result as any).preAuthToken).toBe('mocked_pre_auth_token');
    });
  });

  describe('2FA Operations', () => {
    it('should generate a valid Base32 TOTP secret and otpauth URL', async () => {
      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        twoFactorEnabled: false,
      });

      const result = await adminAuthService.generate2FASecret('admin-uuid-1');
      expect(result.secret).toBeDefined();
      expect(result.otpauthUrl).toContain('otpauth://totp/MarketplaceAdmin:admin%40marketplace.com');
    });

    it('should enable 2FA when valid TOTP code is provided', async () => {
      const secret = 'JBSWY3DPEHPK3PXP'; // Base32 test secret
      const validCode = admin2FaService.calculateTOTP(secret, 0);

      const result = await adminAuthService.enable2FA('admin-uuid-1', {
        secret,
        code: validCode,
      });

      expect(result.twoFactorEnabled).toBe(true);
      expect(prismaMock.admin.update).toHaveBeenCalledWith({
        where: { id: 'admin-uuid-1' },
        data: { twoFactorSecret: secret, twoFactorEnabled: true },
      });
    });

    it('should throw BadRequestException when enabling 2FA with invalid code', async () => {
      await expect(
        adminAuthService.enable2FA('admin-uuid-1', {
          secret: 'JBSWY3DPEHPK3PXP',
          code: '000000',
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should verify login with valid 2FA code', async () => {
      const secret = 'JBSWY3DPEHPK3PXP';
      const validCode = admin2FaService.calculateTOTP(secret, 0);

      jwtServiceMock.verifyAsync.mockResolvedValue({
        sub: 'admin-uuid-1',
        tokenType: 'admin_pre_auth',
        userType: 'ADMIN',
      });

      prismaMock.admin.findUnique.mockResolvedValue({
        id: 'admin-uuid-1',
        email: 'admin@marketplace.com',
        name: 'Super Admin',
        role: AdminRole.SUPER_ADMIN,
        isActive: true,
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      });

      const result = await adminAuthService.verifyLoginWith2FA({
        preAuthToken: 'valid_pre_auth_token',
        code: validCode,
      });

      expect(result.accessToken).toBe('mocked_admin_access_token');
      expect(result.admin.email).toBe('admin@marketplace.com');
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
  });
});
