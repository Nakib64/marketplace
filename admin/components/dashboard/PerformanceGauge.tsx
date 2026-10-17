'use client';

import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

export interface PerformanceGoal {
  label: string;
  completed: boolean;
  color: string;
}

export function PerformanceGauge({
  percentage = 88,
  subtitle = 'Success',
  goals,
}: {
  percentage?: number;
  subtitle?: string;
  goals?: PerformanceGoal[];
}) {
  const displayGoals: PerformanceGoal[] =
    goals && goals.length > 0
      ? goals
      : [
          { label: 'Moderate open bids (2/3)', completed: false, color: '#f59e0b' },
          { label: 'Audit funded contracts (2/2)', completed: true, color: '#3b82f6' },
          { label: 'Reconcile vault solvency (1/1)', completed: true, color: '#84cc16' },
        ];

  return (
    <div className="flex flex-col items-center justify-between h-full space-y-4">
      {/* SVG Semi-Circle Donut Gauge */}
      <div className="relative w-full max-w-[240px] flex items-center justify-center pt-2">
        <svg viewBox="0 0 200 125" className="w-full overflow-visible">
          {/* Background Track */}
          <path
            d="M 25 105 A 75 75 0 0 1 175 105"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Segment 1: Lime Green (Left) */}
          <path
            d="M 25 105 A 75 75 0 0 1 54 52"
            fill="none"
            stroke="#84cc16"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Segment 2: Vibrant Blue (Top/Center) */}
          <path
            d="M 64 42 A 75 75 0 0 1 136 42"
            fill="none"
            stroke="#3b82f6"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Segment 3: Warm Amber/Orange (Right) */}
          <path
            d="M 146 52 A 75 75 0 0 1 175 105"
            fill="none"
            stroke="#f59e0b"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Center Score & Subtitle */}
          <text
            x="100"
            y="85"
            textAnchor="middle"
            className="text-[28px] font-black fill-[#111827]"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {percentage}%
          </text>
          <text
            x="100"
            y="105"
            textAnchor="middle"
            className="text-[12px] font-medium fill-[#64748b]"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {subtitle}
          </text>
        </svg>
      </div>

      {/* Progress Checklist matching screenshot */}
      <div className="w-full space-y-2.5 pt-2 border-t border-[#f1f3f5] text-xs">
        {displayGoals.map((g, idx) => (
          <div key={idx} className="flex items-center justify-between text-[#374151]">
            <div className="flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: g.color }}
              />
              <span className="font-semibold text-on-surface truncate">{g.label}</span>
            </div>
            {g.completed ? (
              <CheckCircle2 className="h-4 w-4 text-[#16a34a] shrink-0" />
            ) : (
              <Circle className="h-4 w-4 text-[#9ca3af] shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
