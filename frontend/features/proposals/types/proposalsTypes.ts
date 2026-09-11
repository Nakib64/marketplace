export interface ProposalMilestone {
  step: string;
  title: string;
  durationDays: number;
  amount: number;
  currency: string;
}

export interface ProposalCredential {
  title: string;
  subtitle: string;
  icon: string;
  score?: string;
  badge?: string;
}

export interface ProposalItem {
  id: string;
  jobId: string;
  freelancerId: string;
  freelancerName: string;
  freelancerHandle: string;
  freelancerAvatar: string;
  freelancerRole: string;
  sbtId: string;
  bio: string;
  fitScore: number;
  bidAmount: number;
  currency: string;
  budgetComparison: string;
  durationWeeks: number;
  deliveryDate: string;
  milestoneCount: number;
  arbitration: string;
  courtId: string;
  coverLetter: string;
  isShortlisted?: boolean;
  credentials: ProposalCredential[];
  milestones: ProposalMilestone[];
  createdAt: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'SHORTLISTED';
}

export interface SubmitProposalPayload {
  coverLetter: string;
  bidAmount: number;
  duration: number;
}
