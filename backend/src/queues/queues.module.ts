import { Module } from '@nestjs/common';
import { AdminAuditModule } from '../admin/audit/admin-audit.module.js';
import { AdminModerationModule } from '../admin/moderation/admin-moderation.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { RedisModule } from '../redis/redis.module.js';
import { MessageModerationSubService } from './processors/message-moderation-sub.service.js';
import { MessageNotificationSubService } from './processors/message-notification-sub.service.js';
import { MessageQueueProcessor } from './processors/message-queue.processor.js';
import { ProposalModerationSubService } from './processors/proposal-moderation-sub.service.js';
import { ProposalNotificationSubService } from './processors/proposal-notification-sub.service.js';
import { ProposalQueueProcessor } from './processors/proposal-queue.processor.js';
import { QueueWorkerRunnerService } from './services/queue-worker-runner.service.js';
import { RedisQueueService } from './services/redis-queue.service.js';

@Module({
  imports: [
    RedisModule,
    PrismaModule,
    AdminModerationModule,
    AdminAuditModule,
  ],
  providers: [
    QueueWorkerRunnerService,
    ProposalModerationSubService,
    ProposalNotificationSubService,
    MessageModerationSubService,
    MessageNotificationSubService,
    RedisQueueService,
    ProposalQueueProcessor,
    MessageQueueProcessor,
  ],
  exports: [
    QueueWorkerRunnerService,
    ProposalModerationSubService,
    ProposalNotificationSubService,
    MessageModerationSubService,
    MessageNotificationSubService,
    RedisQueueService,
    ProposalQueueProcessor,
    MessageQueueProcessor,
  ],
})
export class QueuesModule {}
