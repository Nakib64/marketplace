import { ConfigService } from '@nestjs/config';
import { beforeEach, describe, expect, it } from 'vitest';
import { RedisService } from './redis.service.js';
import { RedisClientService } from './services/redis-client.service.js';
import { RedisMemoryStoreService } from './services/redis-memory-store.service.js';

describe('Redis Sub-Services & Facade', () => {
  let redisService: RedisService;
  let clientService: RedisClientService;
  let memoryStore: RedisMemoryStoreService;

  beforeEach(async () => {
    const configServiceMock = {
      get: (key: string, defaultValue?: any) => {
        if (key === 'REDIS_HOST') return '127.0.0.1';
        if (key === 'REDIS_PORT') return 9999;
        return defaultValue;
      },
    };

    clientService = new RedisClientService(configServiceMock as ConfigService);
    await clientService.onModuleInit();

    memoryStore = new RedisMemoryStoreService();
    redisService = new RedisService(clientService, memoryStore);
  });

  it('should push and pop items via memory store fallback', async () => {
    const len1 = await redisService.lpush('test:list', 'item1');
    expect(len1).toBe(1);

    const len2 = await redisService.lpush('test:list', 'item2');
    expect(len2).toBe(2);
    expect(await redisService.llen('test:list')).toBe(2);

    const popped = await redisService.rpop('test:list');
    expect(popped).toBe('item1');

    const popped2 = await redisService.rpop('test:list');
    expect(popped2).toBe('item2');
  });

  it('should set, get, and delete values via memory fallback', async () => {
    await redisService.set('key-1', 'val-1');
    expect(await redisService.get('key-1')).toBe('val-1');

    await redisService.del('key-1');
    expect(await redisService.get('key-1')).toBeNull();
  });

  it('should handle blocking pop in fallback mode', async () => {
    await redisService.lpush('test:bpop', 'hello');
    const result = await redisService.brpop('test:bpop', 1);
    expect(result).toEqual(['test:bpop', 'hello']);
  });

  it('should cleanly disconnect client onModuleDestroy', async () => {
    await expect(clientService.onModuleDestroy()).resolves.not.toThrow();
  });
});
