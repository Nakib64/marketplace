import { apiClient } from '@/lib/api/apiClient';
import { AcceptProposalResponse, ProposalItem, SubmitProposalPayload } from '../types/proposalsTypes';

export const proposalsApi = {
  /**
   * Fetch all inbound candidate proposals for a specific job posting
   */
  async getJobProposals(jobId: string): Promise<ProposalItem[]> {
    const { data } = await apiClient.get<ProposalItem[]>(`/jobs/${jobId}/proposals`);
    return data;
  },

  /**
   * Client accepts proposal and initiates escrow smart contract co-signing / SSLCommerz gateway
   */
  async acceptProposal(proposalId: string): Promise<AcceptProposalResponse> {
    const { data } = await apiClient.post<AcceptProposalResponse>(
      '/contracts/accept-proposal',
      { proposalId }
    );
    return data;
  },


  /**
   * Freelancer submits a bid proposal for an open job
   */
  async submitProposal(jobId: string, payload: SubmitProposalPayload): Promise<ProposalItem> {
    const { data } = await apiClient.post<ProposalItem>(`/proposals/job/${jobId}`, payload);
    return data;
  },

  /**
   * Freelancer retrieves their submitted proposals
   */
  async getMyProposals(): Promise<ProposalItem[]> {
    const { data } = await apiClient.get<ProposalItem[]>('/proposals/my-proposals');
    return data;
  },
};
