import { Injectable } from '@nestjs/common';
import { MessageType } from '@prisma/client';
import { AntiCircumventionService } from '../../admin/moderation/services/anti-circumvention.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisQueueService } from '../../queues/services/redis-queue.service.js';
import { MessageJobPayload } from '../../queues/types/message-job.types.js';
import { SendMessageDto } from '../dto/send-message.dto.js';
import { ChatQueryService } from './chat-query.service.js';

@Injectable()
export class ChatMessagingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly antiCircumventionService: AntiCircumventionService,
    private readonly redisQueue: RedisQueueService,
    private readonly chatQueryService: ChatQueryService,
  ) {}

  /**
   * Sends a text message inside a conversation thread.
   */
  async sendMessage(userId: string, conversationId: string, dto: SendMessageDto) {
    const conversation = await this.chatQueryService.getConversation(userId, conversationId);
    const scanResult = this.antiCircumventionService.scanContent(dto.content);

    const result = await this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          content: dto.content,
          messageType: dto.messageType || MessageType.TEXT,
          isFlagged: scanResult.isFlagged,
          flagReason: scanResult.isFlagged ? scanResult.reasons.join('; ') : null,
        },
        include: {
          sender: { select: { id: true, email: true, role: true } },
          attachments: true,
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageText: dto.content,
          lastMessageAt: message.createdAt,
        },
      });

      return {
        message,
        recipientId: conversation.clientId === userId ? conversation.freelancerId : conversation.clientId,
      };
    });

    await this.redisQueue.enqueue<MessageJobPayload>(
      RedisQueueService.MESSAGES_QUEUE,
      'MESSAGE_SENT',
      {
        messageId: result.message.id,
        conversationId,
        senderId: userId,
        recipientId: result.recipientId,
        content: dto.content,
        messageType: result.message.messageType,
        timestamp: result.message?.createdAt
          ? new Date(result.message.createdAt).toISOString()
          : new Date().toISOString(),
      },
    );

    return result;
  }

  /**
   * Sends a message with a file attachment.
   */
  async sendFileMessage(
    userId: string,
    conversationId: string,
    fileData: { fileName: string; fileUrl: string; fileType: string; fileSize: number },
    caption?: string,
  ) {
    const conversation = await this.chatQueryService.getConversation(userId, conversationId);
    const scanResult = caption
      ? this.antiCircumventionService.scanContent(caption)
      : { isFlagged: false, reasons: [] };

    const result = await this.prisma.$transaction(async (tx) => {
      const message = await tx.message.create({
        data: {
          conversationId,
          senderId: userId,
          content: caption || `Shared file: ${fileData.fileName}`,
          messageType: MessageType.FILE,
          isFlagged: scanResult.isFlagged,
          flagReason: scanResult.isFlagged ? scanResult.reasons.join('; ') : null,
          attachments: {
            create: {
              fileName: fileData.fileName,
              fileUrl: fileData.fileUrl,
              fileType: fileData.fileType,
              fileSize: fileData.fileSize,
            },
          },
        },
        include: {
          sender: { select: { id: true, email: true, role: true } },
          attachments: true,
        },
      });

      await tx.conversation.update({
        where: { id: conversationId },
        data: {
          lastMessageText: `Attachment: ${fileData.fileName}`,
          lastMessageAt: message.createdAt,
        },
      });

      return {
        message,
        recipientId: conversation.clientId === userId ? conversation.freelancerId : conversation.clientId,
      };
    });

    await this.redisQueue.enqueue<MessageJobPayload>(
      RedisQueueService.MESSAGES_QUEUE,
      'FILE_SHARED',
      {
        messageId: result.message.id,
        conversationId,
        senderId: userId,
        recipientId: result.recipientId,
        content: result.message.content || `Shared file: ${fileData.fileName}`,
        messageType: MessageType.FILE,
        attachments: [fileData],
        timestamp: result.message?.createdAt
          ? new Date(result.message.createdAt).toISOString()
          : new Date().toISOString(),
      },
    );

    return result;
  }

  /**
   * Marks unread incoming messages in a conversation as read.
   */
  async markConversationAsRead(userId: string, conversationId: string) {
    await this.chatQueryService.getConversation(userId, conversationId);

    const result = await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });

    return {
      conversationId,
      markedCount: result.count,
    };
  }
}
