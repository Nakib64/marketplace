import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisClientService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisClientService.name);
  private client: Redis | null = null;
  private isConnected = false;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const rawHost = this.configService.get<string>('REDIS_HOST', 'localhost');
    const port = Number(this.configService.get<number>('REDIS_PORT', 6379));
    const password = this.configService.get<string>('REDIS_PASSWORD');
    const redisUrl = this.configService.get<string>('REDIS_URL');
    const tlsConfig = this.configService.get<string>('REDIS_TLS');

    let host = rawHost;
    let effectivePassword = password;
    let effectivePort = port;
    let effectiveTls = tlsConfig === 'true';

    // Auto-parse if a full redis-cli command or redis connection URI was passed
    if (rawHost && (rawHost.startsWith('redis://') || rawHost.startsWith('rediss://') || rawHost.includes('redis-cli'))) {
      const match = rawHost.match(/(?:redis|rediss):\/\/(?:([^:]+):)?([^@]+)@([^:/]+)(?::(\d+))?/);
      if (match) {
        effectivePassword = match[2];
        host = match[3];
        if (match[4]) effectivePort = Number(match[4]);
      }
      if (rawHost.includes('--tls') || rawHost.startsWith('rediss://')) {
        effectiveTls = true;
      }
    }

    if (host.includes('upstash.io') || (redisUrl && redisUrl.includes('upstash.io'))) {
      effectiveTls = true;
    }

    try {
      const options: any = {
        host,
        port: effectivePort,
        password: effectivePassword || undefined,
        lazyConnect: true,
        maxRetriesPerRequest: null,
        enableOfflineQueue: false,
        retryStrategy: (times: number) => {
          if (times > 3) return null;
          return Math.min(times * 1000, 3000);
        },
      };

      if (effectiveTls) {
        options.tls = {};
      }

      if (redisUrl) {
        const urlOptions: any = {
          lazyConnect: true,
          maxRetriesPerRequest: null,
          enableOfflineQueue: false,
          retryStrategy: (times: number) => {
            if (times > 3) return null;
            return Math.min(times * 1000, 3000);
          },
        };
        if (effectiveTls) {
          urlOptions.tls = {};
        }
        this.client = new Redis(redisUrl, urlOptions);
      } else {
        this.client = new Redis(options);
      }

      this.client.on('connect', () => {
        this.isConnected = true;
        this.logger.log(`Connected to Redis at ${host}:${effectivePort} (TLS: ${effectiveTls})`);
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
        this.logger.warn(`Redis connection error: ${err.message}. Using fallback.`);
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });

      await this.client.connect().catch((err) => {
        if (
          !err.message?.includes('already connecting') &&
          !err.message?.includes('already connected')
        ) {
          this.isConnected = false;
          this.logger.warn(
            `Could not connect to Redis at ${host}:${effectivePort} (${err.message}). Using fallback.`,
          );
        }
      });
    } catch (err: any) {
      this.isConnected = false;
      this.logger.warn(`Redis initialization failed: ${err.message}. Using fallback.`);
    }
  }

  async onModuleDestroy() {
    if (this.client) {
      try {
        await this.client.quit();
      } catch {
        this.client.disconnect();
      }
      this.client = null;
    }
  }

  isReady(): boolean {
    return this.isConnected && this.client !== null;
  }

  getClient(): Redis | null {
    return this.client;
  }
}
