'use client';

import React from 'react';
import { FreelancerIdentityBanner } from './FreelancerIdentityBanner';
import { FreelancerKpiGrid } from './FreelancerKpiGrid';
import { FreelancerActiveContracts } from './FreelancerActiveContracts';
import { FreelancerSmartWalletCard } from './FreelancerSmartWalletCard';
import { FreelancerLedgerActivity } from './FreelancerLedgerActivity';
import { FreelancerDecentralizedIdCard } from './FreelancerDecentralizedIdCard';

export const FreelancerDashboardView: React.FC = () => {
  return (
    <div className="w-full bg-background min-h-screen py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
        {/* Top Banner */}
        <FreelancerIdentityBanner />

        {/* 4-Column Protocol KPI Grid */}
        <FreelancerKpiGrid />

        {/* Asymmetrical 65% / 35% Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Left Column (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <FreelancerActiveContracts />
          </div>

          {/* Right Sidebar Column (4 Cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
            <FreelancerSmartWalletCard />
            <FreelancerLedgerActivity />
            <FreelancerDecentralizedIdCard />
          </div>
        </div>
      </div>
    </div>
  );
};
