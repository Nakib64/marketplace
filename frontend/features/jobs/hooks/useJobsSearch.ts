'use client';

import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { jobsApi } from '../api/jobsApi';
import { JobSearchParams } from '../types/jobsTypes';

export function useJobsSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract current search params from URL
  const currentParams: JobSearchParams = {
    q: searchParams.get('q') || undefined,
    category: searchParams.get('category') || undefined,
    skills: searchParams.get('skills') || undefined,
    minBudget: searchParams.get('minBudget') ? Number(searchParams.get('minBudget')) : undefined,
    maxBudget: searchParams.get('maxBudget') ? Number(searchParams.get('maxBudget')) : undefined,
    sortBy: (searchParams.get('sortBy') as 'createdAt' | 'budget' | 'title') || 'createdAt',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc',
    page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
  };

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobs', currentParams],
    queryFn: () => jobsApi.searchJobs(currentParams),
  });

  const updateFilters = (newFilters: Partial<JobSearchParams>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    // Reset page to 1 on filter changes unless page itself was changed
    if (!newFilters.page) {
      params.set('page', '1');
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push(pathname);
  };

  return {
    jobs: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    totalPages: data?.totalPages || 1,
    isLoading,
    isError,
    currentParams,
    updateFilters,
    clearFilters,
    refetch,
  };
}
