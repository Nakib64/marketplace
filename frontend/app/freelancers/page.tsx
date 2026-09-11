import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TalentDirectoryView } from '@/features/talent/components/TalentDirectoryView';

export const metadata: Metadata = {
  title: 'Hire Verified Freelancers & Web3 Developers | Banglance',
  description:
    'Discover top-tier freelance engineers, smart contract auditors, and designers with verifiable escrow track records on Banglance.',
};

export default function FreelancersPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Suspense
        fallback={
          <div className="max-w-[1280px] w-full mx-auto px-4 py-12 flex items-center justify-center text-sm text-on-surface-variant font-mono">
            Loading verified talent directory...
          </div>
        }
      >
        <TalentDirectoryView />
      </Suspense>
    </main>
  );
}
