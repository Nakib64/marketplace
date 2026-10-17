import type { Metadata } from 'next';
import { FreelancersDirectoryTable } from '@/components/users/FreelancersDirectoryTable';
import { UserCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Freelancers Governance | Banglance Admin',
  description: 'Manage freelancer technical credentials, hourly rates, performance ratings, and payouts.',
};

export default function AdminFreelancersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Freelancer Profiles &amp; Governance</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Review technical specializations, hourly rates, project history, ratings, and wallet balances.
          </p>
        </div>
      </div>

      <FreelancersDirectoryTable />
    </div>
  );
}
