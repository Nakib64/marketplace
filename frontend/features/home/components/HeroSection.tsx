'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight, ShieldCheck, Zap, CheckCircle2, Percent } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export function HeroSection() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isClient = user?.role === 'CLIENT';

  const [searchMode, setSearchMode] = useState<'talent' | 'jobs'>('talent');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const activeMode = isClient ? 'talent' : searchMode;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query) params.set('q', query);
    if (category !== 'all') params.set('category', category);

    if (activeMode === 'talent') {
      router.push(`/freelancers?${params.toString()}`);
    } else {
      router.push(`/jobs?${params.toString()}`);
    }
  };

  return (
    <section className="relative w-full bg-white pt-8 pb-16 px-4 md:px-8 border-b border-[#e4ebe4]">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center pt-6 pb-12">
          {/* Left Column: Upwork Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] text-xs font-semibold text-[#001e00] mb-6">
              <span className="w-2 h-2 rounded-full bg-[#14a800]" />
              <span className="text-[#14a800] font-bold">Banglance Marketplace</span>
              <span className="text-[#9aaa97]">•</span>
              <span className="text-[#5e6d55]">100% Milestone Protection</span>
            </div>

            {/* Upwork Iconic Editorial Headline */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-[#001e00] tracking-tight leading-[1.08] mb-6 font-normal">
              How work <br className="hidden sm:block" />
              <span className="italic font-normal text-[#14a800]">should work</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-[#5e6d55] max-w-xl leading-relaxed mb-8">
              Forget the old rules. You can have the best software engineers, designers, and specialists. Right now. Right here.
            </p>

            {/* Upwork Dual CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 mb-10 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => router.push('/freelancers')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#14a800] hover:bg-[#108a00] active:bg-[#0d7000] text-white font-semibold text-base transition-colors shadow-xs cursor-pointer text-center"
              >
                Find talent
              </button>
              <button
                type="button"
                onClick={() => router.push('/jobs')}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-transparent border-2 border-[#14a800] text-[#14a800] hover:bg-[#f2f7f2] font-semibold text-base transition-colors cursor-pointer text-center"
              >
                Find work
              </button>
            </div>

            {/* Integrated Upwork Search Pill */}
            <form
              onSubmit={handleSearch}
              className="w-full max-w-xl flex items-center bg-white border border-[#d5e0d5] hover:border-[#14a800] rounded-full p-1.5 shadow-2xs transition-colors"
            >
              <div className="flex items-center gap-2.5 flex-1 px-3">
                <Search className="w-5 h-5 text-[#001e00] shrink-0" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    activeMode === 'talent'
                      ? 'Try "React Engineer", "Figma Designer"...'
                      : 'Try "Mobile App", "NestJS Backend"...'
                  }
                  className="w-full bg-transparent text-sm text-[#001e00] placeholder:text-[#9aaa97] focus:outline-none py-1.5"
                />
              </div>

              <select
                value={activeMode}
                onChange={(e) => setSearchMode(e.target.value as 'talent' | 'jobs')}
                className="hidden sm:block text-xs font-semibold text-[#001e00] bg-[#f2f7f2] border border-[#e4ebe4] rounded-full px-3 py-2 cursor-pointer focus:outline-none mr-1.5"
              >
                <option value="talent">Talent</option>
                <option value="jobs">Projects</option>
              </select>

              <button
                type="submit"
                aria-label="Search"
                className="w-10 h-10 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Column: Upwork Showcase Card with Floating Talent Pills */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl bg-[#f2f7f2] border border-[#e4ebe4] p-8 md:p-10 flex flex-col justify-between overflow-hidden shadow-xs">
              <div className="relative z-10">
                <span className="text-xs uppercase font-bold text-[#14a800] tracking-wider block mb-2">
                  FOR CLIENTS &amp; TALENT
                </span>
                <h3 className="text-3xl font-serif text-[#001e00] font-normal leading-tight mb-4">
                  Up your work game, it’s free
                </h3>
                <p className="text-sm text-[#5e6d55] leading-relaxed mb-6">
                  Access top 1% technical talent in Bangladesh. Hire with 100% financial protection and zero payment clearance delay.
                </p>
              </div>

              {/* Floating Talent Badges (Upwork Style) */}
              <div className="space-y-3 relative z-10 pt-2">
                <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#e4ebe4] shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#13544e] text-white font-bold flex items-center justify-center text-sm">
                      N
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#001e00] flex items-center gap-1.5">
                        Nafis A.
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800]" />
                      </h4>
                      <p className="text-[11px] text-[#5e6d55]">Fullstack Architect • ৳1,500/hr</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#14a800] bg-[#eaf5ea] px-2.5 py-1 rounded-full">
                    ★ 5.0 (140+ jobs)
                  </span>
                </div>

                <div className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-[#e4ebe4] shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#14a800] text-white font-bold flex items-center justify-center text-sm">
                      S
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#001e00] flex items-center gap-1.5">
                        Sadia R.
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#14a800]" />
                      </h4>
                      <p className="text-[11px] text-[#5e6d55]">Product Designer • ৳1,200/hr</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#14a800] bg-[#eaf5ea] px-2.5 py-1 rounded-full">
                    ★ 4.9 (95 jobs)
                  </span>
                </div>
              </div>

              {/* Security Pill */}
              <div className="mt-6 pt-5 border-t border-[#e4ebe4] flex items-center justify-between text-xs text-[#5e6d55]">
                <span className="flex items-center gap-1.5 font-semibold text-[#001e00]">
                  <ShieldCheck className="w-4 h-4 text-[#14a800]" />
                  SSLCommerz Escrow
                </span>
                <span className="flex items-center gap-1 font-semibold text-[#001e00]">
                  <Zap className="w-4 h-4 text-[#14a800]" />
                  bKash / Nagad Instant
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Upwork "Trusted by" Bar */}
        <div className="pt-8 border-t border-[#e4ebe4] flex flex-col md:flex-row items-center gap-6 text-xs text-[#5e6d55]">
          <span className="font-semibold uppercase tracking-wider text-[11px] shrink-0 text-[#9aaa97]">
            Trusted by leading teams
          </span>
          <div className="flex flex-wrap items-center justify-between gap-8 md:gap-12 flex-1 font-bold text-base text-[#9aaa97]">
            <span className="hover:text-[#001e00] transition-colors">Microsoft</span>
            <span className="hover:text-[#001e00] transition-colors">Airbnb</span>
            <span className="hover:text-[#001e00] transition-colors">Automattic</span>
            <span className="hover:text-[#001e00] transition-colors">Bissell</span>
            <span className="hover:text-[#001e00] transition-colors">GoDaddy</span>
          </div>
        </div>
      </div>
    </section>
  );
}
