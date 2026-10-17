'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ContractFilterTab, FreelancerContractItem } from '../types/freelancerTypes';
import { contractsApi } from '@/features/contracts/api/contractsApi';

export const FreelancerActiveContracts: React.FC = () => {
  const [filter, setFilter] = useState<ContractFilterTab>('ALL');
  const [contracts, setContracts] = useState<FreelancerContractItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    contractsApi
      .getUserContracts()
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            const mapped: FreelancerContractItem[] = data.map((c: any) => {
              const isCompleted = c.status === 'COMPLETED';
              const isPending = c.status === 'PENDING_APPROVAL';
              const title = c.job?.title || c.title || 'Project Contract';
              const clientName =
                c.client?.clientProfile?.companyName ||
                c.client?.email?.split('@')[0] ||
                c.clientName ||
                'Client';
              const amount = Number(c.escrowAmount || c.amount || 0);

              return {
                id: c.id,
                title,
                clientName,
                amount,
                currency: 'BDT',
                contractAddress: c.contractAddress || '',
                milestoneStep: isCompleted ? 'Completed' : 'Milestone 1 of 1',
                milestoneTitle: title,
                dueDate: isCompleted
                  ? 'Settled & Paid'
                  : isPending
                  ? 'Under Inspection'
                  : 'In Progress',
                progressPct: isCompleted ? 100 : isPending ? 95 : 60,
                status: isCompleted
                  ? 'COMPLETED'
                  : isPending
                  ? 'PENDING_REVIEW'
                  : 'IN_PROGRESS',
              };
            });
            setContracts(mapped);
          } else {
            setContracts([]);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setContracts([]);
          setIsLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const activeCount = contracts.filter((c) => c.status !== 'COMPLETED').length;

  const filtered = contracts.filter((c) => {
    if (filter === 'PENDING') return c.status === 'PENDING_REVIEW';
    if (filter === 'IN_PROGRESS') return c.status === 'IN_PROGRESS';
    if (filter === 'COMPLETED') return c.status === 'COMPLETED';
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low border border-outline-variant/30 p-3.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-on-surface">Active Contracts &amp; Milestones</h2>
          <span className="text-xs bg-surface-container px-2 py-0.5 rounded-full text-on-surface-variant font-bold">
            {activeCount}
          </span>
        </div>
        <div className="flex items-center gap-1 bg-surface-container p-1 rounded-xl border border-outline-variant/20">
          {(['ALL', 'IN_PROGRESS', 'PENDING', 'COMPLETED'] as ContractFilterTab[]).map((tab) => {
            const count =
              tab === 'ALL'
                ? contracts.length
                : tab === 'IN_PROGRESS'
                ? contracts.filter((c) => c.status === 'IN_PROGRESS').length
                : tab === 'PENDING'
                ? contracts.filter((c) => c.status === 'PENDING_REVIEW').length
                : contracts.filter((c) => c.status === 'COMPLETED').length;

            const label =
              tab === 'ALL'
                ? 'All'
                : tab === 'IN_PROGRESS'
                ? 'In Progress'
                : tab === 'PENDING'
                ? 'Pending Review'
                : 'Completed';

            return (
              <button
                key={tab}
                type="button"
                onClick={() => setFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  filter === tab
                    ? 'bg-surface-container-highest text-on-surface'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                <span>{label}</span>
                <span className="text-[10px] opacity-75 font-normal">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 animate-pulse h-32"
            />
          ))}
        </div>
      ) : contracts.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-3 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[28px]">handshake</span>
          </div>
          <div className="flex flex-col gap-0.5 max-w-sm">
            <h3 className="text-sm font-bold text-on-surface">No Contracts Yet</h3>
            <p className="text-xs text-on-surface-variant">
              Submit proposals on open jobs to win contracts and earn milestone payments in escrow.
            </p>
          </div>
          <Link
            href="/jobs"
            className="mt-1 px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">search</span>
            <span>Browse Open Jobs</span>
          </Link>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
          <span className="material-symbols-outlined text-outline text-[24px]">inbox</span>
          <p className="text-xs text-on-surface-variant font-medium">
            No contracts in the &quot;{filter}&quot; tab.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-5 shadow-sm flex flex-col gap-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-bold text-on-surface truncate">{item.title}</h3>
                    {item.status === 'COMPLETED' ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold shrink-0">
                        Completed &amp; Settled
                      </span>
                    ) : item.status === 'PENDING_REVIEW' ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] font-bold shrink-0">
                        Under Review
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold shrink-0">
                        In Progress
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-on-surface-variant block">Client: {item.clientName}</span>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <div className="text-base font-bold text-on-surface">
                    ৳{item.amount.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">{item.currency}</span>
                  </div>
                </div>
              </div>

              <div className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-primary font-semibold">{item.milestoneStep}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="font-semibold text-on-surface">{item.milestoneTitle}</span>
                  </div>
                  <span className="text-on-surface-variant text-[11px] font-medium">{item.dueDate}</span>
                </div>
                <div className="flex flex-col gap-1 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                    <span>Milestone Progress</span>
                    <span className="text-on-surface font-semibold">{item.progressPct}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-primary'
                      }`}
                      style={{ width: `${item.progressPct}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
                  <span className="material-symbols-outlined text-[16px] text-primary">security</span>
                  <span>100% Escrow Milestone Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/contracts/${item.id}`}
                    className="px-3.5 py-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold rounded-lg transition-colors border border-outline-variant/30"
                  >
                    Contract Details
                  </Link>

                  {item.status === 'IN_PROGRESS' ? (
                    <Link
                      href={`/contracts/${item.id}`}
                      className="px-3.5 py-1.5 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span className="material-symbols-outlined text-[15px]">send</span>
                      <span>Submit Work</span>
                    </Link>
                  ) : item.status === 'PENDING_REVIEW' ? (
                    <span className="px-3 py-1.5 bg-surface-container text-on-surface-variant text-xs font-medium rounded-lg border border-outline-variant/20 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[15px] text-primary">schedule</span>
                      <span>Awaiting Client Review</span>
                    </span>
                  ) : (
                    <Link
                      href={`/contracts/${item.id}`}
                      className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="material-symbols-outlined text-[15px]">verified</span>
                      <span>View Settled Contract</span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
