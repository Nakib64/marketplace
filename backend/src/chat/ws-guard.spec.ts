import { describe, it, expect, vi } from 'vitest';
import { ExecutionContext } from '@nestjs/common';
import { CircuitBreakerGuard } from '../common/guards/circuit-breaker.guard.js';
import { AdminAuditInterceptor } from '../admin/audit/interceptors/admin-audit.interceptor.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RateLimitGuard } from '../auth/guards/rate-limit.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { EmailVerifiedGuard } from '../auth/guards/email-verified.guard.js';

describe('Global Guards and Interceptors on WS Context', () => {
  const mockWsContext = {
    getType: () => 'ws',
    switchToHttp: () => ({
      getRequest: () => undefined,
      getResponse: () => undefined,
    }),
    getHandler: () => () => {},
    getClass: () => class {},
  } as unknown as ExecutionContext;

  it('CircuitBreakerGuard safely allows WS context', async () => {
    const guard = new CircuitBreakerGuard({
      isMaintenanceMode: vi.fn(),
      isPayoutsKilled: vi.fn(),
      isEscrowKilled: vi.fn(),
    } as any);

    const result = await guard.canActivate(mockWsContext);
    expect(result).toBe(true);
  });

  it('AdminAuditInterceptor safely allows WS context', () => {
    const interceptor = new AdminAuditInterceptor({} as any);
    const mockNext = { handle: vi.fn().mockReturnValue('mock_handled') };
    const result = interceptor.intercept(mockWsContext, mockNext as any);
    expect(result).toBe('mock_handled');
    expect(mockNext.handle).toHaveBeenCalled();
  });

  it('JwtAuthGuard safely allows WS context', async () => {
    const guard = new JwtAuthGuard({
      getAllAndOverride: vi.fn().mockReturnValue(false),
    } as any);

    const result = await guard.canActivate(mockWsContext);
    expect(result).toBe(true);
  });

  it('RateLimitGuard safely allows WS context', async () => {
    const guard = new RateLimitGuard(
      { getAllAndOverride: vi.fn().mockReturnValue(null) } as any,
      {} as any,
    );
    const result = await guard.canActivate(mockWsContext);
    expect(result).toBe(true);
  });

  it('RolesGuard safely allows WS context', () => {
    const guard = new RolesGuard({ getAllAndOverride: vi.fn().mockReturnValue([]) } as any);
    const result = guard.canActivate(mockWsContext);
    expect(result).toBe(true);
  });

  it('EmailVerifiedGuard safely allows WS context', () => {
    const guard = new EmailVerifiedGuard({ getAllAndOverride: vi.fn().mockReturnValue(true) } as any);
    const result = guard.canActivate(mockWsContext);
    expect(result).toBe(true);
  });
});
