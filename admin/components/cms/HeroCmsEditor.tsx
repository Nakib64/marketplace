'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCmsApi } from '@/lib/api/adminApi';
import { HomepageCmsConfig } from '@/types/adminTypes';
import { Sparkles, Save, Loader2 } from 'lucide-react';
import { CmsSubNav } from './CmsSubNav';
import { toast } from 'sonner';

export function HeroCmsEditor() {
  const queryClient = useQueryClient();

  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState('');
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState('');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('');
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState('');

  const [showcaseBadge, setShowcaseBadge] = useState('');
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseDescription, setShowcaseDescription] = useState('');

  const { data: cmsData, isLoading, isError } = useQuery<HomepageCmsConfig>({
    queryKey: ['admin-homepage-cms'],
    queryFn: () => adminCmsApi.getHomepage(),
  });

  useEffect(() => {
    if (cmsData) {
      setHeroBadge(cmsData.heroBadge || '');
      setHeroTitle(cmsData.heroTitle || '');
      setHeroSubtitle(cmsData.heroSubtitle || '');
      setHeroPrimaryCtaText(cmsData.heroPrimaryCtaText || '');
      setHeroPrimaryCtaLink(cmsData.heroPrimaryCtaLink || '');
      setHeroSecondaryCtaText(cmsData.heroSecondaryCtaText || '');
      setHeroSecondaryCtaLink(cmsData.heroSecondaryCtaLink || '');

      setShowcaseBadge(cmsData.showcaseBadge || '');
      setShowcaseTitle(cmsData.showcaseTitle || '');
      setShowcaseDescription(cmsData.showcaseDescription || '');
    }
  }, [cmsData]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<HomepageCmsConfig>) => adminCmsApi.updateHomepage(payload),
    onSuccess: () => {
      toast.success('Hero Section & Showcase card copy published.');
      queryClient.invalidateQueries({ queryKey: ['admin-homepage-cms'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update hero copy.');
    },
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({
      heroBadge,
      heroTitle,
      heroSubtitle,
      heroPrimaryCtaText,
      heroPrimaryCtaLink,
      heroSecondaryCtaText,
      heroSecondaryCtaLink,
      showcaseBadge,
      showcaseTitle,
      showcaseDescription,
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Hero Section &amp; Showcase Promotion</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Configure the main above-the-fold headline, subtitle, action buttons, and side card.
          </p>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Publish Hero Changes</span>
        </button>
      </div>

      <CmsSubNav />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading hero content...</span>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
              Main Editorial Hero Copy
            </h3>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Top Status Badge Copy
              </label>
              <input
                type="text"
                value={heroBadge}
                onChange={(e) => setHeroBadge(e.target.value)}
                placeholder="e.g. Banglance Marketplace • 100% Milestone Protection"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Hero Headline (H1)
              </label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                placeholder="e.g. How work should work"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Hero Subtitle Description
              </label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="space-y-2 p-3.5 rounded-xl bg-[#f9faf9] border border-outline-variant/60">
                <span className="text-xs font-bold text-primary block">Primary Action Button</span>
                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Button Text</label>
                  <input
                    type="text"
                    value={heroPrimaryCtaText}
                    onChange={(e) => setHeroPrimaryCtaText(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Route Path</label>
                  <input
                    type="text"
                    value={heroPrimaryCtaLink}
                    onChange={(e) => setHeroPrimaryCtaLink(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-[#f9faf9] border border-outline-variant/60">
                <span className="text-xs font-bold text-primary block">Secondary Action Button</span>
                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Button Text</label>
                  <input
                    type="text"
                    value={heroSecondaryCtaText}
                    onChange={(e) => setHeroSecondaryCtaText(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Route Path</label>
                  <input
                    type="text"
                    value={heroSecondaryCtaLink}
                    onChange={(e) => setHeroSecondaryCtaLink(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
              Right Showcase Promotion Card
            </h3>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Card Pill Tag</label>
              <input
                type="text"
                value={showcaseBadge}
                onChange={(e) => setShowcaseBadge(e.target.value)}
                placeholder="e.g. FOR CLIENTS & TALENT"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Card Headline</label>
              <input
                type="text"
                value={showcaseTitle}
                onChange={(e) => setShowcaseTitle(e.target.value)}
                placeholder="e.g. Up your work game, it’s free"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Card Explainer Body</label>
              <textarea
                rows={3}
                value={showcaseDescription}
                onChange={(e) => setShowcaseDescription(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
              />
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
