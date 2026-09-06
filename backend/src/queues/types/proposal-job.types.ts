export type ProposalJobType =
  | 'PROPOSAL_SUBMITTED'
  | 'PROPOSAL_UPDATED'
  | 'PROPOSAL_STATUS_CHANGED';

export interface ProposalJobPayload {
  proposalId: string;
  jobId: string;
  freelancerId: string;
  coverLetter?: string;
  bidAmount?: number;
  newStatus?: string;
  timestamp: string;
}
