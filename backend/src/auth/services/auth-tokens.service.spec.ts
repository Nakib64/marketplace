import { UnauthorizedException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AuthTokensService } from './auth-tokens.service.js';

describe('AuthTokensService (Dual Token & Refresh Rotation)', () => {
  let tokensService: AuthTokensService;
  let jwtServiceMock: any;
  let configServiceMock: any;
  let redisMock: any;
  let prismaMock: any;

  beforeEach(() => {
    jwtServiceMock = {
      signAsync: vi.fn(),
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
    prismaMock = {
      user: {
        findUnique: vi.fn(),
      },
    };

    tokensService = new AuthTokensService(
      jwtServiceMock,
      configServiceMock,
      redisMock,
      prismaMock,
    );
  });

  it('should generate dual tokens and store refresh token in redis with 7-day TTL', async () => {
    jwtServiceMock.signAsync
      .mockResolvedValueOnce('access-jwt-token')
      .mockResolvedValueOnce('refresh-jwt-token');

    const result = await tokensService.generateTokens({
      id: 'u-1',
      email: 'user@test.com',
      role: 'CLIENT',
    });

    expect(result.accessToken).toBe('access-jwt-token');
    expect(result.refreshToken).toBe('refresh-jwt-token');
    expect(result.expiresIn).toBe('15m');
    expect(redisMock.set).toHaveBeenCalledWith(
      'auth:refresh:u-1',
      'refresh-jwt-token',
      604800,
    );
  });

  it('should rotate tokens successfully when valid refresh token is supplied', async () => {
    jwtServiceMock.verifyAsync.mockResolvedValue({ sub: 'u-1', tokenType: 'refresh' });
    redisMock.get.mockResolvedValue('valid-refresh-token');
    prismaMock.user.findUnique.mockResolvedValue({
      id: 'u-1',
      email: 'user@test.com',
      role: 'CLIENT',
      isBanned: false,
      isEmailVerified: true,
    });

    jwtServiceMock.signAsync
      .mockResolvedValueOnce('new-access-token')
      .mockResolvedValueOnce('new-refresh-token');

    const result = await tokensService.refreshTokens('valid-refresh-token');

    expect(result.accessToken).toBe('new-access-token');
    expect(result.refreshToken).toBe('new-refresh-token');
    expect(redisMock.set).toHaveBeenCalledWith(
      'auth:refresh:u-1',
      'new-refresh-token',
      604800,
    );
  });

  it('should detect token reuse or revocation and reject with UnauthorizedException', async () => {
    jwtServiceMock.verifyAsync.mockResolvedValue({ sub: 'u-1', tokenType: 'refresh' });
    redisMock.get.mockResolvedValue('already-rotated-token'); // Mismatch!

    await expect(tokensService.refreshTokens('stale-token')).rejects.toThrow(
      UnauthorizedException,
    );
    expect(redisMock.del).toHaveBeenCalledWith('auth:refresh:u-1');
  });

  it('should revoke refresh token upon logout', async () => {
    await tokensService.revokeTokens('u-1');
    expect(redisMock.del).toHaveBeenCalledWith('auth:refresh:u-1');
  });
});
