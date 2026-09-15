'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { contractsApi } from '@/features/contracts/api/contractsApi';
import { mapBackendContract, RawBackendContract } from '@/features/contracts/types/contractsTypes';

export const ClientPendingDeliverables: React.FC = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const { data: rawContracts = [], isLoading } = useQuery({
    queryKey: ['user-contracts'],
    queryFn: () => contractsApi.getUserContracts(),
    staleTime: 30_000,
  });

  const contracts = (rawContracts as unknown as RawBackendContract[]).map((c) => mapBackendContract(c));
  const pendingContracts = contracts.filter((c) => c.status === 'PENDING_APPROVAL');

  const handleApprove = async (id: string, amount: number, currency: string) => {
    setApprovingId(id);
    try {
      await contractsApi.approveWork(id);
      queryClient.invalidateQueries({ queryKey: ['user-contracts'] });
      toast.success(`Payment approved for ${amount.toLocaleString()} ${currency}! Escrow funds released to freelancer.`);
    } catch {
      toast.error('Failed to approve deliverable. Please try again.');
    } finally {
      setApprovingId(null);
    }
  };

  if (isLoading) {
    return null;
  }

  // If there are no deliverables requiring immediate action, render a subtle status card
  if (pendingContracts.length === 0) {
    return (
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 flex items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[20px]">task_alt</span>
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-sm font-bold text-on-surface">Milestone Deliverables Clean</h3>
            <p className="text-xs text-on-surface-variant">
              No milestone submissions currently awaiting your approval. Active contracts will update here when work is submitted.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
          <h2 className="text-lg font-bold text-on-surface">Pending Deliverables</h2>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {pendingContracts.length} Action Required
          </span>
        </div>
      </div>

      {pendingContracts.map((item) => {
        const isApproving = approvingId === item.id;
        return (
          <div key={item.id} className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-surface-container flex items-center justify-center shrink-0 border border-outline-variant/30 text-primary font-bold text-base">
                  {(item.freelancerName || 'Freelancer').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">{item.title}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-0.5">
                    <span className="text-on-surface font-semibold">{item.freelancerName || 'Freelancer'}</span>
                    <span className="text-outline-variant">•</span>
                    <span>Awaiting your milestone review</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-0.5">
                <span className="text-base font-bold text-on-surface">
                  ${item.amount.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">{item.currency}</span>
                </span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-primary text-xs font-medium">Milestone Review</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">verified</span>
                <span>Work submitted for review</span>
              </div>
              <p className="text-xs text-on-surface-variant line-clamp-2">
                {item.scopeOfWork}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => router.push(`/contracts/${item.id}/review`)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Review Work</span>
              </button>
              <button
                type="button"
                disabled={isApproving}
                onClick={() => handleApprove(item.id, item.amount, item.currency)}
                className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isApproving ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                    <span>Releasing Funds...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                    <span>Approve &amp; Release Escrow</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
