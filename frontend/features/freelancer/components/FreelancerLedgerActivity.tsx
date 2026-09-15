'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { contractsApi } from '@/features/contracts/api/contractsApi';
import { RawBackendContract } from '@/features/contracts/types/contractsTypes';

export const FreelancerLedgerActivity: React.FC = () => {
  const { data: rawContracts = [] } = useQuery({
    queryKey: ['user-contracts'],
    queryFn: () => contractsApi.getUserContracts(),
    staleTime: 30_000,
  });

  const contracts = rawContracts as unknown as RawBackendContract[];

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Recent Contract Activity</span>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">receipt_long</span>
      </div>

      {contracts.length === 0 ? (
        <div className="py-6 flex flex-col items-center justify-center text-center gap-2">
          <span className="material-symbols-outlined text-[24px] text-on-surface-variant/50">history</span>
          <span className="text-xs text-on-surface-variant">No milestone activity yet</span>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5">
          {contracts.slice(0, 4).map((c) => (
            <div
              key={c.id || Math.random().toString()}
              className="flex items-center justify-between gap-2 p-3 bg-surface-container rounded-xl border border-outline-variant/20"
            >
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-bold text-on-surface">{c.job?.title || 'Contract Milestone'}</span>
                <span className="text-[11px] text-on-surface-variant">
                  {c.status === 'COMPLETED' ? 'Milestone Released' : c.status === 'PENDING_APPROVAL' ? 'Under Review' : 'Active Escrow'}
                </span>
              </div>
              <span className="text-xs font-bold text-primary shrink-0">
                ${Number(c.escrowAmount || c.amount || 0).toLocaleString()} {c.currency || 'BDT'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
