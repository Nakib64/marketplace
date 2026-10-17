import type { Metadata } from 'next';
import { DisputesListTable } from '@/components/disputes/DisputesListTable';
import { Scale } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dispute Arbitration Court | Banglance Admin',
  description: 'Impartial third-party dispute mediation, contract inspection, and escrow verdict resolution.',
};

export default function AdminDisputesPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Dispute Arbitration Court</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Review active contract disputes, examine workroom transcripts, inspect deliverable files, and issue legally binding verdicts.
          </p>
        </div>
      </div>

      <DisputesListTable />
    </div>
  );
}
