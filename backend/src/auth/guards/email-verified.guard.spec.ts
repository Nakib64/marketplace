import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { EmailVerifiedGuard } from './email-verified.guard.js';

describe('EmailVerifiedGuard', () => {
  let guard: EmailVerifiedGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new EmailVerifiedGuard(reflector);
  });

  function createMockContext(user?: any): ExecutionContext {
    const req = { user };
    return {
      switchToHttp: () => ({
        getRequest: () => req,
      }),
      getHandler: () => ({ name: 'handler' }),
      getClass: () => ({ name: 'Controller' }),
    } as any;
  }

  it('should allow request if route does not require email verification', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
    const context = createMockContext({ id: 'u-1', isEmailVerified: false });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should allow request if user email is verified', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const context = createMockContext({ id: 'u-1', isEmailVerified: true });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('should throw ForbiddenException if user email is not verified', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const context = createMockContext({ id: 'u-1', isEmailVerified: false });

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });

  it('should throw ForbiddenException if user context is missing', () => {
    vi.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);
    const context = createMockContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(ForbiddenException);
  });
});
