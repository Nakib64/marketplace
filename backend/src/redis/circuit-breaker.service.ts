import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from './redis.service.js';

export type CircuitBreakerType = 'payouts' | 'escrow' | 'maintenance';

interface CacheEntry {
  value: boolean;
  cachedAt: number;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private readonly memoryCache = new Map<CircuitBreakerType, CacheEntry>();
  private readonly cacheTtlMs = 5000; // 5-second cache for sub-millisecond route checks

  private readonly redisKeys: Record<CircuitBreakerType, string> = {
    payouts: 'circuit_breaker:payouts',
    escrow: 'circuit_breaker:escrow',
    maintenance: 'circuit_breaker:maintenance_mode',
  };

  constructor(private readonly redis: RedisService) {}

  /**
   * Checks if a circuit breaker is currently active (with local 5s memory cache).
   */
  async isKilled(type: CircuitBreakerType): Promise<boolean> {
    const cached = this.memoryCache.get(type);
    const now = Date.now();

    if (cached && now - cached.cachedAt < this.cacheTtlMs) {
      return cached.value;
    }

    try {
      const redisVal = await this.redis.get(this.redisKeys[type]);
      const isTripped = redisVal === 'true' || redisVal === '1';
      this.memoryCache.set(type, { value: isTripped, cachedAt: now });
      return isTripped;
    } catch (err: any) {
      this.logger.warn(`Failed reading circuit breaker ${type} from Redis: ${err.message}`);
      return false;
    }
  }

  async isPayoutsKilled(): Promise<boolean> {
    return this.isKilled('payouts');
  }

  async isEscrowKilled(): Promise<boolean> {
    return this.isKilled('escrow');
  }

  async isMaintenanceMode(): Promise<boolean> {
    return this.isKilled('maintenance');
  }

  /**
   * Retrieves current status for all circuit breakers.
   */
  async getAllFlags() {
    const [payouts, escrow, maintenance] = await Promise.all([
      this.isPayoutsKilled(),
      this.isEscrowKilled(),
      this.isMaintenanceMode(),
    ]);

    return {
      payoutsKilled: payouts,
      escrowKilled: escrow,
      maintenanceMode: maintenance,
    };
  }

  /**
   * Toggles or sets a circuit breaker state and invalidates local cache.
   */
  async setFlag(type: CircuitBreakerType, isKilled: boolean): Promise<void> {
    const val = isKilled ? 'true' : 'false';
    await this.redis.set(this.redisKeys[type], val);
    this.memoryCache.set(type, { value: isKilled, cachedAt: Date.now() });
    this.logger.warn(`🚨 Circuit breaker [${type}] changed to: ${isKilled ? 'TRIPPED (HALTED)' : 'NORMAL'}`);
  }
}
