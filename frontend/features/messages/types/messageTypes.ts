export interface WorkroomChannel {
  id: string;
  title: string;
  contactName: string;
  contactRole?: string;
  avatarText: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export interface WorkroomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  isMe: boolean;
  text: string;
  isMilestoneDeliverable?: boolean;
  deliverableTitle?: string;
  deliverableNote?: string;
}

export interface WorkroomEscrowContext {
  milestoneTitle: string;
  lockedAmount: number;
  currency: string;
  releasedAmount: number;
  remainingAmount: number;
  slaGraceRemaining: string;
  artifacts: { title: string; type: string; ref: string; url?: string }[];
}

export interface BackendConversationItem {
  id: string;
  jobId: string;
  jobTitle: string;
  jobStatus: string;
  counterpart: {
    id: string;
    email: string;
    profile?: {
      companyName?: string;
      fullName?: string;
      title?: string;
      rating?: number;
    };
  };
  lastMessageText?: string | null;
  lastMessageAt?: string | null;
  unreadCount: number;
  createdAt: string;
}

export interface BackendConversationsResponse {
  conversations: BackendConversationItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface BackendMessageItem {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    email: string;
    role: string;
  };
  attachments?: {
    id: string;
    fileName: string;
    fileUrl: string;
    fileType: string;
    fileSize: number;
  }[];
}

export interface BackendMessagesResponse {
  messages: BackendMessageItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function mapBackendConversation(c: BackendConversationItem): WorkroomChannel {
  const contactName =
    c.counterpart?.profile?.companyName ||
    c.counterpart?.profile?.fullName ||
    c.counterpart?.email?.split('@')[0] ||
    'Contact';
  const avatarText = contactName.slice(0, 2).toUpperCase();
  const contactRole = c.counterpart?.profile?.title || 'Member';
  const time = c.lastMessageAt
    ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  return {
    id: c.id,
    title: c.jobTitle || 'Project Conversation',
    contactName,
    contactRole,
    avatarText,
    lastMessage: c.lastMessageText || 'Conversation started',
    timestamp: time,
    unreadCount: c.unreadCount || 0,
    isOnline: true,
  };
}

export function mapBackendMessage(m: BackendMessageItem, currentUserId?: string): WorkroomMessage {
  const isMe = currentUserId ? m.senderId === currentUserId : m.sender?.role === 'CLIENT';
  const time = m.createdAt
    ? new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Just now';
  const senderName = isMe ? 'You' : (m.sender?.email?.split('@')[0] || 'Partner');
  const senderAvatar = isMe ? 'ME' : senderName.slice(0, 2).toUpperCase();

  return {
    id: m.id,
    senderId: m.senderId,
    senderName,
    senderAvatar,
    timestamp: time,
    isMe,
    text: m.content || '',
    isMilestoneDeliverable: false,
  };
}

