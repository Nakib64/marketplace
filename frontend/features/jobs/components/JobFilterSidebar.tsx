'use client';

import React, { useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { JobSearchParams } from '../types/jobsTypes';

interface JobFilterSidebarProps {
  currentParams: JobSearchParams;
  onUpdate: (filters: Partial<JobSearchParams>) => void;
  onClear: () => void;
}

export function JobFilterSidebar({ currentParams, onUpdate, onClear }: JobFilterSidebarProps) {
  const [minBudget, setMinBudget] = useState(currentParams.minBudget || '');
  const [maxBudget, setMaxBudget] = useState(currentParams.maxBudget || '');

  const categories = [
    { label: 'Development & IT', slug: 'development', count: '2,110' },
    { label: 'Design & Creative', slug: 'design', count: '890' },
    { label: 'Mobile Applications', slug: 'mobile', count: '1,420' },
    { label: 'AI & Data Science', slug: 'ai', count: '740' },
    { label: 'Security & Audit', slug: 'security', count: '530' },
  ];

  const applyBudget = (min?: number, max?: number) => {
    onUpdate({ minBudget: min, maxBudget: max });
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0 bg-white rounded-2xl p-6 border border-[#e4ebe4] flex flex-col gap-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e4ebe4]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#14a800]" />
          <h3 className="text-sm font-semibold text-[#001e00]">Filter By</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs text-[#14a800] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2.5">
        <span className="text-xs uppercase tracking-wider text-[#5e6d55] font-semibold">
          Category
        </span>
        <div className="flex flex-col gap-2.5 text-xs">
          {categories.map((cat) => {
            const isSelected = currentParams.category === cat.slug;
            return (
              <label
                key={cat.slug}
                onClick={() => onUpdate({ category: isSelected ? undefined : cat.slug })}
                className="flex items-center justify-between cursor-pointer group select-none"
              >
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="accent-[#14a800] w-4 h-4 rounded cursor-pointer"
                  />
                  <span className={`transition-colors ${isSelected ? 'text-[#14a800] font-semibold' : 'text-[#001e00] group-hover:text-[#14a800]'}`}>
                    {cat.label}
                  </span>
                </div>
                <span className="text-xs text-[#5e6d55]">{cat.count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Budget Range */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#e4ebe4]">
        <div className="flex items-center justify-between text-xs">
          <span className="uppercase text-xs text-[#5e6d55] font-semibold">Budget Range</span>
          <span className="text-[#14a800] font-semibold">BDT (৳)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center bg-[#f2f7f2] px-3 py-2 rounded-xl border border-[#e4ebe4]">
            <span className="text-xs text-[#5e6d55] mr-1">৳</span>
            <input
              type="number"
              placeholder="Min"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              onBlur={() => onUpdate({ minBudget: minBudget ? Number(minBudget) : undefined })}
              className="bg-transparent text-xs text-[#001e00] w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center bg-[#f2f7f2] px-3 py-2 rounded-xl border border-[#e4ebe4]">
            <span className="text-xs text-[#5e6d55] mr-1">৳</span>
            <input
              type="number"
              placeholder="Max"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              onBlur={() => onUpdate({ maxBudget: maxBudget ? Number(maxBudget) : undefined })}
              className="bg-transparent text-xs text-[#001e00] w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Quick Budget Brackets */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {[
            { label: '৳5k-৳20k', min: 5000, max: 20000 },
            { label: '৳20k-৳50k', min: 20000, max: 50000 },
            { label: '৳50k-৳150k', min: 50000, max: 150000 },
            { label: '৳150k+', min: 150000, max: undefined },
          ].map((b) => (
            <button
              key={b.label}
              type="button"
              onClick={() => applyBudget(b.min, b.max)}
              className="text-xs px-2.5 py-1 bg-[#f2f7f2] hover:bg-[#e4ebe4] rounded-full text-[#001e00] transition-colors cursor-pointer"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
