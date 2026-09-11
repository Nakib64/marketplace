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
