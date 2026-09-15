import { Metadata } from 'next';
import { ClientDashboardView } from '@/features/client/components/ClientDashboardView';

export const metadata: Metadata = {
  title: 'Client Portal & Active Jobs | Banglance',
  description:
    'Manage active jobs, inspect deliverables, review proposals, and approve milestone payments.',
  keywords: ['client dashboard', 'posted jobs', 'protected payments', 'freelance proposals'],
};

export default function ClientJobsPage() {
  return <ClientDashboardView />;
}
