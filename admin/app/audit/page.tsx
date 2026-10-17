import type { Metadata } from 'next';
import { AuditTrailTable } from '@/components/audit/AuditTrailTable';
import { History } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Audit Trail Explorer | Banglance Admin',
  description: 'Immutable record of staff authorizations, payout actions, dispute rulings, and kill switch mutations.',
};

export default function AdminAuditPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Immutable Audit Trail</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Searchable forensic log of all administrative interventions, financial releases, and configuration adjustments.
          </p>
        </div>
      </div>

      <AuditTrailTable />
    </div>
  );
}
