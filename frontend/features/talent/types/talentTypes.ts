export interface PortfolioImage {
  id: string;
  imageUrl: string;
  order?: number;
}

export interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  projectUrl?: string;
  images?: PortfolioImage[];
}

export interface WorkHistory {
  id: string;
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
}

export interface TalentReview {
  id: string;
  rating: number;
  feedback: string;
  contractTitle?: string;
  clientName?: string;
  amount?: number;
  createdAt: string;
}

export interface FreelancerUser {
  id: string;
  email: string;
  createdAt: string;
  workHistories?: WorkHistory[];
}

export interface FreelancerProfile {
  id: string;
  userId: string;
  title: string | null;
  description: string | null;
  hourlyRate: number | null;
  skills: string[];
  totalProjects: number;
  earnings: number;
  rating: number;
  totalReviews: number;
  successRate: number;
  createdAt: string;
  user: FreelancerUser;
  portfolioItems?: PortfolioItem[];
  reviews?: TalentReview[];
}

export interface FreelancerSearchParams {
  skills?: string;
  minRate?: number;
  maxRate?: number;
  q?: string;
  page?: number;
  limit?: number;
}

export interface FreelancersResponse {
  data: FreelancerProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
