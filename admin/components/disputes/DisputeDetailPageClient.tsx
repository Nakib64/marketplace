'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminDisputesApi } from '@/lib/api/adminApi';
import { DisputeDossierView } from './DisputeDossierView';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export function DisputeDetailPageClient({ id }: { id: string }) {
  const { data: dossier, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-dispute', id],
    queryFn: () => adminDisputesApi.getDossier(id),
  });

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <div className="flex items-center gap-2 text-on-surface-variant text-xs font-semibold">
          <Loader2 className="h-5 w-5 animate-spin text-primary" />
          <span>Loading dispute evidence transcript...</span>
        </div>
      </div>
    );
  }

  if (error || !dossier) {
    return (
      <div className="rounded-2xl border border-error/20 bg-error-container/40 p-6 text-center">
        <AlertCircle className="mx-auto h-8 w-8 text-error mb-2" />
        <h3 className="text-sm font-bold text-on-surface">Dispute Dossier Not Found</h3>
        <p className="text-xs text-on-surface-variant mt-1 mb-4">Unable to retrieve contract evidence or transcript.</p>
        <a href="/disputes" className="inline-flex items-center gap-1.5 text-xs text-primary font-bold hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Disputes Registry
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <a href="/disputes" className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary font-bold mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Disputes Registry
        </a>
      </div>
      <DisputeDossierView dossier={dossier} onRefresh={() => refetch()} />
    </div>
  );
}
