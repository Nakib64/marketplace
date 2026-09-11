import { apiClient } from '@/lib/api/apiClient';
import { Job, JobCategory, JobSearchParams, JobsSearchResponse } from '../types/jobsTypes';

export const jobsApi = {
  /**
   * Search and filter jobs with pagination
   */
  async searchJobs(params?: JobSearchParams): Promise<JobsSearchResponse> {
    const { data } = await apiClient.get<JobsSearchResponse>('/jobs', {
      params,
    });
    return data;
  },

  /**
   * Get single job details by ID
   */
  async getJobDetails(jobId: string): Promise<Job> {
    const { data } = await apiClient.get<Job>(`/jobs/${jobId}`);
    return data;
  },

  /**
   * Fetch all active platform categories
   */
  async getCategories(): Promise<JobCategory[]> {
    const { data } = await apiClient.get<JobCategory[]>('/categories');
    return data;
  },

  /**
   * Fetch standardized skill tags
   */
  async getSkills(): Promise<string[]> {
    const { data } = await apiClient.get<string[]>('/skills');
    return data;
  },

  /**
   * Report a job posting for abuse or policy violations
   */
  async reportJob(jobId: string, reason: string): Promise<{ success: boolean; message: string }> {
    const { data } = await apiClient.post<{ success: boolean; message: string }>(`/jobs/${jobId}/report`, {
      reason,
    });
    return data;
  },

  /**
   * Create a new job posting
   */
  async createJob(payload: import('../types/jobsTypes').CreateJobPayload): Promise<Job> {
    const { data } = await apiClient.post<Job>('/jobs', payload);
    return data;
  },

  /**
   * Fetch all jobs posted by the authenticated client
   */
  async getMyJobs(): Promise<Job[]> {
    const { data } = await apiClient.get<Job[]>('/jobs/my-jobs');
    return data;
  },

  /**
   * Cancel an open job posting
   */
  async cancelJob(jobId: string): Promise<Job> {
    const { data } = await apiClient.delete<Job>(`/jobs/${jobId}`);
    return data;
  },
};

