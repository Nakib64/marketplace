import { randomUUID } from 'node:crypto';
import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from '../../redis/redis.service.js';
import { QueueJob } from '../types/queue-job.types.js';

@Injectable()
export class RedisQueueService {
  private readonly logger = new Logger(RedisQueueService.name);

  public static readonly PROPOSALS_QUEUE = 'marketplace:queue:proposals';
  public static readonly MESSAGES_QUEUE = 'marketplace:queue:messages';
  public static readonly DLQ_PREFIX = 'marketplace:queue:dlq:';

  constructor(private readonly redis: RedisService) {}

  /**
   * Enqueues a new job into the specified Redis queue.
   */
  async enqueue<T>(
    queueName: string,
    type: string,
    payload: T,
    maxAttempts = 3,
  ): Promise<QueueJob<T>> {
    const job: QueueJob<T> = {
      id: randomUUID(),
      type,
      payload,
      attempts: 0,
      maxAttempts,
      createdAt: new Date().toISOString(),
    };

    const serialized = JSON.stringify(job);
    await this.redis.lpush(queueName, serialized);

    this.logger.debug(`Enqueued job [${job.id}] of type "${type}" to queue "${queueName}"`);
    return job;
  }

  /**
   * Dequeues the next job from the tail of the specified queue.
   */
  async dequeue<T = any>(queueName: string): Promise<QueueJob<T> | null> {
    const serialized = await this.redis.rpop(queueName);
    if (!serialized) {
      return null;
    }

    try {
      return JSON.parse(serialized) as QueueJob<T>;
    } catch (err: any) {
      this.logger.error(
        `Failed to parse dequeued job payload from queue "${queueName}": ${err.message}`,
      );
      return null;
    }
  }

  /**
   * Blocking dequeue from the tail of the specified queue.
   */
  async blockingDequeue<T = any>(
    queueName: string,
    timeoutSec = 2,
  ): Promise<QueueJob<T> | null> {
    const result = await this.redis.brpop(queueName, timeoutSec);
    if (!result || !result[1]) {
      return null;
    }

    try {
      return JSON.parse(result[1]) as QueueJob<T>;
    } catch (err: any) {
      this.logger.error(
        `Failed to parse blocking-dequeued job payload from queue "${queueName}": ${err.message}`,
      );
      return null;
    }
  }

  /**
   * Moves an exhausted job to the Dead-Letter Queue (DLQ).
   */
  async moveToDeadLetter<T = any>(
    queueName: string,
    job: QueueJob<T>,
    errorMsg: string,
  ): Promise<void> {
    const dlqKey = `${RedisQueueService.DLQ_PREFIX}${queueName}`;
    const failedJob: QueueJob<T> = {
      ...job,
      lastError: errorMsg,
      processedAt: new Date().toISOString(),
    };

    await this.redis.lpush(dlqKey, JSON.stringify(failedJob));
    this.logger.error(
      `Job [${job.id}] moved to Dead-Letter Queue "${dlqKey}" after ${job.attempts} attempts. Error: ${errorMsg}`,
    );
  }

  /**
   * Gets pending job count in a queue.
   */
  async getQueueLength(queueName: string): Promise<number> {
    return this.redis.llen(queueName);
  }

  /**
   * Purges a queue.
   */
  async clearQueue(queueName: string): Promise<number> {
    return this.redis.del(queueName);
  }

  /**
   * Retrieves queue statistics (pending and DLQ counts).
   */
  async getQueueStats(queueName: string): Promise<{ pending: number; deadLetter: number }> {
    const dlqKey = `${RedisQueueService.DLQ_PREFIX}${queueName}`;
    const [pending, deadLetter] = await Promise.all([
      this.redis.llen(queueName),
      this.redis.llen(dlqKey),
    ]);

    return { pending, deadLetter };
  }
}
