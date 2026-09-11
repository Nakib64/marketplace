'use client';

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface TalentEscrowCalculatorProps {
  hourlyRate?: number | null;
}

export function TalentEscrowCalculator({ hourlyRate = 120 }: TalentEscrowCalculatorProps) {
  const rate = Number(hourlyRate) || 120;
  const [hours, setHours] = useState(40);

  const totalCost = rate * hours;

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
          <Calculator className="w-4 h-4 text-primary" />
          Escrow Estimator
        </h3>
        <span className="text-xs font-mono text-primary bg-surface-container-high px-2 py-0.5 rounded">
          Instant
        </span>
      </div>

      <p className="text-xs text-on-surface-variant">
        Estimate budget required for milestone or sprint agreements
      </p>

      {/* Slider */}
      <div className="flex flex-col gap-2 pt-1">
        <div className="flex justify-between text-xs font-medium">
          <span className="text-on-surface-variant">Estimated Hours</span>
          <span className="font-mono text-on-surface font-bold">{hours} hrs</span>
        </div>

        <input
          type="range"
          min="10"
          max="160"
          step="5"
          value={hours}
          onChange={(e) => setHours(Number(e.target.value))}
          className="w-full accent-primary h-2 bg-surface-container-high rounded-lg cursor-pointer"
        />

        <div className="flex justify-between text-[11px] font-mono text-on-surface-variant">
          <span>10 hrs (Sprint)</span>
          <span>80 hrs</span>
          <span>160 hrs (Month)</span>
        </div>
      </div>

      {/* Calculation Box */}
      <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/20 flex flex-col gap-2 mt-1">
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Hourly Rate:</span>
          <span className="font-mono text-on-surface">{formatCurrency(rate)}</span>
        </div>
        <div className="flex justify-between text-xs text-on-surface-variant">
          <span>Platform Escrow Fee:</span>
          <span className="font-mono text-primary">0% (Zero Fee)</span>
        </div>
        <div className="h-px bg-outline-variant/20 my-0.5" />
        <div className="flex justify-between items-baseline">
          <span className="text-xs font-bold text-on-surface">Escrow Deposit:</span>
          <span className="text-xl font-bold font-mono text-on-surface">
            {formatCurrency(totalCost)}
          </span>
        </div>
      </div>
    </div>
  );
}
