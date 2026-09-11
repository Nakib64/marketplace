import React from 'react';

export function PlatformMetrics() {
  const metrics = [
    { value: '$48M+', label: 'Escrow Volume', sub: 'Protected settlements', color: 'text-primary' },
    { value: '99.4%', label: 'Dispute-Free Rate', sub: 'Successful contracts', color: 'text-secondary' },
    { value: '14,000+', label: 'Verified Pros', sub: 'Technical talent', color: 'text-on-surface' },
    { value: '< 5 min', label: 'Average Payout', sub: 'Instant mobile releases', color: 'text-primary-container' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-xs mb-16">
      {metrics.map((item) => (
        <div key={item.label} className="flex flex-col items-center text-center p-2">
          <span className={`text-2xl sm:text-3xl md:text-4xl font-bold font-mono tracking-tight ${item.color}`}>
            {item.value}
          </span>
          <span className="text-xs font-semibold text-on-surface uppercase mt-1 tracking-wider">
            {item.label}
          </span>
          <span className="text-[11px] text-on-surface-variant font-mono mt-0.5">
            {item.sub}
          </span>
        </div>
      ))}
    </div>
  );
}
