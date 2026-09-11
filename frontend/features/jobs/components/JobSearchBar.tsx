'use client';

import React, { useState } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { JobSearchParams } from '../types/jobsTypes';

interface JobSearchBarProps {
  currentParams: JobSearchParams;
  onSearch: (filters: Partial<JobSearchParams>) => void;
}

export function JobSearchBar({ currentParams, onSearch }: JobSearchBarProps) {
  const [query, setQuery] = useState(currentParams.q || '');
  const [category, setCategory] = useState(currentParams.category || 'all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      q: query || undefined,
      category: category === 'all' ? undefined : category,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Omnisearch Bar Composite */}
      <form
        onSubmit={handleSubmit}
        className="bg-surface-container rounded-2xl p-2 sm:p-2.5 flex flex-col lg:flex-row items-stretch lg:items-center gap-2 border border-outline-variant/40 shadow-md"
      >
        <div className="flex items-center flex-1 bg-surface-container-low rounded-xl px-3.5 py-2 gap-2.5">
          <Search className="w-4 h-4 text-outline shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects, skills (Next.js, NestJS, Figma, Rust, AI)..."
            className="bg-transparent text-sm text-on-surface placeholder:text-outline focus:outline-none w-full"
          />
        </div>

        <div className="min-w-[200px]">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-surface-container-low text-on-surface px-3.5 py-2.5 rounded-xl text-xs font-medium focus:outline-none cursor-pointer border border-transparent hover:border-outline-variant/50"
          >
            <option value="all" className="bg-surface-container text-on-surface">All Categories</option>
            <option value="development" className="bg-surface-container text-on-surface">Fullstack &amp; Backend</option>
            <option value="design" className="bg-surface-container text-on-surface">UI/UX &amp; Design</option>
            <option value="mobile" className="bg-surface-container text-on-surface">Mobile Apps</option>
            <option value="security" className="bg-surface-container text-on-surface">Security &amp; Audit</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-primary hover:bg-primary-container text-surface font-semibold text-xs px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Search Jobs</span>
        </button>
      </form>

      {/* Quick Filters & Sort Bar */}
      <div className="flex items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-outline uppercase text-[11px] font-semibold pl-1">QUICK:</span>
          <span className="px-3 py-1 rounded-full bg-surface-container-high text-primary font-semibold border border-primary/20 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            100% Escrow Funded
          </span>
          <span className="px-3 py-1 rounded-full bg-surface-container text-on-surface-variant border border-outline-variant/30">
            Payment Verified
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-outline" />
          <select
            value={currentParams.sortBy || 'createdAt'}
            onChange={(e) => onSearch({ sortBy: e.target.value as 'createdAt' | 'budget' })}
            className="bg-surface-container px-2.5 py-1 rounded-lg text-on-surface text-xs focus:outline-none cursor-pointer border border-outline-variant/40"
          >
            <option value="createdAt">Newest First</option>
            <option value="budget">Highest Budget</option>
          </select>
        </div>
      </div>
    </div>
  );
}
