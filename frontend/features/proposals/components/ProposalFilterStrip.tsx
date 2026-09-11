'use client';

import React from 'react';

interface ProposalFilterStripProps {
  search: string;
  onSearchChange: (value: string) => void;
  seniority: string;
  onSeniorityChange: (val: string) => void;
  hasCertikFilter: boolean;
  onToggleCertik: () => void;
}

export const ProposalFilterStrip: React.FC<ProposalFilterStripProps> = ({
  search,
  onSearchChange,
  seniority,
  onSeniorityChange,
  hasCertikFilter,
  onToggleCertik,
}) => {
  return (
    <div className="bg-surface-container border border-outline-variant/30 p-2.5 rounded-xl mb-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 shadow-sm">
      <div className="flex flex-1 items-center gap-3">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">
            search
          </span>
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-surface-container-low pl-10 pr-4 py-2 text-on-surface placeholder:text-on-surface-variant rounded-lg text-xs font-mono border border-outline-variant/30 focus:outline-none focus:border-primary transition-colors"
            placeholder="Search candidate by ENS, address, or SBT ID..."
            type="text"
          />
        </div>

        {/* Filter Segment Controls */}
        <div className="hidden sm:flex items-center gap-1 bg-surface-container-low p-1 rounded-lg border border-outline-variant/30">
          {[
            { id: 'ALL', label: 'All Seniority' },
            { id: 'SPECIALIST', label: 'Specialist (8)' },
            { id: 'CORE', label: 'Core (3)' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onSeniorityChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                seniority === item.id
                  ? 'bg-surface-container-high text-on-surface'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Right Alignment Sort & Criteria */}
      <div className="flex items-center gap-2.5 justify-between lg:justify-end">
        {hasCertikFilter && (
          <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg text-xs">
            <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
            <span className="text-on-surface">CertiK &gt;90</span>
            <button
              type="button"
              onClick={onToggleCertik}
              className="text-on-surface-variant hover:text-on-surface flex items-center ml-1"
            >
              <span className="material-symbols-outlined text-[14px]">close</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-1.5 bg-surface-container-low border border-outline-variant/30 px-3 py-1 rounded-lg text-xs">
          <span className="text-on-surface-variant">Sort:</span>
          <button type="button" className="flex items-center gap-1 text-on-surface font-medium py-1">
            <span>Algorithmic Fit Rank</span>
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">keyboard_arrow_down</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => alert('Filter drawer toggle')}
          className="p-2 rounded-lg bg-surface-container-low border border-outline-variant/30 text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">tune</span>
        </button>
      </div>
    </div>
  );
};
