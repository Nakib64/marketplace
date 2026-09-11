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
  title: string;
  categoryName?: string;
  category?: { id?: string; name: string } | null;
  budget: number;
  status: string;
  createdAt: string;
  proposalsCount?: number;
  leadCandidate?: string;
  _count?: { proposals?: number };
}

export type JobFilterTab = 'ALL' | 'ACTIVE' | 'DRAFTS';
