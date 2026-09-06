export type MessageJobType =
  | 'MESSAGE_SENT'
  | 'FILE_SHARED'
  | 'PROPOSAL_REPLIED';

export interface MessageJobPayload {
  messageId: string;
  conversationId: string;
  senderId: string;
  recipientId: string;
  content: string;
  messageType: string;
  attachments?: Array<{
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }>;
  timestamp: string;
}
