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

export const messagesApi = {
  /**
   * Fetch active workrooms / conversations
   */
  async getConversations(): Promise<WorkroomChannel[]> {
    try {
      const { data } = await apiClient.get<BackendConversationsResponse>('/chat/conversations');
      if (data?.conversations && Array.isArray(data.conversations)) {
        return data.conversations.map(mapBackendConversation);
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Fetch message history for a conversation
   */
  async getMessages(conversationId: string, currentUserId?: string): Promise<WorkroomMessage[]> {
    if (!conversationId) return [];
    try {
      const { data } = await apiClient.get<BackendMessagesResponse>(`/chat/conversations/${conversationId}/messages`);
      if (data?.messages && Array.isArray(data.messages)) {
        return data.messages.map((m) => mapBackendMessage(m, currentUserId));
      }
      return [];
    } catch {
      return [];
    }
  },

  /**
   * Send a message to the active workroom
   */
  async sendMessage(conversationId: string, text: string, currentUserId?: string): Promise<WorkroomMessage> {
    const { data } = await apiClient.post<BackendMessageItem>(`/chat/conversations/${conversationId}/messages`, {
      content: text,
    });
    return mapBackendMessage(data, currentUserId);
  },

  /**
   * Mark conversation messages as read
   */
  async markAsRead(conversationId: string): Promise<void> {
    if (!conversationId) return;
    try {
      await apiClient.patch(`/chat/conversations/${conversationId}/read`);
    } catch {
      // Gracefully ignore mark-as-read failures
    }
  },
};
