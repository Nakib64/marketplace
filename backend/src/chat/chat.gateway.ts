import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './services/chat.service.js';

@Injectable()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly chatService: ChatService,
  ) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader =
        client.handshake.auth?.token || client.handshake.headers?.authorization;

      if (!authHeader) {
        this.logger.warn(`WS connection rejected: No auth token provided (${client.id})`);
        client.disconnect();
        return;
      }

      const token = authHeader.replace(/^Bearer\s+/i, '');
      const payload = await this.jwtService.verifyAsync(token);

      const userId = payload.sub || payload.id;
      if (!userId) {
        client.disconnect();
        return;
      }

      client.data.user = payload;
      client.data.userId = userId;

      // Join user's individual room for direct notifications
      client.join(`user_${userId}`);
      this.logger.log(`WS Client connected: User ${userId} (${client.id})`);
    } catch (err) {
      this.logger.error(`WS Authentication failed: ${(err as Error).message}`);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.data?.userId;
    if (userId) {
      this.logger.log(`WS Client disconnected: User ${userId} (${client.id})`);
    }
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.join(`conversation_${data.conversationId}`);
      return { status: 'joined', conversationId: data.conversationId };
    }
  }

  @SubscribeMessage('leave_conversation')
  handleLeaveConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.leave(`conversation_${data.conversationId}`);
      return { status: 'left', conversationId: data.conversationId };
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; content: string },
  ) {
    const userId = client.data.userId;
    if (!userId || !data.conversationId || !data.content) {
      return { error: 'Invalid message payload' };
    }

    try {
      const result = await this.chatService.sendMessage(userId, data.conversationId, {
        content: data.content,
      });

      // Broadcast new message to conversation room
      this.server
        .to(`conversation_${data.conversationId}`)
        .emit('new_message', result.message);

      // Notify recipient's user room of conversation update
      this.server
        .to(`user_${result.recipientId}`)
        .emit('conversation_updated', {
          conversationId: data.conversationId,
          lastMessage: result.message,
        });

      return { status: 'sent', message: result.message };
    } catch (err: any) {
      return { error: err.message };
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string; isTyping: boolean },
  ) {
    const userId = client.data.userId;
    if (data.conversationId && userId) {
      client
        .to(`conversation_${data.conversationId}`)
        .emit('user_typing', {
          conversationId: data.conversationId,
          userId,
          isTyping: data.isTyping,
        });
    }
  }

  @SubscribeMessage('mark_as_read')
  async handleMarkAsRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    const userId = client.data.userId;
    if (userId && data.conversationId) {
      await this.chatService.markConversationAsRead(userId, data.conversationId);
      client
        .to(`conversation_${data.conversationId}`)
        .emit('messages_read', {
          conversationId: data.conversationId,
          readBy: userId,
          readAt: new Date(),
        });
    }
  }

  /**
   * Helper method for REST controllers to broadcast messages created via HTTP
   */
  broadcastNewMessage(conversationId: string, recipientId: string, message: any) {
    if (this.server) {
      this.server.to(`conversation_${conversationId}`).emit('new_message', message);
      this.server.to(`user_${recipientId}`).emit('conversation_updated', {
        conversationId,
        lastMessage: message,
      });
    }
  }
}
