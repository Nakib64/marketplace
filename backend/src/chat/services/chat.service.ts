import { Injectable } from '@nestjs/common';
import { ChatQueryDto } from '../dto/chat-query.dto.js';
import { ReplyProposalDto } from '../dto/reply-proposal.dto.js';
import { SendMessageDto } from '../dto/send-message.dto.js';
import { ChatMessagingService } from './chat-messaging.service.js';
import { ChatProposalService } from './chat-proposal.service.js';
import { ChatQueryService } from './chat-query.service.js';

@Injectable()
export class ChatService {
  constructor(
    private readonly queryService: ChatQueryService,
    private readonly proposalService: ChatProposalService,
    private readonly messagingService: ChatMessagingService,
  ) {}

  async replyToProposal(clientId: string, proposalId: string, dto: ReplyProposalDto) {
    return this.proposalService.replyToProposal(clientId, proposalId, dto);
  }

  async getConversations(userId: string, query: ChatQueryDto) {
    return this.queryService.getConversations(userId, query);
  }

  async getConversation(userId: string, conversationId: string) {
    return this.queryService.getConversation(userId, conversationId);
  }

  async getMessages(userId: string, conversationId: string, query: ChatQueryDto) {
    return this.queryService.getMessages(userId, conversationId, query);
  }

  async sendMessage(userId: string, conversationId: string, dto: SendMessageDto) {
    return this.messagingService.sendMessage(userId, conversationId, dto);
  }

  async sendFileMessage(
    userId: string,
    conversationId: string,
    fileData: { fileName: string; fileUrl: string; fileType: string; fileSize: number },
    caption?: string,
  ) {
    return this.messagingService.sendFileMessage(userId, conversationId, fileData, caption);
  }

  async markConversationAsRead(userId: string, conversationId: string) {
    return this.messagingService.markConversationAsRead(userId, conversationId);
  }
}
