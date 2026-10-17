'use client';

import React from 'react';

export function BrandThemeLogo({ className = 'w-9 h-9' }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Outer bold capsule loop */}
      <path
        d="M30 18C16.7452 18 6 28.7452 6 42V58C6 71.2548 16.7452 82 30 82C37.5 82 44.5 78.5 49 73"
        stroke="#14a800"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Inner curved arched gateway */}
      <path
        d="M49 32V68M49 42C49 31.5 56.5 24 66.5 24C76.5 24 84 31.5 84 42V68"
        stroke="#14a800"
        strokeWidth="10"
        strokeLinecap="round"
      />
      {/* Precision accent dot */}
      <circle cx="94" cy="64" r="5" fill="#14a800" />
    </svg>
  );
}
