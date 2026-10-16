'use client';

import React, { useState } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
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
      {/* Upwork Clean Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-full p-2 flex flex-col md:flex-row items-stretch md:items-center gap-2 border border-[#e4ebe4] shadow-xs focus-within:border-[#14a800]"
      >
        <div className="flex items-center flex-1 px-4 py-1.5 gap-2.5">
          <Search className="w-4 h-4 text-[#5e6d55] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for jobs (e.g. Next.js, React, Python, UI/UX design)..."
            className="bg-transparent text-sm text-[#001e00] placeholder:text-[#5e6d55] focus:outline-none w-full"
          />
        </div>

        <div className="md:w-56 px-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-[#f2f7f2] text-[#001e00] px-4 py-2 rounded-full text-xs font-medium focus:outline-none cursor-pointer border border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="development">Development &amp; IT</option>
            <option value="design">Design &amp; Creative</option>
            <option value="mobile">Mobile Apps</option>
            <option value="security">Security &amp; Audit</option>
          </select>
        </div>

        <button
          type="submit"
          className="bg-[#14a800] hover:bg-[#108a00] text-white font-medium text-xs px-6 py-2.5 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer shrink-0"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Quick Filters & Sort Bar */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-[#5e6d55] font-semibold pl-1">FILTER:</span>
          <span className="px-3 py-1 rounded-full bg-[#f2f7f2] text-[#14a800] font-semibold border border-[#14a800]/20 flex items-center gap-1.5 cursor-pointer">
            <span className="w-1.5 h-1.5 rounded-full bg-[#14a800]" />
            Payment Protected
          </span>
          <span className="px-3 py-1 rounded-full bg-white text-[#5e6d55] border border-[#e4ebe4] hover:bg-[#f2f7f2] transition-colors cursor-pointer">
            Payment Verified
          </span>
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-1.5 shrink-0">
          <ArrowUpDown className="w-3.5 h-3.5 text-[#5e6d55]" />
          <select
            value={currentParams.sortBy || 'createdAt'}
            onChange={(e) => onSearch({ sortBy: e.target.value as 'createdAt' | 'budget' })}
            className="bg-white px-3 py-1.5 rounded-full text-[#001e00] text-xs focus:outline-none cursor-pointer border border-[#e4ebe4]"
          >
            <option value="createdAt">Newest</option>
            <option value="budget">Highest Budget</option>
          </select>
        </div>
      </div>
    </div>
  );
}
