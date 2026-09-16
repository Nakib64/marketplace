import { apiClient } from '@/lib/api/apiClient';
import { Certificate, Education, PortfolioItem, WorkHistory } from '@/features/talent/types/talentTypes';

export interface UpdateFreelancerProfilePayload {
  title?: string;
  description?: string;
  hourlyRate?: number;
  skills?: string[];
  country?: string;
  city?: string;
  address?: string;
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
   * Update freelancer professional identity, address, and rates
   */
  async updateFreelancerProfile(payload: UpdateFreelancerProfilePayload) {
    const { data } = await apiClient.patch('/users/me/freelancer-profile', payload);
    return data;
  },

  /**
   * Upload image to backend storage in organized category folder
   */
  async uploadImage(
    file: File,
    folder: 'portfolio' | 'certificates' | 'avatars' | 'media' = 'media'
  ): Promise<{ url: string; filename: string; folder: string }> {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await apiClient.post(`/upload/image?folder=${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  // --- Portfolio Projects ---
  async addPortfolioItem(payload: {
    title: string;
    details: string;
    liveLink?: string;
    images?: { imageUrl: string; subtitle?: string }[];
  }): Promise<PortfolioItem> {
    const { data } = await apiClient.post('/users/me/portfolio', payload);
    return data;
  },

  async updatePortfolioItem(
    id: string,
    payload: {
      title?: string;
      details?: string;
      liveLink?: string;
      images?: { imageUrl: string; subtitle?: string }[];
    }
  ): Promise<PortfolioItem> {
    const { data } = await apiClient.patch(`/users/me/portfolio/${id}`, payload);
    return data;
  },

  async deletePortfolioItem(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/users/me/portfolio/${id}`);
    return data;
  },

  // --- Certificates ---
  async getCertificates(): Promise<Certificate[]> {
    const { data } = await apiClient.get('/users/me/certificates');
    return data;
  },

  async addCertificate(payload: {
    title: string;
    issuer: string;
    issueDate: string;
    credentialUrl?: string;
    imageUrl?: string;
  }): Promise<Certificate> {
    const { data } = await apiClient.post('/users/me/certificates', payload);
    return data;
  },

  async updateCertificate(
    id: string,
    payload: Partial<{
      title: string;
      issuer: string;
      issueDate: string;
      credentialUrl?: string;
      imageUrl?: string;
    }>
  ): Promise<Certificate> {
    const { data } = await apiClient.patch(`/users/me/certificates/${id}`, payload);
    return data;
  },

  async deleteCertificate(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/users/me/certificates/${id}`);
    return data;
  },

  // --- Education ---
  async getEducations(): Promise<Education[]> {
    const { data } = await apiClient.get('/users/me/education');
    return data;
  },

  async addEducation(payload: {
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
    description?: string;
  }): Promise<Education> {
    const { data } = await apiClient.post('/users/me/education', payload);
    return data;
  },

  async updateEducation(
    id: string,
    payload: Partial<{
      institution: string;
      degree: string;
      fieldOfStudy?: string;
      startDate: string;
      endDate?: string;
      isCurrent?: boolean;
      description?: string;
    }>
  ): Promise<Education> {
    const { data } = await apiClient.patch(`/users/me/education/${id}`, payload);
    return data;
  },

  async deleteEducation(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/users/me/education/${id}`);
    return data;
  },

  // --- Work History ---
  async addWorkHistory(payload: {
    title: string;
    company: string;
    location?: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isCurrent?: boolean;
  }): Promise<WorkHistory> {
    const { data } = await apiClient.post('/users/me/work-history', payload);
    return data;
  },

  async updateWorkHistory(
    id: string,
    payload: Partial<{
      title: string;
      company: string;
      location?: string;
      description?: string;
      startDate: string;
      endDate?: string;
      isCurrent?: boolean;
    }>
  ): Promise<WorkHistory> {
    const { data } = await apiClient.patch(`/users/me/work-history/${id}`, payload);
    return data;
  },

  async deleteWorkHistory(id: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`/users/me/work-history/${id}`);
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
