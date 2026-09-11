import { Metadata } from 'next';
import { FreelancerDashboardView } from '@/features/freelancer/components/FreelancerDashboardView';

export const metadata: Metadata = {
  title: 'Freelancer Workspace & Active Escrows | Banglance',
  description:
    'Manage your active contracts, submit code deliverables, inspect smart wallet earnings, and monitor Soulbound verifiable credentials.',
  keywords: ['freelancer dashboard', 'active contracts', 'escrow payout', 'verifiable credentials', 'web3 freelance'],
};

export default function FreelancerDashboardPage() {
  return <FreelancerDashboardView />;
}
