'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { ClientDashboardBanner } from './ClientDashboardBanner';
import { ClientKpiGrid } from './ClientKpiGrid';
import { ClientPendingDeliverables } from './ClientPendingDeliverables';
import { ClientActiveJobsList } from './ClientActiveJobsList';
import { ClientVaultHealthWidget } from './ClientVaultHealthWidget';
import { ClientSettlementLedger } from './ClientSettlementLedger';
import { ClientReputationCard } from './ClientReputationCard';

export const ClientDashboardView: React.FC = () => {
  const { data: myJobs = [], isLoading } = useQuery({
    queryKey: ['my-jobs'],
    queryFn: () => jobsApi.getMyJobs(),
    staleTime: 30_000,
  });

  return (
    <div className="w-full bg-background min-h-screen py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
        {/* Top Banner */}
        <ClientDashboardBanner />

        {/* 4-Column Protocol KPI Cards */}
        <ClientKpiGrid />

        {/* Main Content Split Grid (68% Left / 32% Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ClientPendingDeliverables />
            <ClientActiveJobsList jobs={myJobs} isLoading={isLoading} />
          </div>

          {/* Right Column (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
            <ClientVaultHealthWidget />
            <ClientSettlementLedger />
            <ClientReputationCard />
          </div>
        </div>
      </div>
    </div>
  );
};
