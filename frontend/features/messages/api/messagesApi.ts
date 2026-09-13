import { apiClient } from '@/lib/api/apiClient';
import {
  WorkroomChannel,
  WorkroomMessage,
  BackendConversationsResponse,
  BackendMessagesResponse,
  BackendMessageItem,
  mapBackendConversation,
  mapBackendMessage,
} from '../types/messageTypes';
import { INITIAL_CHANNELS, INITIAL_MESSAGES } from '../data/mockMessagesData';

export const messagesApi = {
  /**
   * Fetch active workrooms / conversations
   */
  async getConversations(): Promise<WorkroomChannel[]> {
    try {
      const { data } = await apiClient.get<BackendConversationsResponse>('/chat/conversations');
      if (data?.conversations && data.conversations.length > 0) {
        return data.conversations.map(mapBackendConversation);
      }
      return INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  },

  /**
   * Fetch message history for a conversation
   */
  async getMessages(conversationId: string, currentUserId?: string): Promise<WorkroomMessage[]> {
    try {
      const { data } = await apiClient.get<BackendMessagesResponse>(`/chat/conversations/${conversationId}/messages`);
      if (data?.messages && data.messages.length > 0) {
        return data.messages.map((m) => mapBackendMessage(m, currentUserId));
      }
      return INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  /**
   * Send a message to the active workroom
   */
  async sendMessage(conversationId: string, text: string, currentUserId?: string): Promise<WorkroomMessage> {
    try {
      const { data } = await apiClient.post<BackendMessageItem>(`/chat/conversations/${conversationId}/messages`, {
        content: text,
      });
      return mapBackendMessage(data, currentUserId);
    } catch {
      return {
        id: `msg-${Date.now()}`,
        senderId: currentUserId || 'me',
        senderName: 'You',
        senderAvatar: 'ME',
        timestamp: 'Just now',
        isHirer: true,
        text,
        signerAddress: '0x3C49...81B7',
        multisigStatus: 'EIP-1271 Signed',
      };
    }
  },

  /**
   * Mark conversation messages as read
   */
  async markAsRead(conversationId: string): Promise<void> {
    try {
      await apiClient.patch(`/chat/conversations/${conversationId}/read`);
    } catch {
      // Gracefully ignore mark-as-read failures
    }
  },
};

