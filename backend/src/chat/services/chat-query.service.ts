import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ChatQueryDto } from '../dto/chat-query.dto.js';

@Injectable()
export class ChatQueryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves all active conversations for a user with unread counts and last message previews.
   */
  async getConversations(userId: string, query: ChatQueryDto) {
    const { page = 1, limit = 30 } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.ConversationWhereInput = {
      OR: [{ clientId: userId }, { freelancerId: userId }],
    };

    const [conversations, total] = await Promise.all([
      this.prisma.conversation.findMany({
        where,
        skip,
        take: limit,
        orderBy: { lastMessageAt: 'desc' },
        include: {
          job: { select: { id: true, title: true, status: true } },
          client: {
            select: {
              id: true,
              email: true,
              clientProfile: { select: { companyName: true, rating: true } },
            },
          },
          freelancer: {
            select: {
              id: true,
              email: true,
              freelancerProfile: { select: { title: true, rating: true, successRate: true } },
            },
          },
          _count: {
            select: {
              messages: {
                where: {
                  senderId: { not: userId },
                  isRead: false,
                },
              },
            },
          },
        },
      }),
      this.prisma.conversation.count({ where }),
    ]);

    const formatted = conversations.map((conv) => {
      const isClient = conv.clientId === userId;
      const counterpart = isClient ? conv.freelancer : conv.client;
      const unreadCount = conv._count.messages;

      return {
        id: conv.id,
        jobId: conv.jobId,
        jobTitle: conv.job.title,
        jobStatus: conv.job.status,
        counterpart: {
          id: counterpart.id,
          email: counterpart.email,
          profile: isClient
            ? (counterpart as any).freelancerProfile
            : (counterpart as any).clientProfile,
        },
        lastMessageText: conv.lastMessageText,
        lastMessageAt: conv.lastMessageAt,
        unreadCount,
        createdAt: conv.createdAt,
      };
    });

    return {
      conversations: formatted,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Retrieves conversation metadata and verifies user participation.
   */
  async getConversation(userId: string, conversationId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        job: { select: { id: true, title: true, status: true, budget: true } },
        client: {
          select: {
            id: true,
            email: true,
            clientProfile: { select: { companyName: true, rating: true } },
          },
        },
        freelancer: {
          select: {
            id: true,
            email: true,
            freelancerProfile: { select: { title: true, rating: true, successRate: true } },
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Conversation not found.');
    }

    if (conversation.clientId !== userId && conversation.freelancerId !== userId) {
      throw new ForbiddenException('You are not a participant in this conversation.');
    }

    return conversation;
  }

  /**
   * Retrieves paginated chat messages for a conversation.
   */
  async getMessages(userId: string, conversationId: string, query: ChatQueryDto) {
    await this.getConversation(userId, conversationId);

    const { page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          sender: { select: { id: true, email: true, role: true } },
          attachments: true,
        },
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);

    return {
      messages: messages.reverse(),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
