import type { Metadata } from 'next';
import { Suspense } from 'react';
import { VerifyEmailView } from '@/features/auth/components/VerifyEmailView';

export const metadata: Metadata = {
  title: 'Verify Email | Banglance',
  description: 'Verify your account to activate full escrow protection, job bidding, and payouts.',
};

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12">
      <Suspense
        fallback={
          <div className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/50 p-8 shadow-xl text-center">
            <div className="animate-pulse text-sm text-on-surface-variant">Loading verification...</div>
          </div>
        }
      >
        <VerifyEmailView />
      </Suspense>
    </div>
  );
}
