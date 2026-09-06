import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisMemoryStoreService {
  private readonly store = new Map<string, string>();
  private readonly lists = new Map<string, string[]>();

  lpush(key: string, ...values: string[]): number {
    if (!this.lists.has(key)) {
      this.lists.set(key, []);
    }
    const list = this.lists.get(key)!;
    list.unshift(...values);
    return list.length;
  }

  rpop(key: string): string | null {
    const list = this.lists.get(key);
    if (!list || list.length === 0) return null;
    return list.pop() ?? null;
  }

  brpop(key: string): [string, string] | null {
    const item = this.rpop(key);
    return item ? [key, item] : null;
  }

  llen(key: string): number {
    return this.lists.get(key)?.length ?? 0;
  }

  del(key: string): number {
    let count = 0;
    if (this.lists.delete(key)) count++;
    if (this.store.delete(key)) count++;
    return count;
  }

  set(key: string, value: string, ttlSeconds?: number): string {
    this.store.set(key, value);
    if (ttlSeconds) {
      setTimeout(() => {
        this.store.delete(key);
      }, ttlSeconds * 1000);
    }
    return 'OK';
  }

  get(key: string): string | null {
    return this.store.get(key) ?? null;
  }
}
