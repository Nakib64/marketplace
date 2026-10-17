import type { Metadata } from 'next';
import { UsersDirectoryTable } from '@/components/users/UsersDirectoryTable';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'User Governance & Risk | Banglance Admin',
  description: 'Identity verification, account balance tracking, and risk suspension management.',
};

export default function AdminUsersPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">User Directory & Governance</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Search all registered accounts, inspect wallet balances, verify status, and manage platform suspensions.
          </p>
        </div>
      </div>

      <UsersDirectoryTable />
    </div>
  );
}
