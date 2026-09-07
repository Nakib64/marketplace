import { describe, expect, it, vi } from 'vitest';
import { AdminRole } from '@prisma/client';
import { AdminAuthController } from './admin-auth.controller.js';
import {
  ADMIN_ACCESS_TOKEN_COOKIE,
  ADMIN_REFRESH_TOKEN_COOKIE,
} from '../../auth/utils/cookie.util.js';

describe('AdminAuthController (Cookie-Based Authentication)', () => {
  const adminAuthServiceMock = {
    login: vi.fn(),
    refreshToken: vi.fn(),
    logout: vi.fn(),
    getProfile: vi.fn(),
  };

  const controller = new AdminAuthController(adminAuthServiceMock as any);

  const mockResponse = () => {
    const res: any = {};
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    return res;
  };

  it('should set admin_access_token and admin_refresh_token cookies on login', async () => {
    adminAuthServiceMock.login.mockResolvedValueOnce({
      accessToken: 'admin.access.jwt',
      refreshToken: 'admin.refresh.jwt',
      expiresIn: '24h',
      admin: {
        id: 'admin-1',
        email: 'admin@marketplace.com',
        role: AdminRole.SUPER_ADMIN,
      },
    });

    const res = mockResponse();
    const result = await controller.login(
      { email: 'admin@marketplace.com', password: 'Password123!' },
      res,
    );

    expect(result.accessToken).toBe('admin.access.jwt');
    expect(res.cookie).toHaveBeenCalledWith(
      ADMIN_ACCESS_TOKEN_COOKIE,
      'admin.access.jwt',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      ADMIN_REFRESH_TOKEN_COOKIE,
      'admin.refresh.jwt',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }),
    );
  });

  it('should read admin refresh token from cookie and rotate cookies on refresh', async () => {
    adminAuthServiceMock.refreshToken.mockResolvedValueOnce({
      accessToken: 'rotated.admin.access.jwt',
      refreshToken: 'rotated.admin.refresh.jwt',
      expiresIn: '24h',
      admin: {
        id: 'admin-1',
        email: 'admin@marketplace.com',
        role: AdminRole.SUPER_ADMIN,
      },
    });

    const req: any = {
      cookies: { [ADMIN_REFRESH_TOKEN_COOKIE]: 'cookie.admin.refresh.jwt' },
    };
    const res = mockResponse();

    const result = await controller.refresh(req, {} as any, res);

    expect(adminAuthServiceMock.refreshToken).toHaveBeenCalledWith(
      'cookie.admin.refresh.jwt',
    );
    expect(res.cookie).toHaveBeenCalledWith(
      ADMIN_ACCESS_TOKEN_COOKIE,
      'rotated.admin.access.jwt',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      ADMIN_REFRESH_TOKEN_COOKIE,
      'rotated.admin.refresh.jwt',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(result.accessToken).toBe('rotated.admin.access.jwt');
  });

  it('should clear admin cookies on logout', async () => {
    adminAuthServiceMock.logout.mockResolvedValueOnce({
      message: 'Admin session revoked successfully',
    });

    const res = mockResponse();
    const result = await controller.logout('admin-1', res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      ADMIN_ACCESS_TOKEN_COOKIE,
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      ADMIN_REFRESH_TOKEN_COOKIE,
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
    expect(result.message).toBe('Admin session revoked successfully');
  });
});
