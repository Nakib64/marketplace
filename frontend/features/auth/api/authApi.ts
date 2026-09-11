import { apiClient } from '@/lib/api/apiClient';
import { AuthSuccessResponse, LoginPayload, RegisterPayload } from '../types/authTypes';
import { User } from '@/types/user';

export const authApi = {
  /**
   * Registers a new user account with role selection
   */
  async register(payload: RegisterPayload): Promise<AuthSuccessResponse> {
    const { data } = await apiClient.post<AuthSuccessResponse>('/auth/register', payload);
    return data;
  },

  /**
   * Logs in a user, setting authentication cookies
   */
  async login(payload: LoginPayload): Promise<AuthSuccessResponse> {
    const { data } = await apiClient.post<AuthSuccessResponse>('/auth/login', payload);
    return data;
  },

  /**
   * Logs out the user and clears server session cookies
   */
  async logout(): Promise<{ message: string }> {
    const { data } = await apiClient.post<{ message: string }>('/auth/logout');
    return data;
  },

  /**
   * Retrieves the current authenticated user profile
   */
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>('/auth/me');
    return data;
  },
};
