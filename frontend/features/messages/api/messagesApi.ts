import { apiClient } from '@/lib/api/apiClient';
import { WorkroomChannel, WorkroomMessage } from '../types/messageTypes';
import { INITIAL_CHANNELS, INITIAL_MESSAGES } from '../data/mockMessagesData';

export const messagesApi = {
  /**
   * Fetch active workrooms / conversations
   */
  async getConversations(): Promise<WorkroomChannel[]> {
    try {
      const { data } = await apiClient.get<WorkroomChannel[]>('/chat/conversations');
      return data.length > 0 ? data : INITIAL_CHANNELS;
    } catch {
      return INITIAL_CHANNELS;
    }
  },

  /**
   * Fetch message history for a conversation
   */
  async getMessages(conversationId: string): Promise<WorkroomMessage[]> {
    try {
      const { data } = await apiClient.get<WorkroomMessage[]>(`/chat/conversations/${conversationId}/messages`);
      return data.length > 0 ? data : INITIAL_MESSAGES;
    } catch {
      return INITIAL_MESSAGES;
    }
  },

  /**
   * Send a message to the active workroom
   */
  async sendMessage(conversationId: string, text: string): Promise<WorkroomMessage> {
    try {
      const { data } = await apiClient.post<WorkroomMessage>(`/chat/conversations/${conversationId}/messages`, {
        content: text,
      });
      return data;
    } catch {
      return {
        id: `msg-${Date.now()}`,
        senderId: 'hirer',
        senderName: 'Kroma Labs DAO (Hirer)',
        senderAvatar: 'KL',
        timestamp: 'Just now',
        isHirer: true,
        text,
        signerAddress: '0x3C49...81B7',
        multisigStatus: 'EIP-1271 Signed',
      };
    }
  },
};
