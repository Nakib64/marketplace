import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import * as fs from 'fs';
import { CurrentUser } from '../../auth/decorators/current-user.decorator.js';
import { Public } from '../../auth/decorators/public.decorator.js';
import { ChatGateway } from '../chat.gateway.js';
import { ChatQueryDto } from '../dto/chat-query.dto.js';
import { ReplyProposalDto } from '../dto/reply-proposal.dto.js';
import { SendMessageDto } from '../dto/send-message.dto.js';
import { ChatFileService, type UploadedChatFile } from '../services/chat-file.service.js';
import { ChatService } from '../services/chat.service.js';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly chatFileService: ChatFileService,
    private readonly chatGateway: ChatGateway,
  ) {}

  /**
   * Client replies to a proposal, creating a conversation thread and sending the first message.
   */
  @Post('proposals/:proposalId/reply')
  @HttpCode(HttpStatus.CREATED)
  async replyToProposal(
    @CurrentUser('id') clientId: string,
    @Param('proposalId') proposalId: string,
    @Body() dto: ReplyProposalDto,
  ) {
    const result = await this.chatService.replyToProposal(clientId, proposalId, dto);

    // Broadcast new message
    this.chatGateway.broadcastNewMessage(
      result.conversation.id,
      result.conversation.freelancerId,
      result.message,
    );

    return result;
  }

  /**
   * List all conversations for current user.
   */
  @Get('conversations')
  async getConversations(
    @CurrentUser('id') userId: string,
    @Query() query: ChatQueryDto,
  ) {
    return this.chatService.getConversations(userId, query);
  }

  /**
   * Get metadata for a specific conversation.
   */
  @Get('conversations/:id')
  async getConversation(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.getConversation(userId, conversationId);
  }

  /**
   * Get message history for a conversation.
   */
  @Get('conversations/:id/messages')
  async getMessages(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Query() query: ChatQueryDto,
  ) {
    return this.chatService.getMessages(userId, conversationId, query);
  }

  /**
   * Send a text message inside a conversation.
   */
  @Post('conversations/:id/messages')
  async sendMessage(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @Body() dto: SendMessageDto,
  ) {
    const result = await this.chatService.sendMessage(userId, conversationId, dto);

    // Broadcast through WebSocket gateway
    this.chatGateway.broadcastNewMessage(
      conversationId,
      result.recipientId,
      result.message,
    );

    return result.message;
  }

  /**
   * Upload and send a file attachment inside a conversation.
   */
  @Post('conversations/:id/attachments')
  @UseInterceptors(FileInterceptor('file'))
  async uploadAttachment(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
    @UploadedFile() file: UploadedChatFile,
    @Body('caption') caption?: string,
  ) {
    const fileMetadata = await this.chatFileService.saveFile(file);

    const result = await this.chatService.sendFileMessage(
      userId,
      conversationId,
      fileMetadata,
      caption,
    );

    // Broadcast through WebSocket gateway
    this.chatGateway.broadcastNewMessage(
      conversationId,
      result.recipientId,
      result.message,
    );

    return result.message;
  }

  /**
   * Mark all unread incoming messages in a conversation as read.
   */
  @Patch('conversations/:id/read')
  async markAsRead(
    @CurrentUser('id') userId: string,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.markConversationAsRead(userId, conversationId);
  }

  /**
   * Download / view stored attachment.
   */
  @Public()
  @Get('attachments/:filename')
  async getAttachment(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = this.chatFileService.getFilePath(filename);
    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Attachment file not found.');
    }
    return res.sendFile(filePath);
  }
}
