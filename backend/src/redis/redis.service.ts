import { Injectable, Logger } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisClientService } from './services/redis-client.service.js';
import { RedisMemoryStoreService } from './services/redis-memory-store.service.js';

@Injectable()
export class RedisService {
  private readonly logger = new Logger(RedisService.name);

  constructor(
    private readonly clientService: RedisClientService,
    private readonly memoryStore: RedisMemoryStoreService,
  ) {}

  isReady(): boolean {
    return this.clientService.isReady();
  }

  getClient(): Redis | null {
    return this.clientService.getClient();
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    const client = this.getClient();
    if (this.isReady() && client) {
      try {
        return await client.lpush(key, ...values);
      } catch (err: any) {
        this.logger.warn(`Redis lpush error: ${err.message}. Fallback used.`);
      }
    }
    return this.memoryStore.lpush(key, ...values);
  }

  async rpop(key: string): Promise<string | null> {
    const client = this.getClient();
    if (this.isReady() && client) {
      try {
        return await client.rpop(key);
      } catch (err: any) {
        this.logger.warn(`Redis rpop error: ${err.message}. Fallback used.`);
      }
    }
    return this.memoryStore.rpop(key);
  }

  async brpop(key: string, timeoutSec = 1): Promise<[string, string] | null> {
    const client = this.getClient();
    if (this.isReady() && client) {
      try {
        const res = await client.brpop(key, timeoutSec);
        return res as [string, string] | null;
      } catch (err: any) {
        this.logger.warn(`Redis brpop error: ${err.message}. Fallback used.`);
      }
    }
    return this.memoryStore.brpop(key);
  }

  async llen(key: string): Promise<number> {
    const client = this.getClient();
    if (this.isReady() && client) {
      try {
        return await client.llen(key);
      } catch (err: any) {
        this.logger.warn(`Redis llen error: ${err.message}. Fallback used.`);
      }
    }
    return this.memoryStore.llen(key);
  }

  async del(key: string): Promise<number> {
    const client = this.getClient();
    if (this.isReady() && client) {
      try {
        return await client.del(key);
      } catch (err: any) {
        this.logger.warn(`Redis del error: ${err.message}. Fallback used.`);
      }
    }
    return this.memoryStore.del(key);
  }

  async set(key: string, value: string, ttlSeconds?: number): Promise<string | null> {
    const client = this.getClient();
    if (this.isReady() && client) {
      try {
        if (ttlSeconds) return await client.set(key, value, 'EX', ttlSeconds);
        return await client.set(key, value);
      } catch (err: any) {
        this.logger.warn(`Redis set error: ${err.message}. Fallback used.`);
      }
    }
    return this.memoryStore.set(key, value, ttlSeconds);
  }

  async get(key: string): Promise<string | null> {
    const client = this.getClient();
    if (this.isReady() && client) {
      try {
        return await client.get(key);
      } catch (err: any) {
        this.logger.warn(`Redis get error: ${err.message}. Fallback used.`);
      }
    }
    return this.memoryStore.get(key);
  }
}
