export interface PortfolioImage {
  id: string;
  imageUrl: string;
  subtitle?: string | null;
  order?: number;
}

export interface PortfolioItem {
  id: string;
  freelancerProfileId?: string;
  title: string;
  details?: string;
  description?: string;
  liveLink?: string | null;
  projectUrl?: string | null;
  createdAt?: string;
  images?: PortfolioImage[];
}

export interface Certificate {
  id: string;
  freelancerProfileId?: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  createdAt?: string;
}

export interface Education {
  id: string;
  freelancerProfileId?: string;
  institution: string;
  degree: string;
  fieldOfStudy?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  description?: string | null;
  createdAt?: string;
}

export interface WorkHistory {
  id: string;
  userId?: string;
  company: string;
  title: string;
  position?: string;
  location?: string | null;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
  isCurrent?: boolean;
  createdAt?: string;
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
  slug?: string | null;
  title: string | null;
  description: string | null;
  hourlyRate: number | null;
  skills: string[];
  country?: string | null;
  city?: string | null;
  address?: string | null;
  totalProjects: number;
  earnings: number;
  rating: number;
  totalReviews: number;
  successRate: number;
  createdAt: string;
  user: FreelancerUser;
  portfolioItems?: PortfolioItem[];
  certificates?: Certificate[];
  educations?: Education[];
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
