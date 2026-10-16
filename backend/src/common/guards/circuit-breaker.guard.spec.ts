import { ServiceUnavailableException } from '@nestjs/common';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CircuitBreakerGuard } from './circuit-breaker.guard.js';

describe('CircuitBreakerGuard', () => {
  let guard: CircuitBreakerGuard;
  let circuitBreakerMock: any;

  beforeEach(() => {
    circuitBreakerMock = {
      isMaintenanceMode: vi.fn().mockResolvedValue(false),
      isPayoutsKilled: vi.fn().mockResolvedValue(false),
      isEscrowKilled: vi.fn().mockResolvedValue(false),
    };

    guard = new CircuitBreakerGuard(circuitBreakerMock);
  });

  const mockContext = (url: string, method = 'GET') => {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          originalUrl: url,
          url,
          method,
          headers: {},
        }),
      }),
    } as any;
  };

  it('should allow admin routes even when maintenance mode is active', async () => {
    circuitBreakerMock.isMaintenanceMode.mockResolvedValue(true);

    const canActivate = await guard.canActivate(mockContext('/admin/dashboard'));
    expect(canActivate).toBe(true);
  });

  it('should allow health check even when maintenance mode is active', async () => {
    circuitBreakerMock.isMaintenanceMode.mockResolvedValue(true);

    const canActivate = await guard.canActivate(mockContext('/health'));
    expect(canActivate).toBe(true);
  });

  it('should throw ServiceUnavailableException when maintenance mode is active for client routes', async () => {
    circuitBreakerMock.isMaintenanceMode.mockResolvedValue(true);

    await expect(guard.canActivate(mockContext('/jobs'))).rejects.toThrow(
      ServiceUnavailableException,
    );
  });

  it('should throw ServiceUnavailableException on POST /wallet/withdraw when payouts are killed', async () => {
    circuitBreakerMock.isPayoutsKilled.mockResolvedValue(true);

    await expect(
      guard.canActivate(mockContext('/wallet/withdraw', 'POST')),
    ).rejects.toThrow(ServiceUnavailableException);
  });

  it('should allow normal requests when no circuit breaker is active', async () => {
    const canActivate = await guard.canActivate(mockContext('/jobs'));
    expect(canActivate).toBe(true);
  });
});
