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
  { label: '< $50', min: undefined, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $150', min: 100, max: 150 },
  { label: '$150+', min: 150, max: undefined },
];

const SPECIALIZATIONS = [
  'Solidity & EVM',
  'Fullstack Web3',
  'Rust & Solana',
  'UI/UX Design',
  'Smart Contract Audit',
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
    <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6 p-6 rounded-2xl bg-surface-container border border-outline-variant/30 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/30">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Filter Talent</h3>
        </div>
        <button
          onClick={onReset}
          className="text-xs text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Specialization List */}
      <div className="flex flex-col gap-3">
        <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Specialization
        </label>
        <div className="space-y-1.5">
          {SPECIALIZATIONS.map((spec) => {
            const isSelected = currentSkill === spec;
            return (
              <button
                key={spec}
                onClick={() => onFilterChange({ skills: isSelected ? undefined : spec })}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container font-semibold'
                    : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                }`}
              >
                <span>{spec}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Hourly Rate (USDC/hr) */}
      <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/20">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Hourly Rate
          </label>
          <span className="text-xs font-mono text-primary font-semibold">
            {currentMin || currentMax
              ? `$${currentMin || 0} - $${currentMax || 250}+`
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
                className={`py-2 px-2.5 rounded-xl border text-xs font-mono text-center transition-colors cursor-pointer ${
                  isMatch
                    ? 'bg-primary-container border-primary text-on-primary-container font-bold'
                    : 'bg-surface-container-low border-outline-variant/30 text-on-surface-variant hover:border-primary/40 hover:text-on-surface'
                }`}
              >
                {bracket.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Trust & Verification */}
      <div className="flex flex-col gap-3 pt-3 border-t border-outline-variant/20">
        <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Trust &amp; Escrow
        </label>
        <div className="space-y-2 text-xs text-on-surface-variant">
          <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
            <input type="checkbox" defaultChecked className="accent-primary rounded" />
            <span>KYC Verified Only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer hover:text-on-surface">
            <input type="checkbox" defaultChecked className="accent-primary rounded" />
            <span>100% Escrow Completion</span>
          </label>
        </div>
      </div>
    </aside>
  );
}
