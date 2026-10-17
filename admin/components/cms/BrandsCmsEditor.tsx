'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCmsApi } from '@/lib/api/adminApi';
import { HomepageCmsConfig } from '@/types/adminTypes';
import { BadgeCheck, Save, Loader2 } from 'lucide-react';
import { CmsSubNav } from './CmsSubNav';
import { toast } from 'sonner';

export function BrandsCmsEditor() {
  const queryClient = useQueryClient();
  const [brandsString, setBrandsString] = useState('');

  const { data: cmsData, isLoading } = useQuery<HomepageCmsConfig>({
    queryKey: ['admin-homepage-cms'],
    queryFn: () => adminCmsApi.getHomepage(),
  });

  useEffect(() => {
    if (cmsData) {
      setBrandsString(Array.isArray(cmsData.trustedBrands) ? cmsData.trustedBrands.join(', ') : '');
    }
  }, [cmsData]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<HomepageCmsConfig>) => adminCmsApi.updateHomepage(payload),
    onSuccess: () => {
      toast.success('Trusted brand partners published.');
      queryClient.invalidateQueries({ queryKey: ['admin-homepage-cms'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update brand logos.');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const brandsArray = brandsString
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    updateMutation.mutate({ trustedBrands: brandsArray });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BadgeCheck className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Trusted Brands &amp; Social Proof</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage partner brand names and logos featured in the homepage social proof bar.
          </p>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Publish Brands</span>
        </button>
      </div>

      <CmsSubNav />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading brands configuration...</span>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
            Company &amp; Organization Names
          </h3>

          <p className="text-xs text-outline">
            Enter comma-separated brand or organization names. These will be highlighted in the trust bar below the hero section.
          </p>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Brand Names List (Comma Separated)
            </label>
            <input
              type="text"
              value={brandsString}
              onChange={(e) => setBrandsString(e.target.value)}
              placeholder="e.g. Microsoft, Airbnb, Automattic, Bissell, GoDaddy"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="p-4 bg-[#f9faf9] rounded-xl border border-outline-variant/60">
            <span className="text-xs font-bold text-on-surface block mb-2">Live Preview Preview:</span>
            <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-[#9aaa97]">
              {brandsString
                .split(',')
                .map((b) => b.trim())
                .filter(Boolean)
                .map((b) => (
                  <span key={b} className="hover:text-[#001e00] transition-colors">
                    {b}
                  </span>
                ))}
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
