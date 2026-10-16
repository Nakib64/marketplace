'use client';

import React from 'react';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FreelancerSearchParams } from '../types/talentTypes';

interface TalentFilterSidebarProps {
  currentParams: FreelancerSearchParams;
  onFilterChange: (params: Partial<FreelancerSearchParams>) => void;
  onReset: () => void;
}

const RATE_BRACKETS = [
  { label: '< ৳500', min: undefined, max: 500 },
  { label: '৳500 - ৳1,500', min: 500, max: 1500 },
  { label: '৳1,500 - ৳3,000', min: 1500, max: 3000 },
  { label: '৳3,000+', min: 3000, max: undefined },
];

const SPECIALIZATIONS = [
  'Fullstack Web',
  'UI/UX Design',
  'Mobile Apps',
  'Backend & APIs',
  'AI & Data',
  'Cybersecurity',
];

export function TalentFilterSidebar({
  currentParams,
  onFilterChange,
  onReset,
}: TalentFilterSidebarProps) {
  const currentSkill = currentParams.skills || '';
  const currentMin = currentParams.minRate;
  const currentMax = currentParams.maxRate;

  return (
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 p-6 rounded-2xl bg-white border border-[#e4ebe4] shadow-xs sticky top-28">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#e4ebe4]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#14a800]" />
          <h3 className="text-sm font-semibold text-[#001e00]">Filter Talent</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-[#14a800] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Specialization List */}
      <div className="flex flex-col gap-2.5">
        <label className="text-xs font-semibold text-[#5e6d55] uppercase tracking-wider">
          Specialization
        </label>
        <div className="space-y-1">
          {SPECIALIZATIONS.map((spec) => {
            const isSelected = currentSkill === spec;
            return (
              <button
                key={spec}
                onClick={() => onFilterChange({ skills: isSelected ? undefined : spec })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-[#f2f7f2] text-[#14a800] font-semibold'
                    : 'text-[#001e00] hover:bg-[#f2f7f2]'
                }`}
              >
                <span>{spec}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hourly Rate (BDT/hr) */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#e4ebe4]">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-[#5e6d55] uppercase tracking-wider">
            Hourly Rate
          </label>
          <span className="text-xs text-[#14a800] font-semibold">
            {currentMin || currentMax
              ? `৳${currentMin || 0} - ৳${currentMax || 5000}+`
              : 'Any rate'}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {RATE_BRACKETS.map((bracket) => {
            const isMatch = currentMin === bracket.min && currentMax === bracket.max;
            return (
              <button
                key={bracket.label}
                onClick={() =>
                  onFilterChange({
                    minRate: isMatch ? undefined : bracket.min,
                    maxRate: isMatch ? undefined : bracket.max,
                  })
                }
                className={`py-2 px-2.5 rounded-full border text-xs text-center transition-colors cursor-pointer ${
                  isMatch
                    ? 'bg-[#14a800] border-[#14a800] text-white font-medium'
                    : 'bg-[#f2f7f2] border-transparent text-[#001e00] hover:bg-[#e4ebe4]'
                }`}
              >
                {bracket.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Verification */}
      <div className="flex flex-col gap-3 pt-3 border-t border-[#e4ebe4]">
        <label className="text-xs font-semibold text-[#5e6d55] uppercase tracking-wider">
          Trust &amp; Reliability
        </label>
        <div className="space-y-2 text-xs text-[#001e00]">
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#14a800] w-4 h-4 rounded cursor-pointer" />
            <span>Identity Verified</span>
          </label>
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-[#14a800] w-4 h-4 rounded cursor-pointer" />
            <span>Top Rated &amp; Rising Talent</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
