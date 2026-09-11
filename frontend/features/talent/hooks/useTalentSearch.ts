'use client';

import { useMemo } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { talentApi } from '../api/talentApi';
import { FreelancerProfile, FreelancerSearchParams } from '../types/talentTypes';

// Fallback seed talent for local dev when database has few profiles
const FALLBACK_TALENT: FreelancerProfile[] = [
  {
    id: 'talent-1',
    userId: 'user-1',
    title: 'Senior Solidity & EVM Protocol Architect',
    description:
      'Specializing in DEX AMM architecture, gas optimization (Yul/assembly), and Foundry invariant fuzzing. $180M+ TVL protected across audited protocol deployments.',
    hourlyRate: 120,
    skills: ['Solidity', 'Uniswap v3', 'Foundry', 'Slither', 'Yul', 'Arbitrum'],
    totalProjects: 38,
    earnings: 240000,
    rating: 5.0,
    totalReviews: 42,
    successRate: 100,
    createdAt: new Date().toISOString(),
    user: { id: 'u1', email: 'alex.rivera@banglance.dev', createdAt: new Date().toISOString() },
  },
  {
    id: 'talent-2',
    userId: 'user-2',
    title: 'Smart Contract Security Auditor & Cryptographer',
    description:
      'Formal verification specialist for Solana and EVM stacks. Uncovered 14 high-severity vulnerabilities across production DeFi protocols.',
    hourlyRate: 140,
    skills: ['Rust', 'Solana', 'Anchor', 'ZK-SNARKs', 'Foundry'],
    totalProjects: 27,
    earnings: 195000,
    rating: 4.9,
    totalReviews: 29,
    successRate: 98,
    createdAt: new Date().toISOString(),
    user: { id: 'u2', email: 'elena.vance@banglance.dev', createdAt: new Date().toISOString() },
  },
  {
    id: 'talent-3',
    userId: 'user-3',
    title: 'Lead Web3 Product & UI/UX Designer',
    description:
      'Crafting intuitive onboarding and humanized transaction approval flows for non-custodial wallets, multi-sig vaults, and DeFi dashboards.',
    hourlyRate: 85,
    skills: ['Figma', 'UI/UX', 'Design Systems', 'Prototyping', 'Tailwind CSS'],
    totalProjects: 35,
    earnings: 110000,
    rating: 4.9,
    totalReviews: 35,
    successRate: 100,
    createdAt: new Date().toISOString(),
    user: { id: 'u3', email: 'liam.chen@banglance.dev', createdAt: new Date().toISOString() },
  },
];

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

  const freelancers = data?.data?.length ? data.data : (isLoading ? [] : FALLBACK_TALENT);
  const total = data?.total ?? FALLBACK_TALENT.length;
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
