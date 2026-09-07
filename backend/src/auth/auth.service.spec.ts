import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';
import { AuthCredentialsService } from './services/auth-credentials.service.js';
import { AuthTokensService } from './services/auth-tokens.service.js';

describe('AuthService (Facade & Sub-Services)', () => {
  let authService: AuthService;
  let credentialsService: AuthCredentialsService;
  let tokensService: AuthTokensService;
  let prismaMock: any;
  let jwtServiceMock: any;
  let configServiceMock: any;
  let redisMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
      },
      $transaction: vi.fn(async (cb) => cb(prismaMock)),
      clientProfile: {
        create: vi.fn(),
      },
      freelancerProfile: {
        create: vi.fn(),
      },
    };

    jwtServiceMock = {
      signAsync: vi
        .fn()
        .mockImplementation((payload, opts) => {
          if (opts?.expiresIn === '24h') return Promise.resolve('mocked_access_jwt_token');
          return Promise.resolve('mocked_refresh_jwt_token');
        }),
      verifyAsync: vi.fn(),
    };

    configServiceMock = {
      get: vi.fn().mockReturnValue('secret'),
    };

    redisMock = {
      set: vi.fn().mockResolvedValue('OK'),
      get: vi.fn(),
      del: vi.fn().mockResolvedValue(1),
    };

    credentialsService = new AuthCredentialsService(prismaMock);
    tokensService = new AuthTokensService(
      jwtServiceMock,
      configServiceMock,
      redisMock,
      prismaMock,
    );
    authService = new AuthService(credentialsService, tokensService);
  });

  describe('register', () => {
    it('should successfully register a CLIENT user and create ClientProfile', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create = vi.fn().mockResolvedValue({
        id: 'client-uuid-1',
        email: 'client@example.com',
        role: Role.CLIENT,
        isEmailVerified: false,
        createdAt: new Date(),
      });

      const result = await authService.register({
        email: 'client@example.com',
        password: 'password123',
        role: Role.CLIENT,
      });

      expect(result.message).toBe('Registration successful');
      expect(result.user.email).toBe('client@example.com');
      expect(prismaMock.clientProfile.create).toHaveBeenCalledWith({
        data: { userId: 'client-uuid-1' },
      });
    });

    it('should successfully register a FREELANCER user and create FreelancerProfile', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);
      prismaMock.user.create = vi.fn().mockResolvedValue({
        id: 'freelancer-uuid-1',
        email: 'freelancer@example.com',
        role: Role.FREELANCER,
        isEmailVerified: false,
        createdAt: new Date(),
      });

      const result = await authService.register({
        email: 'freelancer@example.com',
        password: 'password123',
        role: Role.FREELANCER,
      });

      expect(result.message).toBe('Registration successful');
      expect(prismaMock.freelancerProfile.create).toHaveBeenCalledWith({
        data: { userId: 'freelancer-uuid-1' },
      });
    });

    it('should throw ConflictException if user already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({ id: 'existing-id' });

      await expect(
        authService.register({
          email: 'existing@example.com',
          password: 'password123',
          role: Role.CLIENT,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return dual tokens (15m access + 7d refresh) on valid login', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-uuid-1',
        email: 'user@example.com',
        passwordHash: hashedPassword,
        role: Role.CLIENT,
        isEmailVerified: true,
        isBanned: false,
      });

      const result = await authService.login({
        email: 'user@example.com',
        password: 'password123',
      });

      expect(result.accessToken).toBe('mocked_access_jwt_token');
      expect(result.refreshToken).toBe('mocked_refresh_jwt_token');
      expect(result.expiresIn).toBe('24h');
      expect(result.user.email).toBe('user@example.com');
      expect(redisMock.set).toHaveBeenCalledWith(
        'auth:refresh:user-uuid-1',
        'mocked_refresh_jwt_token',
        604800,
      );
    });

    it('should throw UnauthorizedException for invalid email or password', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'password123',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('logout', () => {
    it('should revoke active refresh token in redis upon logout', async () => {
      const res = await authService.logout('user-uuid-1');
      expect(res.message).toBe('Logged out successfully.');
      expect(redisMock.del).toHaveBeenCalledWith('auth:refresh:user-uuid-1');
    });
  });
});
