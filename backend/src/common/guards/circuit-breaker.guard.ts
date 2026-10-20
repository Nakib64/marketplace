import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CircuitBreakerService } from '../../redis/circuit-breaker.service.js';

@Injectable()
export class CircuitBreakerGuard implements CanActivate {
  constructor(private readonly circuitBreaker: CircuitBreakerService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    if (typeof context.getType === 'function' && context.getType() !== 'http') {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const url = req?.originalUrl || req?.url || '';
    const method = req?.method?.toUpperCase() || '';

    // 1. Staff and Admin routes are NEVER blocked by circuit breakers or maintenance mode
    if (url.startsWith('/admin') || url.startsWith('/health')) {
      return true;
    }

    // 2. Global Maintenance Mode: Blocks all non-admin customer requests
    if (await this.circuitBreaker.isMaintenanceMode()) {
      throw new ServiceUnavailableException({
        statusCode: 503,
        error: 'Service Unavailable',
        message: 'The platform is currently undergoing scheduled maintenance. Please check back shortly.',
        maintenanceMode: true,
      });
    }

    // 3. Payout Kill Switch: Halts new withdrawal requests
    if (method === 'POST' && (url.includes('/wallet/withdraw') || url.endsWith('/withdraw'))) {
      if (await this.circuitBreaker.isPayoutsKilled()) {
        throw new ServiceUnavailableException({
          statusCode: 503,
          error: 'Service Unavailable',
          message: 'Withdrawal requests are temporarily paused for ledger reconciliation. Please check back shortly.',
          circuitBreaker: 'payouts',
        });
      }
    }

    // 4. Escrow Funding Kill Switch: Halts new contract escrow creation
    if (method === 'POST' && url.includes('/contracts') && !url.includes('/submit-work') && !url.includes('/approve')) {
      if (await this.circuitBreaker.isEscrowKilled()) {
        throw new ServiceUnavailableException({
          statusCode: 503,
          error: 'Service Unavailable',
          message: 'New contract escrow funding is temporarily paused. Please check back shortly.',
          circuitBreaker: 'escrow',
        });
      }
    }

    return true;
  }
}
