import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueueWorkerRunnerService } from '../services/queue-worker-runner.service.js';
import { MessageModerationSubService } from './message-moderation-sub.service.js';
import { MessageNotificationSubService } from './message-notification-sub.service.js';
import { MessageQueueProcessor } from './message-queue.processor.js';

describe('MessageQueueProcessor & Sub-Services', () => {
  let processor: MessageQueueProcessor;
  let moderationSubService: MessageModerationSubService;
  let notificationSubService: MessageNotificationSubService;
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
      message: {
        findUnique: vi.fn().mockResolvedValue({ id: 'msg-1', isFlagged: false }),
        update: vi.fn().mockResolvedValue({ id: 'msg-1' }),
      },
      user: {
        findUnique: vi.fn().mockImplementation(({ where }: any) => {
          if (where.id === 'sender-1') return Promise.resolve({ id: 'sender-1', email: 'sender@test.com', role: 'CLIENT' });
          if (where.id === 'recipient-1') return Promise.resolve({ id: 'recipient-1', email: 'recipient@test.com', role: 'FREELANCER' });
          return Promise.resolve(null);
        }),
      },
    };
    antiCircumventionMock = {
      scanContent: vi.fn().mockReturnValue({ isFlagged: false, reasons: [] }),
    };
    auditLoggerMock = {
      logAction: vi.fn().mockResolvedValue({ id: 'audit-2' }),
    };

    moderationSubService = new MessageModerationSubService(
      prismaMock,
      antiCircumventionMock,
      auditLoggerMock,
    );
    notificationSubService = new MessageNotificationSubService(
      prismaMock,
      redisMock,
    );
    runner = new QueueWorkerRunnerService();

    processor = new MessageQueueProcessor(
      redisQueueMock,
      redisMock,
      runner,
      moderationSubService,
      notificationSubService,
    );
  });

  it('should return null when message queue is empty', async () => {
    redisQueueMock.dequeue.mockResolvedValue(null);

    const result = await processor.processNextJob();
    expect(result).toBeNull();
  });

  it('should process message, update redis conversation activity, and notify offline recipient', async () => {
    const timestamp = new Date().toISOString();
    const mockJob = {
      id: 'job-m1',
      type: 'MESSAGE_SENT',
      payload: {
        messageId: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'sender-1',
        recipientId: 'recipient-1',
        content: 'Hello, looking forward to working with you!',
        messageType: 'TEXT',
        timestamp,
      },
      attempts: 0,
      maxAttempts: 3,
      createdAt: timestamp,
    };
    redisQueueMock.dequeue.mockResolvedValue(mockJob);

    const processed = await processor.processNextJob();

    expect(processed?.id).toBe('job-m1');
    expect(redisMock.set).toHaveBeenCalledWith(
      'conversation:conv-1:last_activity',
      timestamp,
      86400,
    );
  });

  it('should auto-flag message if evasion content is detected post-delivery', async () => {
    antiCircumventionMock.scanContent.mockReturnValue({
      isFlagged: true,
      reasons: ['Phone number detected'],
    });

    const mockJob = {
      id: 'job-m2',
      type: 'MESSAGE_SENT',
      payload: {
        messageId: 'msg-2',
        conversationId: 'conv-1',
        senderId: 'sender-1',
        recipientId: 'recipient-1',
        content: 'Call me directly at +1234567890',
        messageType: 'TEXT',
        timestamp: new Date().toISOString(),
      },
      attempts: 0,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };
    redisQueueMock.dequeue.mockResolvedValue(mockJob);

    await processor.processNextJob();

    expect(prismaMock.message.update).toHaveBeenCalledWith({
      where: { id: 'msg-2' },
      data: {
        isFlagged: true,
        flagReason: 'Phone number detected',
      },
    });
    expect(auditLoggerMock.logAction).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'MESSAGE_AUTO_FLAGGED',
        targetId: 'msg-2',
      }),
    );
  });

  it('should divert message job to dead-letter queue if retries exhausted', async () => {
    const mockJob = {
      id: 'job-m3',
      type: 'MESSAGE_SENT',
      payload: {
        messageId: 'msg-3',
        conversationId: 'conv-1',
        senderId: 'sender-1',
        recipientId: 'recipient-1',
      },
      attempts: 2,
      maxAttempts: 3,
      createdAt: new Date().toISOString(),
    };
    redisQueueMock.dequeue.mockResolvedValue(mockJob);
    prismaMock.user.findUnique.mockRejectedValue(new Error('DB failure'));

    await expect(processor.processNextJob()).rejects.toThrow('DB failure');
    expect(redisQueueMock.moveToDeadLetter).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({ id: 'job-m3', attempts: 3 }),
      'DB failure',
    );
  });
});
