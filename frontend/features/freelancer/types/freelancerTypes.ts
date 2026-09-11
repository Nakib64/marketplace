export interface FreelancerContractItem {
  id: string;
  title: string;
  clientName: string;
  amount: number;
  currency: string;
  contractAddress: string;
  milestoneStep: string;
  milestoneTitle: string;
  dueDate: string;
  progressPct: number;
  status: 'IN_PROGRESS' | 'PENDING_REVIEW' | 'COMPLETED';
}

export interface FreelancerLedgerEvent {
  id: string;
  title: string;
  amount?: string;
  subtitle: string;
  type: 'APPROVED' | 'FUNDED' | 'SBT';
}

export interface FreelancerTokenBalance {
  symbol: string;
  amount: string;
  usdValue: string;
  icon: string;
}

export type ContractFilterTab = 'ALL' | 'PENDING' | 'IN_PROGRESS';
