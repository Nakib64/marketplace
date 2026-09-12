export type UserRole = 'CLIENT' | 'FREELANCER';

export interface ClientProfile {
  id: string;
  userId: string;
  companyName?: string;
  website?: string;
  billingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  bio?: string;
  hourlyRate?: number;
  skills: string[];
  rating: number;
  totalReviews: number;
  completedJobsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isEmailVerified: boolean;
  avatarUrl?: string;
  clientProfile?: ClientProfile | null;
  freelancerProfile?: FreelancerProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}
