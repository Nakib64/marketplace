import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { RedisService } from '../../redis/redis.service.js';
import { RATE_LIMIT_KEY, RateLimitOptions } from '../decorators/rate-limit.decorator.js';

@Injectable()
export class RateLimitGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly redis: RedisService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const options = this.reflector.getAllAndOverride<RateLimitOptions>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return true;
    }

    const http = context.switchToHttp();
    const req = http.getRequest<Request>();
    const res = http.getResponse<Response>();

    const ip =
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ||
      req.socket.remoteAddress ||
      req.ip ||
      'unknown_ip';

    const userId = (req as any).user?.id;
    const clientIdentifier = userId || ip;
    const routeIdentifier = `${context.getClass().name}:${context.getHandler().name}`;
    const redisKey = `rate_limit:${clientIdentifier}:${routeIdentifier}`;

    const currentCountStr = await this.redis.get(redisKey);
    const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;

    if (currentCount >= options.limit) {
      if (res && typeof res.setHeader === 'function') {
        res.setHeader('Retry-After', options.ttlSeconds.toString());
        res.setHeader('X-RateLimit-Limit', options.limit.toString());
        res.setHeader('X-RateLimit-Remaining', '0');
      }

      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: `Too many requests. Limit exceeded (${options.limit} requests per ${options.ttlSeconds}s). Please try again later.`,
          retryAfter: options.ttlSeconds,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    const newCount = currentCount + 1;
    await this.redis.set(redisKey, newCount.toString(), options.ttlSeconds);

    if (res && typeof res.setHeader === 'function') {
      res.setHeader('X-RateLimit-Limit', options.limit.toString());
      res.setHeader('X-RateLimit-Remaining', (options.limit - newCount).toString());
    }

    return true;
  }
}
