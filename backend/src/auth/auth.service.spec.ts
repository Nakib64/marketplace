import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthService } from './auth.service.js';

describe('AuthService', () => {
  let authService: AuthService;
  let prismaMock: any;
  let jwtServiceMock: any;

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
      signAsync: vi.fn().mockResolvedValue('mocked_jwt_token'),
    };

    authService = new AuthService(prismaMock, jwtServiceMock);
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
    it('should return access token on valid login', async () => {
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

      expect(result.accessToken).toBe('mocked_jwt_token');
      expect(result.user.email).toBe('user@example.com');
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
});
