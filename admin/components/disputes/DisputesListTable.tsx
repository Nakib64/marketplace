'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminDisputesApi } from '@/lib/api/adminApi';
import { AdminDisputeDossier } from '@/types/adminTypes';
import { Scale, ArrowRight, RefreshCw } from 'lucide-react';

export function DisputesListTable() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-disputes'],
    queryFn: () => adminDisputesApi.getDisputes(),
  });

  const disputes: AdminDisputeDossier[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.disputes)
    ? (data as any).disputes
    : [];

  return (
    <div className="rounded-2xl border border-outline-variant bg-white shadow-2xs overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-outline-variant">
        <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase flex items-center gap-2">
          <Scale className="h-4 w-4 text-primary" />
          Active Arbitration Registry
        </h2>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh List
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container text-on-surface-variant uppercase text-[11px] font-semibold tracking-wider border-b border-outline-variant">
            <tr>
              <th className="py-3.5 px-5">Contract / Job Title</th>
              <th className="py-3.5 px-4">Client</th>
              <th className="py-3.5 px-4">Freelancer</th>
              <th className="py-3.5 px-4">Escrow Locked</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Arbitration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-on-surface">
            {isLoading ? (
              <tr><td colSpan={6} className="py-8 text-center text-outline">Loading active disputes...</td></tr>
            ) : disputes.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-outline font-medium">Zero active disputes. All contracts in good standing.</td></tr>
            ) : (
              disputes.map((d: any) => (
                <tr key={d.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-5 font-bold text-on-surface">
                    <div className="text-xs truncate max-w-xs">{d.job?.title || 'Contract Disputed'}</div>
                    <div className="text-[10px] text-outline font-normal">ID: {d.id.slice(0, 8)}...</div>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">{d.client?.email}</td>
                  <td className="py-3.5 px-4 text-on-surface-variant font-medium">{d.freelancer?.email}</td>
                  <td className="py-3.5 px-4 font-bold text-primary">৳{d.escrowAmount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-error">
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <a
                      href={`/disputes/${d.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold transition-colors shadow-2xs cursor-pointer"
                    >
                      <span>Arbitrate</span>
                      <ArrowRight className="h-3 w-3" />
                    </a>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
