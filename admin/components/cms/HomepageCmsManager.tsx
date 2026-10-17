'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCmsApi } from '@/lib/api/adminApi';
import { HomepageCmsConfig } from '@/types/adminTypes';
import {
  Globe,
  Save,
  Loader2,
  Sparkles,
  BarChart3,
  MessageSquare,
  Layout,
  Plus,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';

export function HomepageCmsManager() {
  const queryClient = useQueryClient();
  const [activeSection, setActiveSection] = useState<'HERO' | 'METRICS' | 'TESTIMONIALS' | 'BRANDS' | 'BOTTOM_CTA'>('HERO');

  // Hero Section State
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');
  const [heroPrimaryCtaText, setHeroPrimaryCtaText] = useState('');
  const [heroPrimaryCtaLink, setHeroPrimaryCtaLink] = useState('');
  const [heroSecondaryCtaText, setHeroSecondaryCtaText] = useState('');
  const [heroSecondaryCtaLink, setHeroSecondaryCtaLink] = useState('');

  // Right Showcase Card State
  const [showcaseBadge, setShowcaseBadge] = useState('');
  const [showcaseTitle, setShowcaseTitle] = useState('');
  const [showcaseDescription, setShowcaseDescription] = useState('');

  // Metrics State
  const [metrics, setMetrics] = useState<Array<{ value: string; label: string; sub: string; color?: string }>>([]);

  // Testimonials State
  const [testimonials, setTestimonials] = useState<
    Array<{ author: string; role: string; badge: string; quote: string; stat: string; statLabel: string; avatar: string }>
  >([]);

  // Trusted Brands State
  const [brandsString, setBrandsString] = useState('');

  // Bottom CTA State
  const [clientCtaTitle, setClientCtaTitle] = useState('');
  const [clientCtaText, setClientCtaText] = useState('');
  const [talentCtaTitle, setTalentCtaTitle] = useState('');
  const [talentCtaText, setTalentCtaText] = useState('');

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

      setMetrics(Array.isArray(cmsData.metrics) ? cmsData.metrics : []);
      setTestimonials(Array.isArray(cmsData.testimonials) ? cmsData.testimonials : []);
      setBrandsString(Array.isArray(cmsData.trustedBrands) ? cmsData.trustedBrands.join(', ') : '');

      setClientCtaTitle(cmsData.clientCtaTitle || '');
      setClientCtaText(cmsData.clientCtaText || '');
      setTalentCtaTitle(cmsData.talentCtaTitle || '');
      setTalentCtaText(cmsData.talentCtaText || '');
    }
  }, [cmsData]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<HomepageCmsConfig>) => adminCmsApi.updateHomepage(payload),
    onSuccess: () => {
      toast.success('Homepage CMS content successfully published.');
      queryClient.invalidateQueries({ queryKey: ['admin-homepage-cms'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update homepage CMS.');
    },
  });

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    const brandsArray = brandsString
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

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
      metrics,
      testimonials,
      trustedBrands: brandsArray,
      clientCtaTitle,
      clientCtaText,
      talentCtaTitle,
      talentCtaText,
    });
  };

  const handleMetricChange = (index: number, field: string, val: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: val };
    setMetrics(updated);
  };

  const handleAddMetric = () => {
    setMetrics([...metrics, { value: '100%', label: 'Metric Label', sub: 'Supporting description' }]);
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleTestimonialChange = (index: number, field: string, val: string) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: val };
    setTestimonials(updated);
  };

  const handleAddTestimonial = () => {
    setTestimonials([
      ...testimonials,
      {
        author: 'New Customer',
        role: 'Founder, Startup',
        badge: 'Verified Client',
        quote: 'Banglance provided immediate access to top talent.',
        stat: '৳500K',
        statLabel: 'Protected',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      },
    ]);
  };

  const handleRemoveTestimonial = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-outline-variant shadow-xs">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
        <span className="text-xs text-outline font-medium">Loading Homepage CMS configuration...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs">
        Failed to fetch CMS settings. Check your network or try refreshing.
      </div>
    );
  }

  return (
    <form onSubmit={handleSaveAll} className="space-y-6">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Homepage CMS &amp; Content Management</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Customize hero editorial copy, metrics, customer stories, brand social proof, and call-to-actions.
          </p>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          {updateMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>Publish Changes</span>
        </button>
      </div>

      {/* Sections Tab Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-outline-variant shadow-xs">
        <button
          type="button"
          onClick={() => setActiveSection('HERO')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            activeSection === 'HERO'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Hero &amp; Showcase</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('METRICS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            activeSection === 'METRICS'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Platform Metrics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('TESTIMONIALS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            activeSection === 'TESTIMONIALS'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <MessageSquare className="h-3.5 w-3.5" />
          <span>Customer Stories</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('BRANDS')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            activeSection === 'BRANDS'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <Globe className="h-3.5 w-3.5" />
          <span>Trusted Brands</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('BOTTOM_CTA')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
            activeSection === 'BOTTOM_CTA'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface hover:bg-surface-container'
          }`}
        >
          <Layout className="h-3.5 w-3.5" />
          <span>Bottom CTAs</span>
        </button>
      </div>

      {/* SECTION 1: HERO & SHOWCASE CARD */}
      {activeSection === 'HERO' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
              Main Hero Section
            </h3>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Status Badge Pill Copy
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
                Primary Hero Headline (H1)
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
                <span className="text-xs font-bold text-primary block">Primary Action CTA</span>
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
                  <label className="block text-[11px] font-semibold text-outline mb-1">Target Route URL</label>
                  <input
                    type="text"
                    value={heroPrimaryCtaLink}
                    onChange={(e) => setHeroPrimaryCtaLink(e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="space-y-2 p-3.5 rounded-xl bg-[#f9faf9] border border-outline-variant/60">
                <span className="text-xs font-bold text-primary block">Secondary Action CTA</span>
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
                  <label className="block text-[11px] font-semibold text-outline mb-1">Target Route URL</label>
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

          {/* Right Showcase Card */}
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
              Right Showcase Promotion Card
            </h3>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Card Pill Tag
              </label>
              <input
                type="text"
                value={showcaseBadge}
                onChange={(e) => setShowcaseBadge(e.target.value)}
                placeholder="e.g. FOR CLIENTS & TALENT"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Card Title Headline
              </label>
              <input
                type="text"
                value={showcaseTitle}
                onChange={(e) => setShowcaseTitle(e.target.value)}
                placeholder="e.g. Up your work game, it’s free"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Card Explainer Copy
              </label>
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

      {/* SECTION 2: PLATFORM METRICS */}
      {activeSection === 'METRICS' && (
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Key Platform Metrics</h3>
              <p className="text-xs text-outline mt-0.5">Custom numbers displayed in the metrics ribbon.</p>
            </div>
            <button
              type="button"
              onClick={handleAddMetric}
              className="px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-outline-variant bg-[#f9faf9] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-outline">Metric #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="text-outline hover:text-red-600 cursor-pointer p-1"
                    title="Remove Metric"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Statistic Display</label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                      placeholder="e.g. ৳50M+, 99.4%"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Metric Title</label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                      placeholder="e.g. Protected Payments"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Subtext Explainer</label>
                  <input
                    type="text"
                    value={m.sub}
                    onChange={(e) => handleMetricChange(idx, 'sub', e.target.value)}
                    placeholder="e.g. Completed projects"
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 3: TESTIMONIALS */}
      {activeSection === 'TESTIMONIALS' && (
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Customer Stories &amp; Testimonials</h3>
              <p className="text-xs text-outline mt-0.5">Showcase real client and talent feedback on the homepage.</p>
            </div>
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Story</span>
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-outline-variant bg-[#f9faf9] space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-outline">Customer Story #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTestimonial(idx)}
                    className="text-outline hover:text-red-600 cursor-pointer p-1"
                    title="Remove Story"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Author Name</label>
                    <input
                      type="text"
                      value={t.author}
                      onChange={(e) => handleTestimonialChange(idx, 'author', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Professional Role</label>
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={t.badge}
                      onChange={(e) => handleTestimonialChange(idx, 'badge', e.target.value)}
                      placeholder="e.g. Verified Client"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Customer Quote</label>
                  <textarea
                    rows={3}
                    value={t.quote}
                    onChange={(e) => handleTestimonialChange(idx, 'quote', e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Highlight Stat (৳ / %)</label>
                    <input
                      type="text"
                      value={t.stat}
                      onChange={(e) => handleTestimonialChange(idx, 'stat', e.target.value)}
                      placeholder="e.g. ৳2.1M"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Stat Label</label>
                    <input
                      type="text"
                      value={t.statLabel}
                      onChange={(e) => handleTestimonialChange(idx, 'statLabel', e.target.value)}
                      placeholder="e.g. Paid Securely"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Avatar Image URL</label>
                    <input
                      type="text"
                      value={t.avatar}
                      onChange={(e) => handleTestimonialChange(idx, 'avatar', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: TRUSTED BRANDS */}
      {activeSection === 'BRANDS' && (
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
            Trusted By Leading Teams
          </h3>
          <p className="text-xs text-outline">
            Comma-separated company names displayed in the brand social proof ribbon.
          </p>
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Brand Names
            </label>
            <input
              type="text"
              value={brandsString}
              onChange={(e) => setBrandsString(e.target.value)}
              placeholder="e.g. Microsoft, Airbnb, Automattic, Bissell, GoDaddy"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>
      )}

      {/* SECTION 5: BOTTOM CTAS */}
      {activeSection === 'BOTTOM_CTA' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-on-surface border-b border-outline-variant pb-2">
              For Clients Card (Dark Teal Card)
            </h3>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Headline</label>
              <input
                type="text"
                value={clientCtaTitle}
                onChange={(e) => setClientCtaTitle(e.target.value)}
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
              For Talent Card (Light Card)
            </h3>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">Headline</label>
              <input
                type="text"
                value={talentCtaTitle}
                onChange={(e) => setTalentCtaTitle(e.target.value)}
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
