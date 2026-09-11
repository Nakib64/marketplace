export interface ContractMilestone {
  step: string;
  title: string;
  amount: number;
  currency: string;
  status: 'PAID' | 'ACTIVE' | 'PENDING';
  txHash?: string;
  dueDate?: string;
  progressPct?: number;
  deliverableNotes?: string;
}

export interface ContractDetail {
  id: string;
  contractAddress: string;
  title: string;
  clientName: string;
  clientHandle?: string;
  clientAddress: string;
  clientAvatar?: string;
  amount: number;
  currency: string;
  releasedAmount: number;
  inEscrowAmount: number;
  status: 'FUNDED' | 'PENDING_APPROVAL' | 'COMPLETED' | 'DISPUTED';
  network: string;
  startDate: string;
  multisigThreshold: string;
  gracePeriodHours: number;
  scopeOfWork: string;
  milestones: ContractMilestone[];
}

export interface WorkSubmissionPayload {
  githubUrl: string;
  ipfsCid: string;
  notes: string;
}
