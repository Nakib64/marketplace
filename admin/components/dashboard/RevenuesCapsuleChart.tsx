'use client';

import React, { useState } from 'react';

export interface RevenueDayData {
  day: number | string;
  revenue: number; // blue portion
  expenses: number; // green portion
}

const DEFAULT_DAYS: RevenueDayData[] = [
  { day: 1, revenue: 1100, expenses: 400 },
  { day: 3, revenue: 800, expenses: 0 },
  { day: 5, revenue: 650, expenses: 0 },
  { day: 7, revenue: 350, expenses: 0 },
  { day: 9, revenue: 1050, expenses: 0 },
  { day: 11, revenue: 750, expenses: 250 },
  { day: 13, revenue: 1000, expenses: 300 },
  { day: 15, revenue: 1400, expenses: 250 },
  { day: 17, revenue: 900, expenses: 350 },
  { day: 19, revenue: 850, expenses: 0 },
  { day: 21, revenue: 1050, expenses: 450 },
  { day: 23, revenue: 1450, expenses: 500 },
  { day: 25, revenue: 1150, expenses: 300 },
  { day: 27, revenue: 1350, expenses: 250 },
  { day: 29, revenue: 700, expenses: 350 },
];

export function RevenuesCapsuleChart({
  data = DEFAULT_DAYS,
  currency = '৳',
}: {
  data?: RevenueDayData[];
  currency?: string;
}) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const displayData = data.length > 0 ? data : DEFAULT_DAYS;

  // Compute dynamic scale
  const rawMax = Math.max(...displayData.map((d) => d.revenue + d.expenses), 100);
  // Round up to clean ceiling
  const magnitude = Math.pow(10, Math.floor(Math.log10(rawMax)));
  const maxVal = Math.max(Math.ceil(rawMax / magnitude) * magnitude, 1000);

  const chartHeight = 160;
  const chartWidth = 560;
  const barWidth = 7;
  const stepX = chartWidth / Math.max(displayData.length - 1, 1);

  const formatShort = (val: number) => {
    if (val >= 1000000) return `${currency}${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `${currency}${(val / 1000).toFixed(0)}k`;
    return `${currency}${val}`;
  };

  return (
    <div className="relative w-full overflow-hidden select-none">
      {/* Tooltip */}
      {hoveredIdx !== null && displayData[hoveredIdx] && (
        <div
          className="absolute z-20 pointer-events-none -top-1 px-3 py-1.5 rounded-lg bg-[#111827] text-white text-[11px] font-bold shadow-lg -translate-x-1/2 transition-all flex items-center gap-2"
          style={{
            left: `${40 + (hoveredIdx / Math.max(displayData.length - 1, 1)) * (chartWidth - 20)}px`,
          }}
        >
          <span className="text-white/70">{displayData[hoveredIdx].day}:</span>
          <span className="text-[#60a5fa]">
            Inflow: {currency}
            {displayData[hoveredIdx].revenue.toLocaleString()}
          </span>
          <span className="text-[#a3e635]">
            Fees: {currency}
            {displayData[hoveredIdx].expenses.toLocaleString()}
          </span>
        </div>
      )}

      <div className="flex">
        {/* Y Axis Labels */}
        <div className="w-12 flex flex-col justify-between text-[11px] text-[#9ca3af] font-medium h-[160px] pb-5 select-none pr-2 text-right">
          <span>{formatShort(maxVal)}</span>
          <span>{formatShort(Math.round(maxVal * 0.75))}</span>
          <span>{formatShort(Math.round(maxVal * 0.5))}</span>
          <span>{formatShort(Math.round(maxVal * 0.25))}</span>
          <span>0</span>
        </div>

        {/* SVG Chart Area */}
        <div className="flex-1">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`}
            className="w-full h-[190px] overflow-visible"
          >
            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => (
              <line
                key={i}
                x1="0"
                y1={chartHeight * ratio}
                x2={chartWidth}
                y2={chartHeight * ratio}
                stroke="#f3f4f6"
                strokeDasharray="2 2"
                strokeWidth="1"
              />
            ))}

            {/* Capsule Bars */}
            {displayData.map((item, idx) => {
              const cx = idx * stepX;
              const revHeight = maxVal > 0 ? (item.revenue / maxVal) * chartHeight : 0;
              const expHeight = maxVal > 0 ? (item.expenses / maxVal) * chartHeight : 0;

              const revY = chartHeight - revHeight;
              const expY = revY - expHeight - (item.expenses > 0 ? 3 : 0);

              const isHovered = hoveredIdx === idx;

              return (
                <g
                  key={idx}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                  className="cursor-pointer"
                >
                  {/* Invisible Hit Area */}
                  <rect
                    x={cx - barWidth * 2}
                    y="0"
                    width={barWidth * 4}
                    height={chartHeight + 25}
                    fill="transparent"
                  />

                  {/* Revenue Capsule (Blue) */}
                  <rect
                    x={cx - barWidth / 2}
                    y={revY}
                    width={barWidth}
                    height={Math.max(revHeight, barWidth)}
                    rx={barWidth / 2}
                    fill={isHovered ? '#3b82f6' : '#7ea6f6'}
                    className="transition-colors duration-150"
                  />

                  {/* Expense / Fee Capsule (Lime Green) */}
                  {item.expenses > 0 && (
                    <rect
                      x={cx - barWidth / 2}
                      y={expY}
                      width={barWidth}
                      height={Math.max(expHeight, barWidth)}
                      rx={barWidth / 2}
                      fill={isHovered ? '#84cc16' : '#a3e635'}
                      className="transition-colors duration-150"
                    />
                  )}

                  {/* X Axis Day Label */}
                  <text
                    x={cx}
                    y={chartHeight + 20}
                    textAnchor="middle"
                    fill={isHovered ? '#111827' : '#9ca3af'}
                    className="text-[11px] font-medium"
                    style={{ fontFamily: 'var(--font-montserrat)' }}
                  >
                    {item.day}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}
