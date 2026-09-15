import { Metadata } from 'next';
import { FreelancerDashboardView } from '@/features/freelancer/components/FreelancerDashboardView';

export const metadata: Metadata = {
  title: 'Freelancer Workspace & Active Contracts | Banglance',
  description:
    'Manage your active contracts, submit deliverables, inspect wallet earnings, and monitor verified credentials.',
  keywords: ['freelancer dashboard', 'active contracts', 'payment payout', 'verified credentials', 'freelance'],
};

export default function FreelancerDashboardPage() {
  return <FreelancerDashboardView />;
}
