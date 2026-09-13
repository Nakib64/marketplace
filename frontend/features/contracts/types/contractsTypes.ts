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
  clientId?: string;
  freelancerId?: string;
  freelancerName?: string;
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

export interface SubmitReviewPayload {
  contractId: string;
  rating: number;
  feedback: string;
}

export interface ReviewResponse {
  id: string;
  contractId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  feedback: string;
  counterFeedback?: string;
  status: 'HIDDEN' | 'PUBLISHED';
  createdAt: string;
}

export interface RawBackendContract {
  id?: string;
  contractAddress?: string;
  title?: string;
  escrowAmount?: number | string;
  amount?: number | string;
  currency?: string;
  releasedAmount?: number;
  status?: 'FUNDED' | 'PENDING_APPROVAL' | 'COMPLETED' | 'DISPUTED';
  network?: string;
  createdAt?: string;
  startDate?: string;
  multisigThreshold?: string;
  gracePeriodHours?: number;
  scopeOfWork?: string;
  job?: { id?: string; title?: string; description?: string };
  proposal?: { id?: string; coverLetter?: string; bidAmount?: number | string };
  client?: { id?: string; email?: string; clientProfile?: { companyName?: string; fullName?: string; avatarUrl?: string } };
  freelancer?: { id?: string; email?: string; freelancerProfile?: { fullName?: string } };
  clientId?: string;
  freelancerId?: string;
  clientName?: string;
  clientHandle?: string;
  clientAddress?: string;
  clientAvatar?: string;
  milestones?: ContractMilestone[];
}

export function mapBackendContract(raw?: RawBackendContract | null): ContractDetail {
  if (!raw) {
    return {
      id: 'c-unknown',
      contractAddress: '0x0000...0000',
      title: 'Decentralized Project Contract',
      clientName: 'Client',
      clientAddress: '0x0000...0000',
      amount: 0,
      currency: 'BDT',
      releasedAmount: 0,
      inEscrowAmount: 0,
      status: 'FUNDED',
      network: 'Banglance Escrow (SSLCommerz)',
      startDate: 'Active',
      multisigThreshold: 'Banglance Protocol Safe',
      gracePeriodHours: 48,
      scopeOfWork: 'Implementation and delivery of verified milestone artifacts.',
      milestones: [],
    };
  }
  const escrow = Number(raw.escrowAmount ?? raw.amount ?? 0);
  const isCompleted = raw.status === 'COMPLETED';
  const isPending = raw.status === 'PENDING_APPROVAL';

  return {
    id: raw.id || 'c-unknown',
    contractAddress: raw.contractAddress || (raw.id ? `0x${raw.id.replace(/-/g, '').slice(0, 4)}...${raw.id.replace(/-/g, '').slice(-4)}` : '0x71c8...39A1'),
    title: raw.job?.title || raw.title || 'Decentralized Project Contract',
    clientName: raw.client?.clientProfile?.companyName || raw.client?.clientProfile?.fullName || raw.client?.email?.split('@')[0] || raw.clientName || 'Client',
    clientHandle: raw.client?.email ? `@${raw.client.email.split('@')[0]}` : raw.clientHandle,
    clientAddress: raw.clientId ? `0x${raw.clientId.replace(/-/g, '').slice(0, 4)}...${raw.clientId.replace(/-/g, '').slice(-4)}` : (raw.clientAddress || '0x9812...7e91'),
    clientAvatar: raw.client?.clientProfile?.avatarUrl || raw.clientAvatar,
    clientId: raw.clientId,
    freelancerId: raw.freelancerId,
    freelancerName: raw.freelancer?.freelancerProfile?.fullName || raw.freelancer?.email?.split('@')[0] || 'Freelancer',
    amount: escrow,
    currency: raw.currency || 'BDT',
    releasedAmount: isCompleted ? escrow : (raw.releasedAmount ?? 0),
    inEscrowAmount: isCompleted ? 0 : escrow,
    status: raw.status || 'FUNDED',
    network: raw.network || 'Banglance Escrow (SSLCommerz)',
    startDate: raw.createdAt ? new Date(raw.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : (raw.startDate || 'Active'),
    multisigThreshold: raw.multisigThreshold || 'Banglance Protocol Safe',
    gracePeriodHours: raw.gracePeriodHours || 48,
    scopeOfWork: raw.job?.description || raw.proposal?.coverLetter || raw.scopeOfWork || 'Implementation and delivery of verified milestone artifacts.',
    milestones: (raw.milestones && raw.milestones.length > 0) ? raw.milestones : [
      {
        step: '1',
        title: raw.job?.title || 'Deliverable Milestone Completion',
        amount: escrow,
        currency: raw.currency || 'BDT',
        status: isCompleted ? 'PAID' : 'ACTIVE',
        dueDate: 'Active',
        progressPct: isCompleted ? 100 : (isPending ? 95 : 60),
      }
    ]
  };
}

