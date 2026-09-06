import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueueWorkerRunnerService } from '../services/queue-worker-runner.service.js';
import { ProposalModerationSubService } from './proposal-moderation-sub.service.js';
import { ProposalNotificationSubService } from './proposal-notification-sub.service.js';
import { ProposalQueueProcessor } from './proposal-queue.processor.js';

describe('ProposalQueueProcessor & Sub-Services', () => {
  let processor: ProposalQueueProcessor;
  let moderationSubService: ProposalModerationSubService;
  let notificationSubService: ProposalNotificationSubService;
  let runner: QueueWorkerRunnerService;
  let redisQueueMock: any;
  let redisMock: any;
  let prismaMock: any;
  let antiCircumventionMock: any;
  let auditLoggerMock: any;

  beforeEach(() => {
    redisQueueMock = {
      dequeue: vi.fn(),
      moveToDeadLetter: vi.fn().mockResolvedValue(undefined),
    };
    redisMock = {
      set: vi.fn().mockResolvedValue('OK'),
      lpush: vi.fn().mockResolvedValue(1),
    };
    prismaMock = {
      proposal: {
        update: vi.fn().mockResolvedValue({ id: 'prop-1' }),
        findUnique: vi.fn(),
        count: vi.fn().mockResolvedValue(3),
      },
      job: {
        findUnique: vi.fn().mockResolvedValue({
          id: 'job-1',
          title: 'React Website',
          client: { id: 'c-1', email: 'client@test.com' },
        }),
      },
    };
    antiCircumventionMock = {
      scanContent: vi.fn().mockReturnValue({ isFlagged: false, reasons: [] }),
    };
    auditLoggerMock = {
      logAction: vi.fn().mockResolvedValue({ id: 'audit-1' }),
    };

    moderationSubService = new ProposalModerationSubService(
      prismaMock,
      antiCircumventionMock,
      auditLoggerMock,
    );
    notificationSubService = new ProposalNotificationSubService(
      prismaMock,
      redisMock,
    );
    runner = new QueueWorkerRunnerService();

    processor = new ProposalQueueProcessor(
      redisQueueMock,
      redisMock,
      runner,
      moderationSubService,
      notificationSubService,
    );
  });

  it('should return null when queue is empty', async () => {
    redisQueueMock.dequeue.mockResolvedValue(null);

    const result = await processor.processNextJob();
    expect(result).toBeNull();
  });

  it('should process proposal submission and update redis proposal count cache', async () => {
    const mockJob = {
      id: 'job-p1',
      type: 'PROPOSAL_SUBMITTED',
      payload: {
        proposalId: 'prop-1',
        jobId: 'job-1',
        freelancerId: 'f-1',
        coverLetter: 'I will build your site professionally.',
        bidAmount: 600,
        timestamp: new Date().toISOString(),
      },
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };
    redisQueueMock.dequeue.mockResolvedValue(mockJob);

    const processed = await processor.processNextJob();

    expect(processed?.id).toBe('job-p1');
    expect(antiCircumventionMock.scanContent).toHaveBeenCalledWith(
      'I will build your site professionally.',
    );
    expect(redisMock.set).toHaveBeenCalledWith(
      'job:job-1:proposals_count',
      '3',
      3600,
    );
  });

  it('should auto-flag proposal when anti-circumvention triggers', async () => {
    antiCircumventionMock.scanContent.mockReturnValue({
      isFlagged: true,
      reasons: ['Email address detected'],
    });

    const mockJob = {
      id: 'job-p2',
      type: 'PROPOSAL_SUBMITTED',
      payload: {
        proposalId: 'prop-2',
        jobId: 'job-1',
        freelancerId: 'f-2',
        coverLetter: 'Contact me at direct@gmail.com for cheap rates.',
        bidAmount: 200,
        timestamp: new Date().toISOString(),
      },
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };
    redisQueueMock.dequeue.mockResolvedValue(mockJob);

    await processor.processNextJob();

    expect(prismaMock.proposal.update).toHaveBeenCalledWith({
      where: { id: 'prop-2' },
      data: {
        isFlagged: true,
        flagReason: 'Email address detected',
      },
    });
    expect(auditLoggerMock.logAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'PROPOSAL_AUTO_FLAGGED',
        targetId: 'prop-2',
      }),
    );
  });

  it('should send failed job to dead-letter queue after reaching max attempts', async () => {
    const mockJob = {
      id: 'job-p3',
      type: 'PROPOSAL_SUBMITTED',
      payload: { proposalId: 'prop-3', jobId: 'job-1' },
      attempts: 2,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };
    redisQueueMock.dequeue.mockResolvedValue(mockJob);
    prismaMock.job.findUnique.mockRejectedValue(new Error('DB failure'));

    await expect(processor.processNextJob()).rejects.toThrow('DB failure');
    expect(redisQueueMock.moveToDeadLetter).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ id: 'job-p3', attempts: 3 }),
      'DB failure',
    );
  });
});
