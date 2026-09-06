import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { RedisService } from '../../redis/redis.service.js';
import { QueueWorkerRunnerService } from '../services/queue-worker-runner.service.js';
import { RedisQueueService } from '../services/redis-queue.service.js';
import { ProposalJobPayload } from '../types/proposal-job.types.js';
import { QueueJob } from '../types/queue-job.types.js';
import { ProposalModerationSubService } from './proposal-moderation-sub.service.js';
import { ProposalNotificationSubService } from './proposal-notification-sub.service.js';

@Injectable()
export class ProposalQueueProcessor implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ProposalQueueProcessor.name);

  constructor(
    private readonly redisQueue: RedisQueueService,
    private readonly redis: RedisService,
    private readonly runner: QueueWorkerRunnerService,
    private readonly moderationService: ProposalModerationSubService,
    private readonly notificationService: ProposalNotificationSubService,
  ) {}

  onModuleInit() {
    this.startWorker();
  }

  onModuleDestroy() {
    this.stopWorker();
  }

  startWorker() {
    this.runner.start('ProposalQueue', async () => {
      await this.processNextJob();
    });
  }

  stopWorker() {
    this.runner.stop();
  }

  /**
   * Dequeues and processes a single proposal job.
   */
  async processNextJob(): Promise<QueueJob<ProposalJobPayload> | null> {
    const job = await this.redisQueue.dequeue<ProposalJobPayload>(
      RedisQueueService.PROPOSALS_QUEUE,
    );
    if (!job) return null;

    job.attempts++;
    try {
      await this.handleJob(job);
      job.processedAt = new Date().toISOString();
      this.logger.debug(`Successfully processed proposal job [${job.id}]`);
      return job;
    } catch (err: any) {
      this.logger.error(
        `Failed processing proposal job [${job.id}] (Attempt ${job.attempts}/${job.maxAttempts}): ${err.message}`,
      );

      if (job.attempts >= job.maxAttempts) {
        await this.redisQueue.moveToDeadLetter(
          RedisQueueService.PROPOSALS_QUEUE,
          job,
          err.message,
        );
      } else {
        await this.redis.lpush(RedisQueueService.PROPOSALS_QUEUE, JSON.stringify(job));
      }
      throw err;
    }
  }

  /**
   * Delegates job execution to moderation and notification sub-services.
   */
  async handleJob(job: QueueJob<ProposalJobPayload>): Promise<void> {
    const { payload } = job;

    switch (job.type) {
      case 'PROPOSAL_SUBMITTED':
      case 'PROPOSAL_UPDATED':
        await this.moderationService.scanAndModerate(payload.proposalId, payload.coverLetter);
        await this.notificationService.notifyClientOnProposal(payload.jobId, payload.bidAmount);
        break;

      case 'PROPOSAL_STATUS_CHANGED':
        await this.notificationService.notifyFreelancerOnStatusChange(payload.proposalId, payload.newStatus);
        break;

      default:
        this.logger.warn(`Unknown proposal job type: ${job.type}`);
    }
  }
}
