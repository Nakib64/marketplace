import { apiClient } from '@/lib/api/apiClient';
import {
  ContractDetail,
  WorkSubmissionPayload,
  SubmitReviewPayload,
  ReviewResponse,
} from '../types/contractsTypes';

export const contractsApi = {
  /**
   * Fetch single contract details by contract ID
   */
  async getContract(id: string): Promise<ContractDetail> {
    const { data } = await apiClient.get<ContractDetail>(`/contracts/${id}`);
    return data;
  },

  /**
   * Fetch all contracts associated with the authenticated user
   */
  async getUserContracts(): Promise<ContractDetail[]> {
    const { data } = await apiClient.get<ContractDetail[]>('/contracts');
    return data;
  },

  /**
   * Freelancer submits completed milestone work
   */
  async submitWork(id: string, payload?: WorkSubmissionPayload): Promise<{ success?: boolean; message?: string }> {
    const { data } = await apiClient.post<{ success?: boolean; message?: string }>(`/contracts/${id}/submit-work`, payload);
    return data;
  },

  /**
   * Client approves milestone work, releasing escrow funds
   */
  async approveWork(id: string): Promise<{ success?: boolean; message?: string }> {
    const { data } = await apiClient.post<{ success?: boolean; message?: string }>(`/contracts/${id}/approve-work`);
    return data;
  },

  /**
   * Party disputes a contract, escalating to decentralized arbitration
   */
  async disputeContract(id: string): Promise<{ success?: boolean; message?: string }> {
    const { data } = await apiClient.post<{ success?: boolean; message?: string }>(`/contracts/${id}/dispute`);
    return data;
  },

  /**
   * Submit double-blind review for completed contract
   */
  async submitReview(payload: SubmitReviewPayload): Promise<ReviewResponse> {
    const { data } = await apiClient.post<ReviewResponse>('/reviews', payload);
    return data;
  },

  /**
   * Fetch reviews for a specific contract
   */
  async getContractReviews(contractId: string): Promise<ReviewResponse[]> {
    const { data } = await apiClient.get<ReviewResponse[]>(`/reviews/contract/${contractId}`);
    return data;
  },
};

