'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCmsApi } from '@/lib/api/adminApi';
import { HomepageCmsConfig } from '@/types/adminTypes';
import { Layers, Save, Loader2 } from 'lucide-react';
import { CmsSubNav } from './CmsSubNav';
import { toast } from 'sonner';

export function CtaCmsEditor() {
  const queryClient = useQueryClient();
  const [clientCtaTitle, setClientCtaTitle] = useState('');
  const [clientCtaText, setClientCtaText] = useState('');
  const [talentCtaTitle, setTalentCtaTitle] = useState('');
  const [talentCtaText, setTalentCtaText] = useState('');

  const { data: cmsData, isLoading } = useQuery<HomepageCmsConfig>({
    queryKey: ['admin-homepage-cms'],
    queryFn: () => adminCmsApi.getHomepage(),
  });

  useEffect(() => {
    if (cmsData) {
      setClientCtaTitle(cmsData.clientCtaTitle || '');
      setClientCtaText(cmsData.clientCtaText || '');
      setTalentCtaTitle(cmsData.talentCtaTitle || '');
      setTalentCtaText(cmsData.talentCtaText || '');
    }
  }, [cmsData]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<HomepageCmsConfig>) => adminCmsApi.updateHomepage(payload),
    onSuccess: () => {
      toast.success('Bottom CTA cards copy published.');
      queryClient.invalidateQueries({ queryKey: ['admin-homepage-cms'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update CTA copy.');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      clientCtaTitle,
      clientCtaText,
      talentCtaTitle,
      talentCtaText,
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Bottom Call-to-Action Cards</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Configure the conversion cards for both prospective employers and independent talent.
          </p>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Publish CTAs</span>
        </button>
      </div>

      <CmsSubNav />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading CTA copy...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
              For Clients Card (Dark Teal Conversion Card)
            </h3>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Headline</label>
              <input
                type="text"
                value={clientCtaTitle}
                onChange={(e) => setClientCtaTitle(e.target.value)}
                placeholder="e.g. Find talent your way"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Body Copy</label>
              <textarea
                rows={3}
                value={clientCtaText}
                onChange={(e) => setClientCtaText(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
              For Talent Card (Light Conversion Card)
            </h3>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Headline</label>
              <input
                type="text"
                value={talentCtaTitle}
                onChange={(e) => setTalentCtaTitle(e.target.value)}
                placeholder="e.g. Find great work"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Body Copy</label>
              <textarea
                rows={3}
                value={talentCtaText}
                onChange={(e) => setTalentCtaText(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
