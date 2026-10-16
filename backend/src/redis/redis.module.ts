import { Global, Module } from '@nestjs/common';
import { CircuitBreakerService } from './circuit-breaker.service.js';
import { RedisService } from './redis.service.js';
import { RedisClientService } from './services/redis-client.service.js';
import { RedisMemoryStoreService } from './services/redis-memory-store.service.js';

@Global()
@Module({
  providers: [
    RedisClientService,
    RedisMemoryStoreService,
    RedisService,
    CircuitBreakerService,
  ],
  exports: [
    RedisClientService,
    RedisMemoryStoreService,
    RedisService,
    CircuitBreakerService,
  ],
})
export class RedisModule {}
