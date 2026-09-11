import { Metadata } from 'next';
import { ClientDashboardView } from '@/features/client/components/ClientDashboardView';

export const metadata: Metadata = {
  title: 'Hirer Portal & Active Postings | Banglance Escrow',
  description:
    'Manage active job RFPs, inspect multisig deliverables, review inbound proposals, and verify on-chain settlement vaults.',
  keywords: ['client dashboard', 'posted jobs', 'escrow vault', 'multisig deliverables', 'freelance proposals'],
};

export default function ClientJobsPage() {
  return <ClientDashboardView />;
}
