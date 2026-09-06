import { beforeEach, describe, expect, it, vi } from 'vitest';
import { RedisQueueService } from './redis-queue.service.js';

describe('RedisQueueService', () => {
  let queueService: RedisQueueService;
  let redisServiceMock: any;

  beforeEach(() => {
    redisServiceMock = {
      lpush: vi.fn().mockResolvedValue(1),
      rpop: vi.fn(),
      brpop: vi.fn(),
      llen: vi.fn().mockResolvedValue(0),
      del: vi.fn().mockResolvedValue(1),
    };

    queueService = new RedisQueueService(redisServiceMock);
  });

  it('should enqueue a job with unique id and correct payload', async () => {
    const job = await queueService.enqueue(
      RedisQueueService.PROPOSALS_QUEUE,
      'PROPOSAL_SUBMITTED',
      { proposalId: 'prop-123' },
    );

    expect(job.id).toBeDefined();
    expect(job.type).toBe('PROPOSAL_SUBMITTED');
    expect(job.attempts).toBe(0);
    expect(job.payload).toEqual({ proposalId: 'prop-123' });
    expect(redisServiceMock.lpush).toHaveBeenCalledWith(
      RedisQueueService.PROPOSALS_QUEUE,
      expect.stringContaining('prop-123'),
    );
  });

  it('should dequeue a job and parse its JSON structure', async () => {
    const mockJob = {
      id: 'job-1',
      type: 'PROPOSAL_SUBMITTED',
      payload: { proposalId: 'prop-1' },
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };
    redisServiceMock.rpop.mockResolvedValue(JSON.stringify(mockJob));

    const job = await queueService.dequeue(RedisQueueService.PROPOSALS_QUEUE);
    expect(job).toEqual(mockJob);
    expect(redisServiceMock.rpop).toHaveBeenCalledWith(RedisQueueService.PROPOSALS_QUEUE);
  });

  it('should return null when dequeueing from an empty queue', async () => {
    redisServiceMock.rpop.mockResolvedValue(null);

    const job = await queueService.dequeue(RedisQueueService.PROPOSALS_QUEUE);
    expect(job).toBeNull();
  });

  it('should move failed job to dead letter queue', async () => {
    const mockJob = {
      id: 'job-failed',
      type: 'MESSAGE_SENT',
      payload: { messageId: 'm-1' },
      attempts: 3,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };

    await queueService.moveToDeadLetter(
      RedisQueueService.MESSAGES_QUEUE,
      mockJob,
      'Database connection timeout',
    );

    expect(redisServiceMock.lpush).toHaveBeenCalledWith(
      `${RedisQueueService.DLQ_PREFIX}${RedisQueueService.MESSAGES_QUEUE}`,
      expect.stringContaining('Database connection timeout'),
    );
  });

  it('should return queue statistics with pending and deadLetter counts', async () => {
    redisServiceMock.llen
      .mockResolvedValueOnce(5) // pending
      .mockResolvedValueOnce(2); // deadLetter

    const stats = await queueService.getQueueStats(RedisQueueService.PROPOSALS_QUEUE);
    expect(stats).toEqual({ pending: 5, deadLetter: 2 });
  });
});
