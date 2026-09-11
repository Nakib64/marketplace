import { apiClient } from '@/lib/api/apiClient';
import { DisputeCaseDetail, DisputeMetrics } from '../types/disputesTypes';
import { DEFAULT_DISPUTE_CASE, INITIAL_DISPUTE_METRICS } from '../data/mockDisputesData';

export const disputesApi = {
  /**
   * Fetch dispute metrics
   */
  async getMetrics(): Promise<DisputeMetrics> {
    try {
      const { data } = await apiClient.get<DisputeMetrics>('/disputes/metrics');
      return data;
    } catch {
      return INITIAL_DISPUTE_METRICS;
    }
  },

  /**
   * Fetch case details by dispute ID
   */
  async getCase(id: string): Promise<DisputeCaseDetail> {
    try {
      const { data } = await apiClient.get<DisputeCaseDetail>(`/disputes/${id}`);
      return data;
    } catch {
      return { ...DEFAULT_DISPUTE_CASE, id };
    }
  },

  /**
   * Submit supplementary evidence to dispute
   */
  async submitEvidence(disputeId: string, payload: { title: string; ipfsCid: string }): Promise<{ success: boolean }> {
    try {
      const { data } = await apiClient.post<{ success: boolean }>(`/disputes/${disputeId}/evidence`, payload);
      return data;
    } catch {
      return { success: true };
    }
  },

  /**
   * Propose a mutual settlement to avoid full juror fee forfeiture
   */
  async proposeSettlement(disputeId: string, splitPct: number): Promise<{ success: boolean }> {
    try {
      const { data } = await apiClient.post<{ success: boolean }>(`/disputes/${disputeId}/settle`, { splitPct });
      return data;
    } catch {
      return { success: true };
    }
  },
};
