import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RateLimitGuard } from './rate-limit.guard.js';

describe('RateLimitGuard (Distributed Sliding Rate Limiter)', () => {
  let guard: RateLimitGuard;
  let reflector: Reflector;
  let redisMock: any;

  beforeEach(() => {
    reflector = new Reflector();
    redisMock = {
      get: vi.fn(),
      set: vi.fn().mockResolvedValue('OK'),
    };
    guard = new RateLimitGuard(reflector, redisMock);
  });

  function createMockContext(
    ip = '192.168.1.1',
    user?: any,
  ): { context: ExecutionContext; resHeaders: Record<string, string> } {
    const resHeaders: Record<string, string> = {};
    const req: any = {
      headers: {},
      socket: { remoteAddress: ip },
      user,
    };
    const res: any = {
      setHeader: vi.fn((key: string, val: string) => {
        resHeaders[key] = val;
      }),
    };

    const context: any = {
      switchToHttp: () => ({
        getRequest: () => req,
        getResponse: () => res,
      }),
      getHandler: () => ({ name: 'testHandler' }),
      getClass: () => ({ name: 'TestController' }),
    };

    return { context, resHeaders };
  }

  it('should allow request if no @RateLimit decorator is present', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
    const { context } = createMockContext();

    const allowed = await guard.canActivate(context);
    expect(allowed).toBe(true);
    expect(redisMock.get).not.toHaveBeenCalled();
  });

  it('should allow request and increment counter when below limit', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ limit: 5, ttlSeconds: 60 });
    redisMock.get.mockResolvedValue('2');
    const { context, resHeaders } = createMockContext('10.0.0.1');

    const allowed = await guard.canActivate(context);
    expect(allowed).toBe(true);
    expect(redisMock.set).toHaveBeenCalledWith(
      'rate_limit:10.0.0.1:TestController:testHandler',
      '3',
      60,
    );
    expect(resHeaders['X-RateLimit-Limit']).toBe('5');
    expect(resHeaders['X-RateLimit-Remaining']).toBe('2');
  });

  it('should throw 429 Too Many Requests when limit is exceeded', async () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue({ limit: 5, ttlSeconds: 60 });
    redisMock.get.mockResolvedValue('5');
    const { context, resHeaders } = createMockContext('10.0.0.1');

    await expect(guard.canActivate(context)).rejects.toThrow(HttpException);
    expect(resHeaders['Retry-After']).toBe('60');
    expect(resHeaders['X-RateLimit-Remaining']).toBe('0');
  });
});
