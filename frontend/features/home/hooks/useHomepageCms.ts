'use client';

import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/apiClient';

export interface HomepageCmsData {
  id: string;
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  showcaseBadge: string;
  showcaseTitle: string;
  showcaseDescription: string;
  metrics: Array<{
    value: string;
    label: string;
    sub: string;
    color?: string;
  }>;
  testimonials: Array<{
    author: string;
    role: string;
    badge: string;
    quote: string;
    stat: string;
    statLabel: string;
    avatar: string;
  }>;
  trustedBrands: string[];
  clientCtaTitle: string;
  clientCtaText: string;
  talentCtaTitle: string;
  talentCtaText: string;
}

export function useHomepageCms() {
  return useQuery<HomepageCmsData>({
    queryKey: ['homepage-cms'],
    queryFn: async () => {
      const { data } = await apiClient.get<HomepageCmsData>('/cms/homepage');
      return data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });
}
