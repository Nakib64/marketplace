import { apiClient } from '@/lib/api/apiClient';
import {
  FreelancerProfile,
  FreelancerSearchParams,
  FreelancersResponse,
} from '../types/talentTypes';

export const talentApi = {
  /**
   * Search and filter freelancers with pagination
   */
  async searchFreelancers(params?: FreelancerSearchParams): Promise<FreelancersResponse> {
    const { data } = await apiClient.get<FreelancersResponse>('/users/freelancers', {
      params,
    });
    return data;
  },

  /**
   * Get public profile of a freelancer by ID
   */
  async getFreelancerProfile(id: string): Promise<FreelancerProfile> {
    const { data } = await apiClient.get<FreelancerProfile>(`/users/freelancers/${id}`);
    return data;
  },
};
