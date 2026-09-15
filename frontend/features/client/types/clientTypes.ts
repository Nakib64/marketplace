export interface ClientDeliverable {
  id: string;
  contractAddress: string;
  jobTitle: string;
  freelancerName: string;
  freelancerHandle: string;
  freelancerAvatar: string;
  freelancerBadge: string;
  milestoneTitle: string;
  milestoneStep: string;
  amount: number;
  currency: string;
  submittedTimeAgo: string;
  completionPct: number;
  githubPr?: string;
  ipfsLog?: string;
  testNotes?: string;
}

export interface SettlementLedgerEntry {
  id: string;
  title: string;
  subtitle: string;
  txHash: string;
  amount: number;
  currency: string;
}

export interface ClientDisplayJob {
  id: string;
  slug?: string;
  title: string;
  description?: string;
  categoryName?: string;
  subCategoryName?: string;
  category?: { id?: string; name: string; slug?: string } | null;
  subCategory?: { id?: string; name: string; slug?: string } | null;
  budget: number;
  skills?: string[];
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED' | 'CANCELLED' | string;
  createdAt: string;
  updatedAt?: string;
  proposalsCount?: number;
  leadCandidate?: string;
  isFlagged?: boolean;
  flagReason?: string | null;
  _count?: { proposals?: number };
}

export type JobFilterTab = 'ALL' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
