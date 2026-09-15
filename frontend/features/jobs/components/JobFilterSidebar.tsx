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
    { label: 'Fullstack & Backend', slug: 'development', count: '2,110' },
    { label: 'UI/UX & Design', slug: 'design', count: '890' },
    { label: 'Mobile Applications', slug: 'mobile', count: '1,420' },
    { label: 'AI & Machine Learning', slug: 'ai', count: '740' },
    { label: 'Cybersecurity & Audit', slug: 'security', count: '530' },
  ];

  const applyBudget = (min?: number, max?: number) => {
    onUpdate({ minBudget: min, maxBudget: max });
  };

  return (
    <aside className="w-full lg:w-[280px] shrink-0 bg-surface-container rounded-2xl p-5 border border-outline-variant/40 flex flex-col gap-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Filter Results</h3>
        </div>
        <button
          onClick={onClear}
          className="text-xs  text-primary hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Clear All</span>
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[11px]  uppercase tracking-wider text-outline font-semibold">
          Category &amp; Domain
        </span>
        <div className="flex flex-col gap-2 text-xs">
          {categories.map((cat) => {
            const isSelected = currentParams.category === cat.slug;
            return (
              <label
                key={cat.slug}
                onClick={() => onUpdate({ category: isSelected ? undefined : cat.slug })}
                className="flex items-center justify-between cursor-pointer group py-0.5 select-none"
              >
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    readOnly
                    className="accent-primary w-3.5 h-3.5 rounded"
                  />
                  <span className={`transition-colors ${isSelected ? 'text-primary font-semibold' : 'text-on-surface group-hover:text-primary'}`}>
                    {cat.label}
                  </span>
                </div>
                <span className="text-[11px]  text-outline">{cat.count}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Budget Range */}
      <div className="flex flex-col gap-2.5 pt-2 border-t border-outline-variant/30">
        <div className="flex items-center justify-between text-xs ">
          <span className="uppercase text-[11px] text-outline font-semibold">Budget Range</span>
          <span className="text-primary font-semibold">BDT (৳)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/40">
            <span className="text-xs text-outline  mr-1">৳</span>
            <input
              type="number"
              placeholder="Min"
              value={minBudget}
              onChange={(e) => setMinBudget(e.target.value)}
              onBlur={() => onUpdate({ minBudget: minBudget ? Number(minBudget) : undefined })}
              className="bg-transparent text-xs  text-on-surface w-full focus:outline-none"
            />
          </div>
          <div className="flex items-center bg-surface-container-low px-2.5 py-1.5 rounded-lg border border-outline-variant/40">
            <span className="text-xs text-outline  mr-1">৳</span>
            <input
              type="number"
              placeholder="Max"
              value={maxBudget}
              onChange={(e) => setMaxBudget(e.target.value)}
              onBlur={() => onUpdate({ maxBudget: maxBudget ? Number(maxBudget) : undefined })}
              className="bg-transparent text-xs  text-on-surface w-full focus:outline-none"
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
              className="text-[11px]  px-2.5 py-1 bg-surface-container-low hover:bg-surface-container-high rounded-lg text-on-surface-variant hover:text-primary transition-colors border border-outline-variant/30 cursor-pointer"
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
