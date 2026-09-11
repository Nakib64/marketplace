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
