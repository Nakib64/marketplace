import { Module } from '@nestjs/common';
import { AdminModerationModule } from '../admin/moderation/admin-moderation.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ChatGateway } from './chat.gateway.js';
import { ChatController } from './controllers/chat.controller.js';
import { ChatFileService } from './services/chat-file.service.js';
import { ChatService } from './services/chat.service.js';

@Module({
  imports: [PrismaModule, AuthModule, AdminModerationModule],
  controllers: [ChatController],
  providers: [ChatService, ChatFileService, ChatGateway],
  exports: [ChatService, ChatGateway],
})
export class ChatModule {}
