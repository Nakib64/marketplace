export interface JobCategory {
  id: string;
  name: string;
  slug?: string;
  description?: string;
}

export interface JobSubCategory {
  id: string;
  name: string;
  slug?: string;
  categoryId: string;
}

export interface ClientProfileData {
  id?: string;
  companyName?: string | null;
  billingDetails?: string | null;
  totalJobPosts?: number;
  totalSpent?: number | string;
  rating?: number;
  totalReviews?: number;
  createdAt?: string;
}

export interface JobClientInfo {
  id: string;
  email: string;
  createdAt: string;
  clientProfile?: ClientProfileData | null;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  category?: JobCategory | null;
  subCategory?: JobSubCategory | null;
  categoryName?: string;
  subCategoryName?: string;
  skills: string[];
  clientId: string;
  client?: JobClientInfo;
  createdAt: string;
  updatedAt?: string;
  _count?: {
    proposals?: number;
  };
}

export interface JobSearchParams {
  q?: string;
  category?: string;
  subCategory?: string;
  skills?: string;
  minBudget?: number;
  maxBudget?: number;
  sortBy?: 'createdAt' | 'budget' | 'title';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface JobsSearchResponse {
  data: Job[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateJobPayload {
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  budget: number;
  skills: string[];
}

