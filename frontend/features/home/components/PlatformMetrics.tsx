'use client';

import React from 'react';
import { useHomepageCms } from '../hooks/useHomepageCms';

export function PlatformMetrics() {
  const { data: cms } = useHomepageCms();

  const defaultMetrics = [
    { value: '৳50M+', label: 'Protected Payments', sub: 'Completed projects', color: 'text-primary' },
    { value: '99.4%', label: 'Dispute-Free Rate', sub: 'Successful contracts', color: 'text-secondary' },
    { value: '14,000+', label: 'Verified Pros', sub: 'Technical talent', color: 'text-on-surface' },
    { value: '< 5 min', label: 'Average Payout', sub: 'Instant mobile releases', color: 'text-primary-container' },
  ];

  const metrics =
    cms?.metrics && Array.isArray(cms.metrics) && cms.metrics.length > 0
      ? cms.metrics
      : defaultMetrics;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white border border-[#e4ebe4] shadow-xs mb-20">
      {metrics.map((item, idx) => (
        <div key={`${item.label}-${idx}`} className="flex flex-col items-center text-center p-2">
          <span className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight tabular-nums text-[#001e00]">
            {item.value}
          </span>
          <span className="text-xs font-bold text-[#001e00] uppercase mt-2.5 tracking-wider">
            {item.label}
          </span>
          <span className="text-xs text-[#5e6d55] mt-1 font-normal">
            {item.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
