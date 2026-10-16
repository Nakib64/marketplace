'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ChevronRight } from 'lucide-react';
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
      <nav className="flex items-center gap-1.5 text-xs text-[#5e6d55]">
        <Link href="/" className="hover:text-[#001e00] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#5e6d55] shrink-0" />
        <span className="text-[#001e00] font-medium">Find Talent</span>
        <ChevronRight className="w-3.5 h-3.5 text-[#5e6d55] shrink-0" />
        <span className="text-[#14a800] font-semibold">Verified Freelancers</span>
      </nav>

      {/* Upwork Pill Search Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-1.5 rounded-full bg-white border border-[#e4ebe4] shadow-xs flex flex-col sm:flex-row items-center gap-2 focus-within:border-[#14a800]"
      >
        <div className="flex-1 flex items-center gap-2.5 px-4 w-full">
          <Search className="w-4 h-4 text-[#5e6d55] shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search talent by skills, roles, or keywords (e.g. Fullstack, React, Python, UI/UX)..."
            className="w-full bg-transparent border-none outline-none text-sm text-[#001e00] placeholder:text-[#5e6d55] py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-2.5 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-medium transition-colors shadow-xs shrink-0 cursor-pointer"
        >
          <span>Search</span>
        </button>
      </form>

      {/* Quick Filter Pill Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
        <span className="text-xs text-[#5e6d55] font-semibold pr-1">POPULAR:</span>
        {[
          { label: 'Fullstack Web', tag: 'Fullstack' },
          { label: 'UI/UX Design', tag: 'UI/UX' },
          { label: 'Mobile Apps', tag: 'Mobile' },
          { label: 'Backend & APIs', tag: 'Backend' },
          { label: 'AI & Data', tag: 'AI' },
        ].map((item) => (
          <button
            key={item.tag}
            type="button"
            onClick={() => handleQuickPill(item.tag)}
            className="px-3.5 py-1.5 rounded-full bg-[#f2f7f2] hover:bg-[#e4ebe4] text-[#001e00] text-xs font-medium shrink-0 transition-colors cursor-pointer"
          >
            {item.label}
          </button>
        ))}
      </div>
    </section>
  );
}
