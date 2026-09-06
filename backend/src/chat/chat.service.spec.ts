import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { MessageType } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ChatMessagingService } from './services/chat-messaging.service.js';
import { ChatProposalService } from './services/chat-proposal.service.js';
import { ChatQueryService } from './services/chat-query.service.js';
import { ChatService } from './services/chat.service.js';

describe('Phase 14: Chat & Messaging Service', () => {
  let chatService: ChatService;
  let prismaMock: any;
  let antiCircumventionMock: any;
  let redisQueueMock: any;

  beforeEach(() => {
    prismaMock = {
      proposal: {
        findUnique: vi.fn(),
        update: vi.fn(),
      },
      conversation: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      message: {
        create: vi.fn(),
        findMany: vi.fn(),
        count: vi.fn(),
        updateMany: vi.fn(),
      },
      $transaction: vi.fn((cb) => cb(prismaMock)),
    };

    antiCircumventionMock = {
      scanContent: vi.fn().mockReturnValue({ isFlagged: false, reasons: [] }),
    };

    redisQueueMock = {
      enqueue: vi.fn().mockResolvedValue({ id: 'msg-q-1' }),
    };

    const queryService = new ChatQueryService(prismaMock);
    const proposalService = new ChatProposalService(prismaMock, antiCircumventionMock as any, redisQueueMock as any);
    const messagingService = new ChatMessagingService(prismaMock, antiCircumventionMock as any, redisQueueMock as any, queryService);
    chatService = new ChatService(queryService, proposalService, messagingService);
  });

  describe('replyToProposal', () => {
    it('should throw NotFoundException if proposal does not exist', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue(null);

      await expect(
        chatService.replyToProposal('client-1', 'invalid-proposal', {
          message: 'Hello!',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the job owner', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        jobId: 'job-1',
        freelancerId: 'free-1',
        job: { clientId: 'other-client', id: 'job-1', title: 'Job 1' },
      });

      await expect(
        chatService.replyToProposal('client-1', 'prop-1', {
          message: 'Hello!',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should create a new conversation and send initial message on valid reply', async () => {
      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        jobId: 'job-1',
        freelancerId: 'free-1',
        isViewed: false,
        job: { clientId: 'client-1', id: 'job-1', title: 'Job 1' },
      });

      prismaMock.conversation.findFirst.mockResolvedValue(null);

      prismaMock.conversation.create.mockResolvedValue({
        id: 'conv-1',
        jobId: 'job-1',
        proposalId: 'prop-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
        lastMessageText: 'Great proposal, let us talk.',
      });

      prismaMock.message.create.mockResolvedValue({
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'client-1',
        content: 'Great proposal, let us talk.',
        messageType: MessageType.TEXT,
        isFlagged: false,
      });

      const res = await chatService.replyToProposal('client-1', 'prop-1', {
        message: 'Great proposal, let us talk.',
      });

      expect(prismaMock.conversation.create).toHaveBeenCalled();
      expect(prismaMock.message.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          conversationId: 'conv-1',
          senderId: 'client-1',
          content: 'Great proposal, let us talk.',
        }),
        include: expect.any(Object),
      });
      expect(prismaMock.proposal.update).toHaveBeenCalledWith({
        where: { id: 'prop-1' },
        data: { isViewed: true },
      });
      expect(res.conversation.id).toBe('conv-1');
      expect(res.message.id).toBe('msg-1');
    });

    it('should flag message if anti-circumvention triggers', async () => {
      antiCircumventionMock.scanContent.mockReturnValue({
        isFlagged: true,
        reasons: ['Contains prohibited keyword: "whatsapp"'],
      });

      prismaMock.proposal.findUnique.mockResolvedValue({
        id: 'prop-1',
        jobId: 'job-1',
        freelancerId: 'free-1',
        isViewed: true,
        job: { clientId: 'client-1', id: 'job-1', title: 'Job 1' },
      });

      prismaMock.conversation.findFirst.mockResolvedValue({
        id: 'conv-1',
        jobId: 'job-1',
        proposalId: 'prop-1',
      });

      prismaMock.conversation.update.mockResolvedValue({ id: 'conv-1' });
      prismaMock.message.create.mockResolvedValue({
        id: 'msg-1',
        isFlagged: true,
        flagReason: 'Contains prohibited keyword: "whatsapp"',
      });

      await chatService.replyToProposal('client-1', 'prop-1', {
        message: 'Call me on whatsapp',
      });

      expect(prismaMock.message.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          isFlagged: true,
          flagReason: 'Contains prohibited keyword: "whatsapp"',
        }),
        include: expect.any(Object),
      });
    });
  });

  describe('getConversations', () => {
    it('should return formatted conversations with counterpart and unread count', async () => {
      prismaMock.conversation.findMany.mockResolvedValue([
        {
          id: 'conv-1',
          jobId: 'job-1',
          clientId: 'user-1',
          freelancerId: 'user-2',
          lastMessageText: 'Hello!',
          lastMessageAt: new Date(),
          job: { id: 'job-1', title: 'React App', status: 'OPEN' },
          client: { id: 'user-1', email: 'client@test.com', clientProfile: { companyName: 'Acme' } },
          freelancer: {
            id: 'user-2',
            email: 'dev@test.com',
            freelancerProfile: { title: 'Senior Dev', rating: 5.0, successRate: 100 },
          },
          _count: { messages: 2 },
          createdAt: new Date(),
        },
      ]);
      prismaMock.conversation.count.mockResolvedValue(1);

      const res = await chatService.getConversations('user-1', { page: 1, limit: 10 });

      expect(res.conversations).toHaveLength(1);
      expect(res.conversations[0].counterpart.id).toBe('user-2');
      expect(res.conversations[0].unreadCount).toBe(2);
      expect(res.pagination.total).toBe(1);
    });
  });

  describe('sendMessage', () => {
    it('should throw ForbiddenException if user is not in conversation', async () => {
      prismaMock.conversation.findUnique.mockResolvedValue({
        id: 'conv-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
      });

      await expect(
        chatService.sendMessage('intruder-user', 'conv-1', {
          content: 'Hello',
        }),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should send message, update conversation, and return recipientId', async () => {
      prismaMock.conversation.findUnique.mockResolvedValue({
        id: 'conv-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
      });

      const now = new Date();
      prismaMock.message.create.mockResolvedValue({
        id: 'msg-1',
        conversationId: 'conv-1',
        senderId: 'client-1',
        content: 'Next meeting tomorrow?',
        createdAt: now,
      });

      prismaMock.conversation.update.mockResolvedValue({ id: 'conv-1' });

      const res = await chatService.sendMessage('client-1', 'conv-1', {
        content: 'Next meeting tomorrow?',
      });

      expect(res.recipientId).toBe('free-1');
      expect(prismaMock.conversation.update).toHaveBeenCalledWith({
        where: { id: 'conv-1' },
        data: {
          lastMessageText: 'Next meeting tomorrow?',
          lastMessageAt: now,
        },
      });
    });
  });

  describe('sendFileMessage', () => {
    it('should create file message with attachment and update conversation', async () => {
      prismaMock.conversation.findUnique.mockResolvedValue({
        id: 'conv-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
      });

      const now = new Date();
      prismaMock.message.create.mockResolvedValue({
        id: 'msg-file-1',
        messageType: MessageType.FILE,
        createdAt: now,
      });

      prismaMock.conversation.update.mockResolvedValue({ id: 'conv-1' });

      const fileData = {
        fileName: 'contract_spec.pdf',
        fileUrl: '/chat/attachments/123-contract_spec.pdf',
        fileType: 'application/pdf',
        fileSize: 1048576,
      };

      const res = await chatService.sendFileMessage(
        'free-1',
        'conv-1',
        fileData,
        'Here is the project spec document',
      );

      expect(res.recipientId).toBe('client-1');
      expect(prismaMock.message.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          messageType: MessageType.FILE,
          content: 'Here is the project spec document',
          attachments: {
            create: fileData,
          },
        }),
        include: expect.any(Object),
      });
      expect(prismaMock.conversation.update).toHaveBeenCalledWith({
        where: { id: 'conv-1' },
        data: {
          lastMessageText: 'Attachment: contract_spec.pdf',
          lastMessageAt: now,
        },
      });
    });
  });

  describe('markConversationAsRead', () => {
    it('should mark all unread counterpart messages as read', async () => {
      prismaMock.conversation.findUnique.mockResolvedValue({
        id: 'conv-1',
        clientId: 'client-1',
        freelancerId: 'free-1',
      });

      prismaMock.message.updateMany.mockResolvedValue({ count: 4 });

      const res = await chatService.markConversationAsRead('free-1', 'conv-1');

      expect(res.markedCount).toBe(4);
      expect(prismaMock.message.updateMany).toHaveBeenCalledWith({
        where: {
          conversationId: 'conv-1',
          senderId: { not: 'free-1' },
          isRead: false,
        },
        data: {
          isRead: true,
          readAt: expect.any(Date),
        },
      });
    });
  });
});
