import React, { Suspense } from 'react';
import { Metadata } from 'next';
import { TalentDirectoryView } from '@/features/talent/components/TalentDirectoryView';

export const metadata: Metadata = {
  title: 'Hire Verified Freelancers & Developers | Banglance',
  description:
    'Discover top-tier freelance engineers, designers, and specialists with verified track records on Banglance.',
};

export default function FreelancersPage() {
  return (
    <main className="min-h-screen bg-surface">
      <Suspense
        fallback={
          <div className="max-w-[1280px] w-full mx-auto px-4 py-12 flex items-center justify-center text-sm text-on-surface-variant ">
            Loading verified talent directory...
          </div>
        }
      >
        <TalentDirectoryView />
      </Suspense>
    </main>
  );
}
