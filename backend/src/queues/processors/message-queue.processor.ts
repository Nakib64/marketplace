import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service.js';
import { QueueWorkerRunnerService } from '../services/queue-worker-runner.service.js';
import { RedisQueueService } from '../services/redis-queue.service.js';
import { MessageJobPayload } from '../types/message-job.types.js';
import { QueueJob } from '../types/queue-job.types.js';
import { MessageModerationSubService } from './message-moderation-sub.service.js';
import { MessageNotificationSubService } from './message-notification-sub.service.js';

@Injectable()
export class MessageQueueProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(MessageQueueProcessor.name);

  constructor(
    private readonly redisQueue: RedisQueueService,
    private readonly redis: RedisService,
    private readonly runner: QueueWorkerRunnerService,
    private readonly moderationService: MessageModerationSubService,
    private readonly notificationService: MessageNotificationSubService,
  ) {}

  onModuleInit() {
    this.startWorker();
  }

  onModuleDestroy() {
    this.stopWorker();
  }

  startWorker() {
    this.runner.start('MessageQueue', async () => {
      await this.processNextJob();
    });
  }

  stopWorker() {
    this.runner.stop();
  }

  /**
   * Dequeues and processes a single message job.
   */
  async processNextJob(): Promise<QueueJob<MessageJobPayload> | null> {
    const job = await this.redisQueue.dequeue<MessageJobPayload>(
      RedisQueueService.MESSAGES_QUEUE,
    );
    if (!job) return null;

    job.attempts++;
    try {
      await this.handleJob(job);
      job.processedAt = new Date().toISOString();
      this.logger.debug(`Successfully processed message job [${job.id}]`);
      return job;
    } catch (err: any) {
      this.logger.error(
        `Failed processing message job [${job.id}] (Attempt ${job.attempts}/${job.maxAttempts}): ${err.message}`,
      );

      if (job.attempts >= job.maxAttempts) {
        await this.redisQueue.moveToDeadLetter(
          RedisQueueService.MESSAGES_QUEUE,
          job,
          err.message,
        );
      } else {
        await this.redis.lpush(RedisQueueService.MESSAGES_QUEUE, JSON.stringify(job));
      }
      throw err;
    }
  }

  /**
   * Delegates message processing to moderation and notification sub-services.
   */
  async handleJob(job: QueueJob<MessageJobPayload>): Promise<void> {
    const { payload } = job;

    switch (job.type) {
      case 'MESSAGE_SENT':
      case 'FILE_SHARED':
      case 'PROPOSAL_REPLIED':
        await this.moderationService.scanAndModerate(payload.messageId, payload.content);
        await this.notificationService.notifyAndTrackActivity(
          payload.conversationId,
          payload.senderId,
          payload.recipientId,
          payload.messageType,
          payload.timestamp,
        );
        break;

      default:
        this.logger.warn(`Unknown message job type: ${job.type}`);
    }
  }
}
