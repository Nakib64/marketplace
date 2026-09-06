import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis.service.js';
import { RedisClientService } from './services/redis-client.service.js';
import { RedisMemoryStoreService } from './services/redis-memory-store.service.js';

@Global()
@Module({
  providers: [RedisClientService, RedisMemoryStoreService, RedisService],
  exports: [RedisClientService, RedisMemoryStoreService, RedisService],
})
export class RedisModule {}
