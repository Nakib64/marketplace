import { Module } from '@nestjs/common';
import { AdminModerationModule } from '../admin/moderation/admin-moderation.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { QueuesModule } from '../queues/queues.module.js';
import { ChatGateway } from './chat.gateway.js';
import { ChatController } from './controllers/chat.controller.js';
import { ChatFileService } from './services/chat-file.service.js';
import { ChatMessagingService } from './services/chat-messaging.service.js';
import { ChatProposalService } from './services/chat-proposal.service.js';
import { ChatQueryService } from './services/chat-query.service.js';
import { ChatService } from './services/chat.service.js';

@Module({
  imports: [PrismaModule, AuthModule, AdminModerationModule, QueuesModule],
  controllers: [ChatController],
  providers: [
    ChatQueryService,
    ChatProposalService,
    ChatMessagingService,
    ChatFileService,
    ChatService,
    ChatGateway,
  ],
  exports: [
    ChatQueryService,
    ChatProposalService,
    ChatMessagingService,
    ChatFileService,
    ChatService,
    ChatGateway,
  ],
})
export class ChatModule {}
