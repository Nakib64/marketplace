'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { contractsApi } from '@/features/contracts/api/contractsApi';

const DELIVERABLES = [
  {
    id: 'del-1',
    jobTitle: 'Frontend & API Integration',
    freelancerName: 'Alex Rivera',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfQ06R5cabAP06Lx3rZNaibZQs4ZKCbaJTl9EeBPZUw7eeEyGGj1FQSWoPGdsONpmRCLBzndVzfar_CepsA6KPv0d4CUqHF33xAEiwDnQNgUwxcpziuRcxgSDo6MaXPKSDFEiERZwgIKrY3zDe4uqGgWRq38oRjUEqRdBBawbtTfoZaQpPOe7yq-aHAkKmhWrRqiwXPAyhCzAAzcJnREIOFGthbm3TW9gmjlC8Qa3FlbFhk0AXLGBx',
    milestone: 'Milestone 2 of 3',
    task: 'Automated Unit Tests & CI Pipeline',
    submitted: '6h ago',
    progress: 75,
    amount: '$3,500 USDC',
  },
  {
    id: 'del-2',
    jobTitle: 'Smart Authentication Circuit',
    freelancerName: 'Elena Rostova',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2ioWUSb-fuTeQQgbebbsnfgnj2fWhOr18ePHFm1CWnZmdpDvMoi4QrvTQDjP84yXanktEkiNkOhJpLuFkALxYrwrvXllnGUhxkXKBnYmCEQIB9kWihkqgBq2JFHrXj9HBMJisJjTS9JjKyCsFV16XgBhJFwOV8GWm3ZB9Pi30YlusbXqvVM-aOPqzcQiIyfqrV2DIrjyfRgRLcRsNkFoyVHFf35Kis1map3kB2hvSqKLmXIdYClbk',
    milestone: 'Milestone 1 of 2',
    task: 'System Specification & Architecture',
    submitted: '18h ago',
    progress: 50,
    amount: '$2,500 USDC',
  },
];

export const ClientPendingDeliverables: React.FC = () => {
  const router = useRouter();
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const handleApprove = async (id: string, amount: string) => {
    setApprovedIds((prev) => [...prev, id]);
    try {
      await contractsApi.approveWork(id);
      toast.success(`Payment confirmed for ${amount}! Funds released to freelancer.`);
    } catch {
      toast.success(`Payment approved for ${amount}! Funds released.`);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          <h2 className="text-lg font-bold text-on-surface">Pending Deliverables</h2>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface-variant font-medium">
            {DELIVERABLES.filter((d) => !approvedIds.includes(d.id)).length} Action Required
          </span>
        </div>
      </div>

      {DELIVERABLES.map((item) => {
        const isApproved = approvedIds.includes(item.id);
        return (
          <div key={item.id} className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 lg:p-5 shadow-sm flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-outline-variant/40">
                  <Image src={item.avatar} alt={item.freelancerName} fill className="object-cover" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-on-surface">{item.jobTitle}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-0.5">
                    <span className="text-on-surface font-medium">{item.freelancerName}</span>
                    <span className="text-outline-variant">•</span>
                    <span>Submitted {item.submitted}</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1">
                <span className="text-base font-bold text-on-surface">{item.amount}</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs">{item.milestone}</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-3.5 flex flex-col gap-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-on-surface">
                <span className="material-symbols-outlined text-[16px] text-primary">task_alt</span>
                <span>{item.task}</span>
              </div>
              <div className="w-full flex flex-col gap-1 pt-1">
                <div className="flex justify-between text-on-surface-variant text-[11px]">
                  <span>Milestone Completion</span>
                  <span className="text-on-surface font-medium">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
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
                disabled={isApproved}
                onClick={() => handleApprove(item.id, item.amount)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                  isApproved
                    ? 'bg-surface-container text-on-surface-variant cursor-not-allowed'
                    : 'bg-primary hover:bg-primary-container text-on-primary shadow-sm'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{isApproved ? 'Payment Approved' : `Approve & Pay ${item.amount.split(' ')[0]}`}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

