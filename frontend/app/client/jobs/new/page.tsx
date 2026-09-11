import React from 'react';
import { Metadata } from 'next';
import { PostJobHeader } from '@/features/jobs/components/PostJobHeader';
import { PostJobWizard } from '@/features/jobs/components/PostJobWizard';

export const metadata: Metadata = {
  title: 'Post a Web3 Project RFP | Banglance Client Workspace',
  description:
    'Define project requirements, set autonomous milestone escrow, and hire pre-vetted engineers on Banglance.',
};

export default function PostJobPage() {
  return (
    <main className="min-h-screen bg-surface">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex flex-col gap-8">
        <PostJobHeader />
        <PostJobWizard />
      </div>
    </main>
  );
}
