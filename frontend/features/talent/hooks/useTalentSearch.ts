'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { talentApi } from '../api/talentApi';
import { FreelancerSearchParams } from '../types/talentTypes';

export function useTalentSearch() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentParams: FreelancerSearchParams = useMemo(() => {
    return {
      q: searchParams.get('q') || undefined,
      skills: searchParams.get('skills') || undefined,
      minRate: searchParams.get('minRate') ? Number(searchParams.get('minRate')) : undefined,
      maxRate: searchParams.get('maxRate') ? Number(searchParams.get('maxRate')) : undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : 1,
      limit: 10,
    };
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['freelancers', currentParams],
    queryFn: () => talentApi.searchFreelancers(currentParams),
    staleTime: 30000,
  });

  const updateFilters = (newParams: Partial<FreelancerSearchParams>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    if (!newParams.page && params.has('page')) {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  const clearFilters = () => router.push(pathname);

  const freelancers = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return {
    freelancers,
    total,
    page: currentParams.page || 1,
    totalPages,
    isLoading,
    currentParams,
    updateFilters,
    clearFilters,
  };
}
