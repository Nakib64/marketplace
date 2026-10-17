import { adminApiClient } from './adminApiClient';
import {
  AdminUser,
  AdminLoginResponse,
  AdminWithdrawal,
  AdminDisputeDossier,
  AdminUserListItem,
  AdminAuditLog,
  Category,
  SubCategory,
  Skill,
  AdminJob,
  AdminProposal,
  AdminUserProfileDossier,
  HomepageCmsConfig,
  OverviewAnalyticsData,
  FreelancerAnalyticsData,
  ClientAnalyticsData,
  CashFlowAnalyticsData,
  JobAnalyticsData,
  ProposalAnalyticsData,
  EnterpriseSettings,
} from '@/types/adminTypes';


export const adminAuthApi = {
  login: async (credentials: { email: string; password: string }): Promise<AdminLoginResponse> => {
    const { data } = await adminApiClient.post<AdminLoginResponse>('/admin/auth/login', credentials);
    return data;
  },

  verify2FA: async (payload: { preAuthToken: string; token: string }): Promise<{ message: string; admin: AdminUser }> => {
    const { data } = await adminApiClient.post<{ message: string; admin: AdminUser }>('/admin/auth/2fa/verify-login', payload);
    return data;
  },

  logout: async (): Promise<void> => {
    await adminApiClient.post('/admin/auth/logout');
  },

  getProfile: async (): Promise<AdminUser> => {
    const { data } = await adminApiClient.get<AdminUser>('/admin/auth/me');
    return data;
  },

  generate2FA: async (): Promise<{ secret: string; qrCodeUrl: string }> => {
    const { data } = await adminApiClient.post<{ secret: string; qrCodeUrl: string }>('/admin/auth/2fa/generate');
    return data;
  },

  enable2FA: async (token: string): Promise<{ message: string }> => {
    const { data } = await adminApiClient.post<{ message: string }>('/admin/auth/2fa/enable', { token });
    return data;
  },

  disable2FA: async (token: string): Promise<{ message: string }> => {
    const { data } = await adminApiClient.post<{ message: string }>('/admin/auth/2fa/disable', { token });
    return data;
  },
};

export const adminAnalyticsApi = {
  getTreasury: async (period?: string) => {
    const { data } = await adminApiClient.get('/admin/analytics/treasury', { params: { period } });
    return data;
  },

  getLiquidity: async () => {
    const { data } = await adminApiClient.get('/admin/analytics/liquidity');
    return data;
  },

  getOverview: async (timeframe?: string): Promise<OverviewAnalyticsData> => {
    const { data } = await adminApiClient.get<OverviewAnalyticsData>('/admin/analytics/overview', {
      params: { timeframe },
    });
    return data;
  },

  getFreelancers: async (timeframe?: string): Promise<FreelancerAnalyticsData> => {
    const { data } = await adminApiClient.get<FreelancerAnalyticsData>('/admin/analytics/freelancers', {
      params: { timeframe },
    });
    return data;
  },

  getClients: async (timeframe?: string): Promise<ClientAnalyticsData> => {
    const { data } = await adminApiClient.get<ClientAnalyticsData>('/admin/analytics/clients', {
      params: { timeframe },
    });
    return data;
  },

  getCashFlow: async (timeframe?: string): Promise<CashFlowAnalyticsData> => {
    const { data } = await adminApiClient.get<CashFlowAnalyticsData>('/admin/analytics/cash-flow', {
      params: { timeframe },
    });
    return data;
  },

  getJobs: async (timeframe?: string): Promise<JobAnalyticsData> => {
    const { data } = await adminApiClient.get<JobAnalyticsData>('/admin/analytics/jobs', {
      params: { timeframe },
    });
    return data;
  },

  getProposals: async (timeframe?: string): Promise<ProposalAnalyticsData> => {
    const { data } = await adminApiClient.get<ProposalAnalyticsData>('/admin/analytics/proposals', {
      params: { timeframe },
    });
    return data;
  },
};


export const adminPayoutsApi = {
  getWithdrawals: async (params?: { status?: string; page?: number; limit?: number }) => {
    const { data } = await adminApiClient.get<AdminWithdrawal[]>('/admin/withdrawals', { params });
    return data;
  },

  approve: async (id: string) => {
    const { data } = await adminApiClient.patch(`/admin/withdrawals/${id}/approve`);
    return data;
  },

  reject: async (id: string) => {
    const { data } = await adminApiClient.patch(`/admin/withdrawals/${id}/reject`);
    return data;
  },
};

export const adminDisputesApi = {
  getDisputes: async () => {
    const { data } = await adminApiClient.get<AdminDisputeDossier[]>('/admin/disputes');
    return data;
  },

  getDossier: async (id: string): Promise<AdminDisputeDossier> => {
    const { data } = await adminApiClient.get<AdminDisputeDossier>(`/admin/disputes/${id}`);
    return data;
  },

  refund: async (id: string, reason: string) => {
    const { data } = await adminApiClient.post(`/admin/disputes/${id}/refund`, { reason });
    return data;
  },

  release: async (id: string, reason: string) => {
    const { data } = await adminApiClient.post(`/admin/disputes/${id}/release`, { reason });
    return data;
  },

  split: async (id: string, clientSharePercentage: number, reason: string) => {
    const { data } = await adminApiClient.post(`/admin/disputes/${id}/split`, {
      clientSharePercentage,
      reason,
    });
    return data;
  },
};

export const adminCategoriesApi = {
  getAll: async (includeInactive = true): Promise<Category[]> => {
    const { data } = await adminApiClient.get<Category[]>('/admin/categories');
    return data;
  },

  create: async (payload: { name: string; slug?: string; description?: string; isActive?: boolean }): Promise<Category> => {
    const { data } = await adminApiClient.post<Category>('/admin/categories', payload);
    return data;
  },

  update: async (id: string, payload: { name?: string; slug?: string; description?: string; isActive?: boolean }): Promise<Category> => {
    const { data } = await adminApiClient.patch<Category>(`/admin/categories/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await adminApiClient.delete(`/admin/categories/${id}`);
  },

  addSubCategory: async (categoryId: string, payload: { name: string; slug?: string; description?: string; isActive?: boolean }): Promise<SubCategory> => {
    const { data } = await adminApiClient.post<SubCategory>(`/admin/categories/${categoryId}/sub-categories`, payload);
    return data;
  },

  updateSubCategory: async (subCategoryId: string, payload: { name?: string; slug?: string; description?: string; isActive?: boolean }): Promise<SubCategory> => {
    const { data } = await adminApiClient.patch<SubCategory>(`/admin/categories/sub-categories/${subCategoryId}`, payload);
    return data;
  },

  deleteSubCategory: async (subCategoryId: string): Promise<void> => {
    await adminApiClient.delete(`/admin/categories/sub-categories/${subCategoryId}`);
  },
};

export const adminSkillsApi = {
  getAll: async (search?: string): Promise<Skill[]> => {
    const { data } = await adminApiClient.get<Skill[]>('/admin/skills', { params: { q: search } });
    return data;
  },

  create: async (payload: { name: string; slug?: string; category?: string; isActive?: boolean }): Promise<Skill> => {
    const { data } = await adminApiClient.post<Skill>('/admin/skills', payload);
    return data;
  },

  update: async (id: string, payload: { name?: string; slug?: string; category?: string; isActive?: boolean }): Promise<Skill> => {
    const { data } = await adminApiClient.patch<Skill>(`/admin/skills/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<void> => {
    await adminApiClient.delete(`/admin/skills/${id}`);
  },
};

export const adminJobsApi = {
  getAll: async (params?: { status?: string; q?: string; category?: string; isFlagged?: boolean; page?: number; limit?: number }) => {
    const { data } = await adminApiClient.get<{ jobs: AdminJob[]; pagination: any }>('/admin/jobs', { params });
    return data;
  },

  getDetails: async (id: string): Promise<AdminJob> => {
    const { data } = await adminApiClient.get<AdminJob>(`/admin/jobs/${id}`);
    return data;
  },

  update: async (id: string, payload: any): Promise<AdminJob> => {
    const { data } = await adminApiClient.patch<AdminJob>(`/admin/jobs/${id}`, payload);
    return data;
  },

  cancel: async (id: string, reason?: string): Promise<any> => {
    const { data } = await adminApiClient.delete(`/admin/jobs/${id}`, { params: { reason } });
    return data;
  },

  getProposals: async (jobId: string, page = 1, limit = 20) => {
    const { data } = await adminApiClient.get<{ proposals: AdminProposal[]; pagination: any }>(`/admin/jobs/${jobId}/proposals`, {
      params: { page, limit },
    });
    return data;
  },

  updateProposalStatus: async (proposalId: string, status: string, reason?: string) => {
    const { data } = await adminApiClient.patch(`/admin/proposals/${proposalId}/status`, { status, adminReason: reason });
    return data;
  },
};

export const adminUsersApi = {
  getUsers: async (params?: { search?: string; role?: string; isBanned?: boolean; page?: number; limit?: number }) => {
    const { data } = await adminApiClient.get<{ users: AdminUserListItem[]; pagination: any }>('/admin/users', { params });
    return data;
  },

  getUserDossier: async (id: string): Promise<AdminUserProfileDossier> => {
    const { data } = await adminApiClient.get<AdminUserProfileDossier>(`/admin/users/${id}`);
    return data;
  },

  updateUser: async (id: string, payload: any) => {
    const { data } = await adminApiClient.patch(`/admin/users/${id}`, payload);
    return data;
  },

  updateStatus: async (id: string, isBanned: boolean, reason?: string) => {
    const { data } = await adminApiClient.patch(`/admin/users/${id}/status`, { isBanned, reason });
    return data;
  },

  verifyEmail: async (id: string) => {
    const { data } = await adminApiClient.patch(`/admin/users/${id}/verify`);
    return data;
  },

  updateClientProfile: async (id: string, payload: any) => {
    const { data } = await adminApiClient.patch(`/admin/users/${id}/client-profile`, payload);
    return data;
  },

  updateFreelancerProfile: async (id: string, payload: any) => {
    const { data } = await adminApiClient.patch(`/admin/users/${id}/freelancer-profile`, payload);
    return data;
  },

  deleteUser: async (id: string, reason?: string) => {
    const { data } = await adminApiClient.delete(`/admin/users/${id}`, { params: { reason } });
    return data;
  },
};

export const adminCmsApi = {
  getHomepage: async (): Promise<HomepageCmsConfig> => {
    const { data } = await adminApiClient.get<HomepageCmsConfig>('/admin/cms/homepage');
    return data;
  },

  updateHomepage: async (payload: Partial<HomepageCmsConfig>): Promise<HomepageCmsConfig> => {
    const { data } = await adminApiClient.patch<HomepageCmsConfig>('/admin/cms/homepage', payload);
    return data;
  },
};


export const adminSettingsApi = {
  getCircuitBreakers: async (): Promise<{ payouts: boolean; escrow: boolean; maintenance: boolean }> => {
    const { data } = await adminApiClient.get('/admin/settings/circuit-breakers');
    return data;
  },

  toggleCircuitBreaker: async (type: 'payouts' | 'escrow' | 'maintenance', state: boolean, reason?: string) => {
    const { data } = await adminApiClient.post('/admin/settings/circuit-breakers/toggle', {
      type,
      state,
      reason,
    });
    return data;
  },

  getPlatformFee: async (): Promise<{ platformFeePercentage: number }> => {
    const { data } = await adminApiClient.get('/admin/settings/platform-fee');
    return data;
  },

  updatePlatformFee: async (platformFeePercentage: number): Promise<{ platformFeePercentage: number }> => {
    const { data } = await adminApiClient.patch('/admin/settings/platform-fee', { platformFeePercentage });
    return data;
  },

  getEnterpriseSettings: async (): Promise<EnterpriseSettings> => {
    const { data } = await adminApiClient.get<EnterpriseSettings>('/admin/settings/enterprise');
    return data;
  },

  updateEnterpriseSettings: async (payload: Partial<EnterpriseSettings>): Promise<EnterpriseSettings> => {
    const { data } = await adminApiClient.patch<EnterpriseSettings>('/admin/settings/enterprise', payload);
    return data;
  },
};

export const adminAuditApi = {
  getLogs: async (params?: { search?: string; action?: string; page?: number; limit?: number }): Promise<AdminAuditLog[]> => {
    const { data } = await adminApiClient.get<AdminAuditLog[]>('/admin/audit-logs', { params });
    return data;
  },
};
