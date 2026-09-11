import { apiClient } from '@/lib/api/apiClient';

export interface UpdateFreelancerProfilePayload {
  title?: string;
  description?: string;
  hourlyRate?: number;
  skills?: string[];
}

export const freelancerApi = {
  /**
   * Fetch current authenticated user profile
   */
  async getMyProfile() {
    const { data } = await apiClient.get('/users/me');
    return data;
  },

  /**
   * Update freelancer professional identity and rates
   */
  async updateFreelancerProfile(payload: UpdateFreelancerProfilePayload) {
    const { data } = await apiClient.patch('/users/me/freelancer-profile', payload);
    return data;
  },

  /**
   * Request withdrawal from wallet
   */
  async requestWithdrawal(amount: number, recipientAddress: string) {
    const { data } = await apiClient.post('/wallet/withdraw', { amount, recipientAddress });
    return data;
  },
};
