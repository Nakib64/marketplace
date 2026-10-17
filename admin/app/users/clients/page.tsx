import type { Metadata } from 'next';
import { ClientsDirectoryTable } from '@/components/users/ClientsDirectoryTable';
import { Building } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Client Governance | Banglance Admin',
  description: 'Manage client accounts, corporate billing profiles, total spend, and job posting metrics.',
};

export default function AdminClientsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Building className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Client &amp; Employer Governance</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Audit employer profiles, total expenditures, hiring ratings, billing verification, and platform status.
          </p>
        </div>
      </div>

      <ClientsDirectoryTable />
    </div>
  );
}
