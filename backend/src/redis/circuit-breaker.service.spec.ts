import { describe, expect, it, vi, beforeEach } from 'vitest';
import { CircuitBreakerService } from './circuit-breaker.service.js';

describe('CircuitBreakerService', () => {
  let service: CircuitBreakerService;
  let redisMock: any;

  beforeEach(() => {
    redisMock = {
      get: vi.fn(),
      set: vi.fn().mockResolvedValue('OK'),
    };

    service = new CircuitBreakerService(redisMock);
  });

  it('should return false when circuit breaker is normal', async () => {
    redisMock.get.mockResolvedValue('false');

    const isKilled = await service.isPayoutsKilled();
    expect(isKilled).toBe(false);
  });

  it('should return true when circuit breaker is tripped', async () => {
    redisMock.get.mockResolvedValue('true');

    const isKilled = await service.isEscrowKilled();
    expect(isKilled).toBe(true);
  });

  it('should toggle circuit breaker flag in Redis', async () => {
    await service.setFlag('maintenance', true);

    expect(redisMock.set).toHaveBeenCalledWith('circuit_breaker:maintenance_mode', 'true');
    const isMaintenance = await service.isMaintenanceMode();
    expect(isMaintenance).toBe(true);
  });

  it('should return all flags in getAllFlags', async () => {
    redisMock.get.mockImplementation((key: string) => {
      if (key === 'circuit_breaker:payouts') return Promise.resolve('true');
      return Promise.resolve('false');
    });

    const flags = await service.getAllFlags();
    expect(flags.payoutsKilled).toBe(true);
    expect(flags.escrowKilled).toBe(false);
    expect(flags.maintenanceMode).toBe(false);
  });
});
