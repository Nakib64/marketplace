export interface WorkroomChannel {
  id: string;
  title: string;
  rfpNumber: string;
  contractAddress: string;
  contactName: string;
  contactEns: string;
  contactRole: string;
  avatarText: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  totalVault: number;
  currency: string;
  activeMilestone: string;
  isOnline?: boolean;
  xmtpVerified?: boolean;
}

export interface WorkroomMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  timestamp: string;
  isHirer: boolean;
  text: string;
  eip712Signed?: boolean;
  signerAddress?: string;
  multisigStatus?: string;
  isMilestoneDeliverable?: boolean;
  deliverableTitle?: string;
  coveragePct?: string;
  commitRef?: string;
  ipfsCid?: string;
  codeSnippet?: string;
  txHash?: string;
}

export interface WorkroomEscrowContext {
  milestoneTitle: string;
  lockedAmount: number;
  currency: string;
  releasedAmount: number;
  remainingAmount: number;
  slaGraceRemaining: string;
  multisigSigned: number;
  multisigTotal: number;
  signers: { address: string; role: string; signed: boolean }[];
  artifacts: { title: string; type: 'ipfs' | 'pr' | 'report'; ref: string; url?: string }[];
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
    'Counterpart';
  const avatarText = contactName.slice(0, 2).toUpperCase();
  const contactRole = c.counterpart?.profile?.title || 'Contract Participant';
  const contactEns = `${c.counterpart?.email?.split('@')[0] || 'user'}.eth`;
  const time = c.lastMessageAt
    ? new Date(c.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : 'Recently';

  return {
    id: c.id,
    title: c.jobTitle || 'Freelance Workroom',
    rfpNumber: `RFP-${c.id.slice(0, 4).toUpperCase()}`,
    contractAddress: `0x${c.id.replace(/-/g, '').slice(0, 4)}...${c.id.replace(/-/g, '').slice(-4)}`,
    contactName,
    contactEns,
    contactRole,
    avatarText,
    lastMessage: c.lastMessageText || 'Conversation thread opened',
    timestamp: time,
    unreadCount: c.unreadCount || 0,
    totalVault: 5000,
    currency: 'BDT',
    activeMilestone: 'Active Phase',
    isOnline: true,
    xmtpVerified: true,
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
    isHirer: isMe,
    text: m.content || '',
    signerAddress: `0x${(m.senderId || '').replace(/-/g, '').slice(0, 4)}...${(m.senderId || '').replace(/-/g, '').slice(-4)}`,
    multisigStatus: 'Verified (Socket.io)',
    isMilestoneDeliverable: false,
  };
}

