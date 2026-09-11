'use client';

import React, { useState } from 'react';
import Image from 'next/image';

const DELIVERABLES = [
  {
    id: 'del-1',
    contractAddress: '0x71c8...39A1',
    jobTitle: 'Arbitrum Orbit AMM Rollup',
    freelancerName: 'Alex Rivera',
    freelancerHandle: 'alexr.eth',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfQ06R5cabAP06Lx3rZNaibZQs4ZKCbaJTl9EeBPZUw7eeEyGGj1FQSWoPGdsONpmRCLBzndVzfar_CepsA6KPv0d4CUqHF33xAEiwDnQNgUwxcpziuRcxgSDo6MaXPKSDFEiERZwgIKrY3zDe4uqGgWRq38oRjUEqRdBBawbtTfoZaQpPOe7yq-aHAkKmhWrRqiwXPAyhCzAAzcJnREIOFGthbm3TW9gmjlC8Qa3FlbFhk0AXLGBx',
    role: 'Level 4 Builder',
    milestone: 'Milestone 2 of 3',
    task: 'Foundry Fuzz Testing & Slither CI Pipeline',
    submitted: '6h ago',
    progress: 75,
    amount: '$3,500 USDC',
    pr: 'GitHub PR #42',
    ipfs: 'IPFS: QmZ9t...8u7Y',
    proof: 'All 412 unit tests passing',
  },
  {
    id: 'del-2',
    contractAddress: '0x93dc...22A0',
    jobTitle: 'zk-SNARK Circuit for Private Governance',
    freelancerName: 'Elena Rostova',
    freelancerHandle: 'elena.eth',
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC2ioWUSb-fuTeQQgbebbsnfgnj2fWhOr18ePHFm1CWnZmdpDvMoi4QrvTQDjP84yXanktEkiNkOhJpLuFkALxYrwrvXllnGUhxkXKBnYmCEQIB9kWihkqgBq2JFHrXj9HBMJisJjTS9JjKyCsFV16XgBhJFwOV8GWm3ZB9Pi30YlusbXqvVM-aOPqzcQiIyfqrV2DIrjyfRgRLcRsNkFoyVHFf35Kis1map3kB2hvSqKLmXIdYClbk',
    role: 'zk-Specialist',
    milestone: 'Milestone 1 of 2',
    task: 'Circom Circuit Math Spec & Verification Keys',
    submitted: '18h ago',
    progress: 50,
    amount: '$2,500 USDC',
    pr: undefined,
    ipfs: 'IPFS Spec: bafybei...3mkl',
    proof: 'Pending 1 additional multisig signature',
  },
];

export const ClientPendingDeliverables: React.FC = () => {
  const [approvedIds, setApprovedIds] = useState<string[]>([]);

  const handleApprove = (id: string, amount: string) => {
    setApprovedIds((prev) => [...prev, id]);
    alert(`Multisig release initiated for ${amount}! Safe transaction broadcasted.`);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary-container"></span>
          <h2 className="text-lg font-bold text-on-surface">Pending Deliverable Reviews</h2>
          <span className="px-2 py-0.5 rounded-full bg-surface-container-high text-xs text-on-surface-variant font-medium">
            {DELIVERABLES.filter((d) => !approvedIds.includes(d.id)).length} Action Required
          </span>
        </div>
        <span className="text-xs text-on-surface-variant hidden sm:inline">Multisig consensus: 2 of 3</span>
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-base font-bold text-on-surface">{item.jobTitle}</span>
                    <span className="font-mono text-xs text-on-surface-variant">{item.contractAddress}</span>
                  </div>
                  <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-0.5">
                    <span className="text-on-surface font-medium">{item.freelancerName}</span>
                    <span className="text-outline-variant">•</span>
                    <span className="font-mono text-primary">{item.freelancerHandle}</span>
                    <span className="px-1.5 py-0.5 bg-surface-container rounded text-on-surface-variant">{item.role}</span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-1">
                <span className="text-base font-bold text-on-surface">{item.amount}</span>
                <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant text-xs">{item.milestone}</span>
              </div>
            </div>

            <div className="bg-surface-container rounded-lg p-3.5 flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="font-semibold text-on-surface flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px] text-on-surface-variant">terminal</span>
                  {item.task}
                </span>
                <span className="text-on-surface-variant">Submitted {item.submitted}</span>
              </div>
              <div className="w-full flex flex-col gap-1 pt-1">
                <div className="flex justify-between text-on-surface-variant text-[11px] font-mono">
                  <span>Milestone Completion</span>
                  <span className="text-on-surface">{item.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-mono">
                {item.pr && (
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">merge</span>{item.pr}
                  </span>
                )}
                <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">description</span>{item.ipfs}
                </span>
                <span className="text-on-surface-variant text-xs flex items-center gap-1 ml-auto">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>{item.proof}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => alert(`Inspecting deliverable proof for ${item.task}...`)}
                className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">visibility</span>
                <span>Review Code Submission</span>
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
                <span>{isApproved ? 'Release Broadcasted' : `Approve & Release ${item.amount.split(' ')[0]}`}</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
