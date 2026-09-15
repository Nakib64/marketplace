import { createHash } from 'node:crypto';
import { BadRequestException, ConflictException, HttpException, UnauthorizedException } from '@nestjs/common';
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
  let mailServiceMock: any;

  beforeEach(() => {
    prismaMock = {
      user: {
        findUnique: vi.fn(),
        update: vi.fn(),
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

    mailServiceMock = {
      sendVerificationEmail: vi.fn().mockResolvedValue(true),
    };

    credentialsService = new AuthCredentialsService(prismaMock, redisMock, mailServiceMock);
    tokensService = new AuthTokensService(
      jwtServiceMock,
      configServiceMock,
      redisMock,
      prismaMock,
    );
    authService = new AuthService(credentialsService, tokensService);
  });

  describe('register', () => {
    it('should successfully register a CLIENT user, generate code, and send verification email', async () => {
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

      expect(result.message).toContain('Registration successful');
      expect(result.user.email).toBe('client@example.com');
      expect(prismaMock.clientProfile.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: 'client-uuid-1' }),
      });
      expect(mailServiceMock.sendVerificationEmail).toHaveBeenCalledWith(
        'client@example.com',
        expect.any(String),
      );
      expect(redisMock.set).toHaveBeenCalledWith(
        'email:verify:code:client@example.com',
        expect.any(String),
        600,
      );
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

  describe('verifyEmail', () => {
    it('should verify email successfully with valid alphanumeric code', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        isEmailVerified: false,
      });

      redisMock.get.mockImplementation(async (key: string) => {
        if (key === 'email:verify:code:user@example.com') return 'A2B3C4';
        if (key === 'email:verify:attempts:user@example.com') return '0';
        return null;
      });

      prismaMock.user.update.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        isEmailVerified: true,
      });

      const result = await authService.verifyEmail({ email: 'user@example.com' }, 'a2b3c4');

      expect(result.isEmailVerified).toBe(true);
      expect(result.message).toBe('Email address verified successfully.');
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { id: 'user-1' },
        data: { isEmailVerified: true },
      });
    });

    it('should throw BadRequestException and increment attempts on wrong code', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        isEmailVerified: false,
      });

      redisMock.get.mockImplementation(async (key: string) => {
        if (key === 'email:verify:code:user@example.com') return 'A2B3C4';
        if (key === 'email:verify:attempts:user@example.com') return '1';
        return null;
      });

      await expect(
        authService.verifyEmail({ email: 'user@example.com' }, 'WRONG1'),
      ).rejects.toThrow(BadRequestException);

      expect(redisMock.set).toHaveBeenCalledWith(
        'email:verify:attempts:user@example.com',
        '2',
        600,
      );
    });

    it('should invalidate code when 5 attempts are exceeded', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        isEmailVerified: false,
      });

      redisMock.get.mockImplementation(async (key: string) => {
        if (key === 'email:verify:code:user@example.com') return 'A2B3C4';
        if (key === 'email:verify:attempts:user@example.com') return '5';
        return null;
      });

      await expect(
        authService.verifyEmail({ email: 'user@example.com' }, 'WRONG1'),
      ).rejects.toThrow(/invalidated/i);

      expect(redisMock.del).toHaveBeenCalledWith('email:verify:code:user@example.com');
    });
  });

  describe('resendVerification', () => {
    it('should throw 429 HttpException if in cooldown period', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        isEmailVerified: false,
      });

      redisMock.get.mockImplementation(async (key: string) => {
        if (key === 'email:verify:cooldown:user@example.com') return '1';
        return null;
      });

      await expect(
        authService.resendVerification({ email: 'user@example.com' }),
      ).rejects.toThrow(HttpException);
    });

    it('should generate new code and dispatch email if not in cooldown', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'user@example.com',
        isEmailVerified: false,
      });

      redisMock.get.mockImplementation(async () => null);

      const result = await authService.resendVerification({ email: 'user@example.com' });

      expect(result.message).toContain('verification code has been sent');
      expect(mailServiceMock.sendVerificationEmail).toHaveBeenCalledWith(
        'user@example.com',
        expect.any(String),
      );
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
      const expectedHash = createHash('sha256').update('mocked_refresh_jwt_token').digest('hex');
      expect(redisMock.set).toHaveBeenCalledWith(
        'auth:refresh:user-uuid-1',
        expectedHash,
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
