'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck, Zap, CheckCircle2, Percent } from 'lucide-react';

export function HeroSection() {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'talent' | 'jobs'>('talent');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);

    if (searchMode === 'talent') {
      router.push(`/freelancers?${params.toString()}`);
    } else {
      router.push(`/jobs?${params.toString()}`);
    }
  };

  return (
    <section className="relative w-full overflow-hidden pt-12 pb-16 px-4 md:px-8">
      {/* Top Ambient Glow Halo from Stitch */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-b from-primary/10 via-primary-container/5 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-[1280px] mx-auto flex flex-col items-center text-center">
        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-surface-container-high border border-outline-variant/40 shadow-sm mb-6">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-mono text-primary uppercase tracking-wider font-semibold">
            Marketplace Live
          </span>
          <span className="text-outline">/</span>
          <span className="text-xs text-on-surface-variant">0% Chargeback Risk Escrow</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold max-w-4xl text-on-surface tracking-tight mb-4">
          Where Top Talent Meets <span className="text-primary">Secured Trust</span> &amp; Instant Escrow
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base md:text-lg text-on-surface-variant max-w-2xl mb-8 leading-relaxed">
          Hire verified software engineers, UI/UX designers, and specialists with 100% escrow payment protection and automated mobile payouts.
        </p>

        {/* Pill Toggle: Find Talent / Find Work */}
        <div className="inline-flex p-1 rounded-full bg-surface-container-lowest shadow-inner mb-6 border border-outline-variant/30">
          <button
            type="button"
            onClick={() => setSearchMode('talent')}
            className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
              searchMode === 'talent'
                ? 'bg-surface-container-high text-on-surface shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Find Talent
          </button>
          <button
            type="button"
            onClick={() => setSearchMode('jobs')}
            className={`px-6 py-2 rounded-full text-xs font-semibold transition-all ${
              searchMode === 'jobs'
                ? 'bg-surface-container-high text-on-surface shadow-sm font-bold'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Find Work
          </button>
        </div>

        {/* Integrated Search Bar */}
        <form
          onSubmit={handleSearch}
          className="w-full max-w-3xl bg-surface-container p-2.5 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-2 mb-8 border border-outline-variant/50"
        >
          <div className="flex items-center gap-2 flex-1 px-3 w-full">
            <Search className="text-primary w-5 h-5 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                searchMode === 'talent'
                  ? 'Fullstack Developer, Figma Designer, NestJS Architect...'
                  : 'Search fixed bounties, hourly contracts, mobile apps...'
              }
              className="w-full bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none py-1.5"
            />
          </div>

          <div className="h-6 w-[1px] bg-outline-variant/40 hidden md:block" />

          <div className="flex items-center px-3 w-full md:w-auto">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-transparent text-xs text-on-surface-variant focus:outline-none py-1.5 cursor-pointer pr-4 w-full"
            >
              <option value="all" className="bg-surface-container text-on-surface">All Categories</option>
              <option value="development" className="bg-surface-container text-on-surface">Development &amp; Tech</option>
              <option value="design" className="bg-surface-container text-on-surface">UI/UX &amp; Design</option>
              <option value="fullstack" className="bg-surface-container text-on-surface">Fullstack &amp; Mobile</option>
              <option value="security" className="bg-surface-container text-on-surface">Security &amp; Audit</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-3 rounded-xl bg-primary text-surface font-semibold text-xs hover:bg-tertiary transition-all duration-200 active:scale-[0.98] flex items-center justify-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            <span>{searchMode === 'talent' ? 'Search Talent' : 'Search Projects'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Trust Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-on-surface-variant font-mono">
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/30">
            <ShieldCheck className="text-primary w-4 h-4" />
            <span>SSLCommerz Escrow Vault</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/30">
            <Zap className="text-primary w-4 h-4" />
            <span>bKash &amp; Nagad Payouts</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/30">
            <CheckCircle2 className="text-secondary w-4 h-4" />
            <span>Verified Talent Dossiers</span>
          </div>
          <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/30">
            <Percent className="text-primary-container w-4 h-4" />
            <span>Double-Blind Reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
