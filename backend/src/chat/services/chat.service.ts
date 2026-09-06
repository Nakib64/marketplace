import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { MessageType, Prisma } from '@prisma/client';
import { AntiCircumventionService } from '../../admin/moderation/services/anti-circumvention.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ChatQueryDto } from '../dto/chat-query.dto.js';
import { ReplyProposalDto } from '../dto/reply-proposal.dto.js';
import { SendMessageDto } from '../dto/send-message.dto.js';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly antiCircumventionService: AntiCircumventionService,
  ) {}

  /**
   * Client replies to a proposal, creating/opening the conversation and sending the initial message.
   */
  async replyToProposal(clientId: string, proposalId: string, dto: ReplyProposalDto) {
    const proposal = await this.prisma.proposal.findUnique({
      where: { id: proposalId },
      include: {
        job: { select: { id: true, clientId: true, title: true } },
        freelancer: { select: { id: true, email: true } },
      },
    });

    if (!proposal) {
      throw new NotFoundException('Proposal not found.');
    }

    if (proposal.job.clientId !== clientId) {
      throw new ForbiddenException('Only the client who posted the job can reply to this proposal.');
    }

    const scanResult = this.antiCircumventionService.scanContent(dto.message);

    return await this.prisma.$transaction(async (tx) => {
      // 1. Find existing conversation or create a new one
      let conversation = await tx.conversation.findFirst({
        where: {
          jobId: proposal.jobId,
          freelancerId: proposal.freelancerId,
        },
      });

      if (!conversation) {
        conversation = await tx.conversation.create({
          data: {
            jobId: proposal.jobId,
            proposalId,
            clientId,
            freelancerId: proposal.freelancerId,
            lastMessageText: dto.message,
            lastMessageAt: new Date(),
          },
        });
      } else {
        conversation = await tx.conversation.update({
          where: { id: conversation.id },
          data: {
            lastMessageText: dto.message,
            lastMessageAt: new Date(),
            proposalId: conversation.proposalId || proposalId,
          },
        });
      }

      // 2. Create the first message
      const message = await tx.message.create({
        data: {
          conversationId: conversation.id,
          senderId: clientId,
          content: dto.message,
          messageType: MessageType.TEXT,
          isFlagged: scanResult.isFlagged,
          flagReason: scanResult.isFlagged ? scanResult.reasons.join('; ') : null,
        },
        include: {
          sender: { select: { id: true, email: true, role: true } },
          attachments: true,
        },
      });

      // 3. Mark proposal as viewed if not already
      if (!proposal.isViewed) {
        await tx.proposal.update({
          where: { id: proposalId },
          data: { isViewed: true },
        });
      }

      return {
        conversation,
        message,
      };
    });
  }

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

    // Format response with counterpart and unreadCount
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
      messages: messages.reverse(), // Chronological order for chat UI
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Sends a text message inside a conversation.
   */
  async sendMessage(userId: string, conversationId: string, dto: SendMessageDto) {
    const conversation = await this.getConversation(userId, conversationId);

    const scanResult = this.antiCircumventionService.scanContent(dto.content);

    return await this.prisma.$transaction(async (tx) => {
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
    const conversation = await this.getConversation(userId, conversationId);

    const scanResult = caption ? this.antiCircumventionService.scanContent(caption) : { isFlagged: false, reasons: [] };

    return await this.prisma.$transaction(async (tx) => {
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
  }

  /**
   * Marks unread incoming messages in a conversation as read.
   */
  async markConversationAsRead(userId: string, conversationId: string) {
    await this.getConversation(userId, conversationId);

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
