'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShieldCheck, Star, Sparkles, ChevronRight } from 'lucide-react';
import { FreelancerSearchParams } from '../types/talentTypes';

interface TalentSearchBarProps {
  currentParams: FreelancerSearchParams;
  onSearch: (params: Partial<FreelancerSearchParams>) => void;
}

export function TalentSearchBar({ currentParams, onSearch }: TalentSearchBarProps) {
  const [query, setQuery] = useState(currentParams.q || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ q: query.trim() || undefined });
  };

  const handleQuickPill = (skillTag: string) => {
    onSearch({ skills: skillTag });
  };

  return (
    <section className="w-full flex flex-col gap-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant">
        <Link href="/" className="hover:text-on-surface transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-outline-variant shrink-0" />
        <span className="text-on-surface font-semibold">Find Talent</span>
        <ChevronRight className="w-3.5 h-3.5 text-outline-variant shrink-0" />
        <span className="text-on-surface font-medium">Verified Freelancers</span>
      </nav>

      {/* Omnisearch Bar Composite */}
      <form
        onSubmit={handleSubmit}
        className="p-1.5 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-lg flex flex-col sm:flex-row items-center gap-2"
      >
        <div className="flex-1 flex items-center gap-2 px-3 w-full">
          <Search className="w-5 h-5 text-on-surface-variant shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search talent by skill, specialty, or keywords (e.g. Solidity, Fullstack, Rust, UI/UX)..."
            className="w-full bg-transparent border-none outline-none text-sm text-on-surface placeholder:text-on-surface-variant py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-surface-container-high border border-outline-variant/40 hover:border-primary/50 text-on-surface hover:text-primary text-xs font-semibold transition-all shadow-sm shrink-0 cursor-pointer"
        >
          <Search className="w-4 h-4 text-primary" />
          <span>Find Talent</span>
        </button>
      </form>

      {/* Quick Filter Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <button
          onClick={() => handleQuickPill('Solidity')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-primary/30 text-primary text-xs font-semibold shrink-0 hover:bg-surface-container-high transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Solidity &amp; Smart Contracts</span>
        </button>

        <button
          onClick={() => handleQuickPill('Fullstack')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface text-xs font-medium shrink-0 hover:border-primary/30 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <span>Fullstack Web3</span>
        </button>

        <button
          onClick={() => handleQuickPill('UI/UX')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface text-xs font-medium shrink-0 hover:border-primary/30 transition-colors"
        >
          <Star className="w-3.5 h-3.5 text-primary" />
          <span>UI/UX &amp; Product Design</span>
        </button>

        <button
          onClick={() => handleQuickPill('Rust')}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-surface-container border border-outline-variant/40 text-on-surface-variant hover:text-on-surface text-xs font-medium shrink-0 hover:border-primary/30 transition-colors"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Security &amp; Rust Auditing</span>
        </button>
      </div>
    </section>
  );
}
