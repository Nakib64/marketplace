'use client';

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AnalyticsTimeframeFilterProps {
  value: string;
  onChange: (timeframe: string) => void;
  className?: string;
}

const MONTH_OPTIONS = [
  { value: '3m', label: 'Past 3 Months' },
  { value: '6m', label: 'Past 6 Months' },
  { value: '12m', label: 'Past 12 Months (1 Year)' },
  { value: '24m', label: 'Past 24 Months (2 Years)' },
  { value: '36m', label: 'Past 36 Months (3 Years)' },
];

export function AnalyticsTimeframeFilter({
  value,
  onChange,
  className,
}: AnalyticsTimeframeFilterProps) {
  const isCustomMonth = MONTH_OPTIONS.some((opt) => opt.value === value);

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <div className="flex items-center gap-1.5 p-1 bg-surface-container rounded-xl border border-outline-variant/60">
        <button
          type="button"
          onClick={() => onChange('7d')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
            value === '7d'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface hover:text-primary hover:bg-white/80'
          )}
        >
          7 Days
        </button>

        <button
          type="button"
          onClick={() => onChange('30d')}
          className={cn(
            'px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer',
            value === '30d'
              ? 'bg-primary text-white shadow-xs'
              : 'text-on-surface hover:text-primary hover:bg-white/80'
          )}
        >
          1 Month (30D)
        </button>
      </div>

      {/* Dropdown of Months */}
      <div className="relative inline-flex items-center">
        <div className="relative">
          <select
            value={isCustomMonth ? value : ''}
            onChange={(e) => {
              if (e.target.value) {
                onChange(e.target.value);
              }
            }}
            className={cn(
              'appearance-none pl-8 pr-8 py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none focus:border-primary',
              isCustomMonth
                ? 'bg-primary text-white border-primary shadow-xs'
                : 'bg-white text-on-surface border-outline-variant hover:bg-surface-container'
            )}
          >
            <option value="" disabled className="text-on-surface bg-white font-normal">
              Select Months Range...
            </option>
            {MONTH_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value} className="text-on-surface bg-white font-medium">
                {opt.label}
              </option>
            ))}
          </select>
          <Calendar
            className={cn(
              'absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none',
              isCustomMonth ? 'text-white' : 'text-outline'
            )}
          />
          <ChevronDown
            className={cn(
              'absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 pointer-events-none',
              isCustomMonth ? 'text-white' : 'text-outline'
            )}
          />
        </div>
      </div>
    </div>
  );
}
