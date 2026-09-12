import type { Metadata } from 'next';
import { VerifyEmailView } from '@/features/auth/components/VerifyEmailView';

export const metadata: Metadata = {
  title: 'Verify Email | Banglance',
  description: 'Verify your account to activate full escrow protection, job bidding, and payouts.',
};

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12">
      <VerifyEmailView />
    </div>
  );
}
