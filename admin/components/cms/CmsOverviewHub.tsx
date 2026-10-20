'use client';

import React from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { adminCmsApi } from '@/lib/api/adminApi';
import { HomepageCmsConfig } from '@/types/adminTypes';
import {
  Globe,
  Sparkles,
  BarChart3,
  MessageSquare,
  BadgeCheck,
  Layers,
  ArrowRight,
  ExternalLink,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { CmsSubNav } from './CmsSubNav';

export function CmsOverviewHub() {
  const { data: cmsData, isLoading, isError } = useQuery<HomepageCmsConfig>({
    queryKey: ['admin-homepage-cms'],
    queryFn: () => adminCmsApi.getHomepage(),
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Homepage CMS &amp; Editorial Hub</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage every section of the Banglance homepage independently with real-time editorial control.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="http://ad-banglance.saasfactry.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-on-surface transition-colors cursor-pointer"
          >
            <span>Preview Live Site</span>
            <ExternalLink className="h-3.5 w-3.5 text-outline" />
          </a>
        </div>
      </div>

      {/* Persistent Section Sub-Navigation */}
      <CmsSubNav />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-20 bg-white rounded-2xl border border-outline-variant shadow-xs">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading CMS sections state...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs font-semibold">
          Failed to load CMS status. Please check your backend connection.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 1. Hero & Showcase */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                  <Sparkles className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#14a800] bg-[#14a800]/10 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Active
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-on-surface">Hero &amp; Showcase</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Headline, status pill, primary &amp; secondary action buttons, and promotional card.
                </p>
              </div>

              <div className="p-3 bg-[#f9faf9] rounded-xl border border-outline-variant/60 space-y-1.5 text-xs">
                <p className="font-bold text-on-surface truncate">
                  {cmsData?.heroTitle || 'How work should work'}
                </p>
                <p className="text-outline text-[11px] truncate">
                  Badge: &ldquo;{cmsData?.heroBadge || 'Milestone Protection'}&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-1 text-[10px] text-primary font-bold">
                  <span>CTA: {cmsData?.heroPrimaryCtaText || 'Find Talent'}</span>
                  <span>&bull;</span>
                  <span>{cmsData?.heroSecondaryCtaText || 'Find Work'}</span>
                </div>
              </div>
            </div>

            <Link
              href="/cms/hero"
              className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-white text-xs font-bold text-on-surface transition-colors cursor-pointer group-hover:bg-primary group-hover:text-white"
            >
              <span>Edit Hero Section</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 2. Platform Metrics */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#14a800] bg-[#14a800]/10 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> {cmsData?.metrics?.length || 0} Metrics
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-on-surface">Platform Metrics</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Key platform volume stats, escrow protection figures, and freelancer ratings.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-[#f9faf9] rounded-xl border border-outline-variant/60 text-xs">
                {(cmsData?.metrics || []).slice(0, 4).map((m, i) => (
                  <div key={i} className="truncate">
                    <span className="block font-black text-primary text-xs">{m.value}</span>
                    <span className="text-[10px] text-outline truncate block">{m.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Link
              href="/cms/metrics"
              className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-white text-xs font-bold text-on-surface transition-colors cursor-pointer group-hover:bg-primary group-hover:text-white"
            >
              <span>Edit Metrics Ribbon</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 3. Customer Stories */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#14a800] bg-[#14a800]/10 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> {cmsData?.testimonials?.length || 0} Stories
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-on-surface">Customer Stories</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Client quotes, client roles, verified badges, and milestone statistics.
                </p>
              </div>

              <div className="p-3 bg-[#f9faf9] rounded-xl border border-outline-variant/60 space-y-1.5 text-xs">
                <p className="font-bold text-on-surface truncate">
                  Latest: {cmsData?.testimonials?.[0]?.author || 'Top Customer'}
                </p>
                <p className="text-outline text-[11px] line-clamp-2 italic">
                  &ldquo;{cmsData?.testimonials?.[0]?.quote || 'Banglance is essential.'}&rdquo;
                </p>
              </div>
            </div>

            <Link
              href="/cms/testimonials"
              className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-white text-xs font-bold text-on-surface transition-colors cursor-pointer group-hover:bg-primary group-hover:text-white"
            >
              <span>Edit Testimonials</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 4. Trusted Brands */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
                  <BadgeCheck className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#14a800] bg-[#14a800]/10 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> {cmsData?.trustedBrands?.length || 0} Brands
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-on-surface">Trusted Brands</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  Enterprise client proof ribbon displayed beneath the hero section.
                </p>
              </div>

              <div className="p-3 bg-[#f9faf9] rounded-xl border border-outline-variant/60 flex flex-wrap gap-1.5 text-xs">
                {(cmsData?.trustedBrands || []).slice(0, 6).map((b, i) => (
                  <span
                    key={i}
                    className="inline-block px-2 py-0.5 rounded-md bg-white border border-outline-variant text-[10px] font-semibold text-on-surface"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/cms/brands"
              className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-white text-xs font-bold text-on-surface transition-colors cursor-pointer group-hover:bg-primary group-hover:text-white"
            >
              <span>Edit Brands Ribbon</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* 5. Bottom Call-to-Actions */}
          <div className="bg-white rounded-2xl border border-outline-variant p-6 shadow-xs flex flex-col justify-between hover:border-primary/50 transition-colors group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
                  <Layers className="h-5 w-5" />
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#14a800] bg-[#14a800]/10 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> 2 Cards
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-on-surface">Bottom CTAs</h3>
                <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">
                  High-intent conversion cards for prospective enterprise clients and talent.
                </p>
              </div>

              <div className="p-3 bg-[#f9faf9] rounded-xl border border-outline-variant/60 space-y-1.5 text-xs">
                <p className="font-bold text-on-surface truncate">
                  Client: {cmsData?.clientCtaTitle || 'Find talent your way'}
                </p>
                <p className="font-bold text-on-surface truncate">
                  Talent: {cmsData?.talentCtaTitle || 'Find great work'}
                </p>
              </div>
            </div>

            <Link
              href="/cms/cta"
              className="mt-6 inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-surface-container hover:bg-primary hover:text-white text-xs font-bold text-on-surface transition-colors cursor-pointer group-hover:bg-primary group-hover:text-white"
            >
              <span>Edit Bottom CTAs</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
