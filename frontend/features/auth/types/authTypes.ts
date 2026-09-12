import { UserRole } from '@/types/user';

export interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthSuccessResponse {
  message: string;
  user: {
    id: string;
    email: string;
    role: UserRole;
    isEmailVerified: boolean;
    createdAt?: string;
  };
}

export interface VerifyEmailPayload {
  email?: string;
  code?: string;
}

export interface VerifyEmailResponse {
  message: string;
  isEmailVerified: boolean;
}

