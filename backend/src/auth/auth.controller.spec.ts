import { describe, expect, it, vi } from 'vitest';
import { AuthController } from './auth.controller.js';
import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
} from './utils/cookie.util.js';

describe('AuthController (Cookie-Based Authentication)', () => {
  const authServiceMock = {
    register: vi.fn(),
    login: vi.fn(),
    refreshToken: vi.fn(),
    logout: vi.fn(),
  };

  const controller = new AuthController(authServiceMock as any);

  const mockResponse = () => {
    const res: any = {};
    res.cookie = vi.fn().mockReturnValue(res);
    res.clearCookie = vi.fn().mockReturnValue(res);
    return res;
  };

  it('should set access_token and refresh_token cookies on login', async () => {
    authServiceMock.login.mockResolvedValueOnce({
      accessToken: 'jwt.access.token',
      refreshToken: 'jwt.refresh.token',
      expiresIn: '24h',
      user: { id: 'u1', email: 'client@test.com', role: 'CLIENT' },
    });

    const res = mockResponse();
    const result = await controller.login(
      { email: 'client@test.com', password: 'password123' },
      res,
    );

    expect(result.user).toEqual(expect.objectContaining({ id: 'u1' }));
    expect(result.message).toBe('Login successful');
    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'jwt.access.token',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      'jwt.refresh.token',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      }),
    );
  });

  it('should read refresh token from cookie and rotate cookies on refresh', async () => {
    authServiceMock.refreshToken.mockResolvedValueOnce({
      accessToken: 'new.access.token',
      refreshToken: 'new.refresh.token',
      expiresIn: '24h',
      user: { id: 'u1', email: 'client@test.com', role: 'CLIENT' },
    });

    const req: any = {
      cookies: { [REFRESH_TOKEN_COOKIE]: 'cookie.refresh.token' },
    };
    const res = mockResponse();

    const result = await controller.refresh(req, {} as any, res);

    expect(authServiceMock.refreshToken).toHaveBeenCalledWith('cookie.refresh.token');
    expect(res.cookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      'new.access.token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(res.cookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      'new.refresh.token',
      expect.objectContaining({ httpOnly: true }),
    );
    expect(result.message).toBe('Token refreshed successfully');
  });

  it('should clear cookies on logout', async () => {
    authServiceMock.logout.mockResolvedValueOnce({
      message: 'Logged out successfully',
    });

    const res = mockResponse();
    const result = await controller.logout('u1', res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      ACCESS_TOKEN_COOKIE,
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
    expect(res.clearCookie).toHaveBeenCalledWith(
      REFRESH_TOKEN_COOKIE,
      expect.objectContaining({ httpOnly: true, path: '/' }),
    );
    expect(result.message).toBe('Logged out successfully');
  });
});
