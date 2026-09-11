import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { JobSearchView } from '@/features/jobs/components/JobSearchView';

export const metadata: Metadata = {
  title: 'Search Freelance Jobs & Bounties | Banglance',
  description:
    'Explore verified open jobs, software engineering contracts, and design bounties with guaranteed escrow protection and local mobile payouts.',
};

export default function JobsPage() {
  return (
    <div className="w-full min-h-screen bg-surface">
      <Suspense
        fallback={
          <div className="max-w-[1280px] mx-auto px-4 py-8">
            <div className="h-16 w-full rounded-2xl bg-surface-container animate-pulse mb-6" />
            <div className="flex gap-6">
              <div className="w-72 h-96 rounded-2xl bg-surface-container animate-pulse hidden lg:block" />
              <div className="flex-1 space-y-4">
                <div className="h-40 rounded-2xl bg-surface-container animate-pulse" />
                <div className="h-40 rounded-2xl bg-surface-container animate-pulse" />
              </div>
            </div>
          </div>
        }
      >
        <JobSearchView />
      </Suspense>
    </div>
  );
}
