'use client';

import React from 'react';
import Link from 'next/link';
import { WorkroomEscrowContext } from '../types/messageTypes';

interface WorkroomTelemetrySidebarProps {
  context: WorkroomEscrowContext;
  contractId: string;
}

export const WorkroomTelemetrySidebar: React.FC<WorkroomTelemetrySidebarProps> = ({
  context,
  contractId,
}) => {
  return (
    <aside className="w-full md:w-[280px] lg:w-[300px] shrink-0 bg-surface-container-lowest border-l border-outline-variant/30 flex flex-col justify-between overflow-y-auto">
      <div className="p-3.5 flex flex-col gap-4 text-xs">
        {/* Escrow Telemetry */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Escrow Telemetry</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-container text-primary font-mono text-[10px]">Active</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container flex flex-col gap-2 border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">{context.milestoneTitle}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold font-mono text-on-surface">${context.lockedAmount.toLocaleString()}</span>
              <span className="text-[11px] font-mono text-on-surface-variant">{context.currency} Locked</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/2" />
            </div>
            <div className="flex items-center justify-between text-on-surface-variant font-mono text-[10px]">
              <span>Released: ${context.releasedAmount.toLocaleString()}</span>
              <span>Rem: ${context.remainingAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SLA Grace Timer */}
        <div className="p-3 rounded-xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant text-[11px]">SLA Grace Timer</span>
            <span className="material-symbols-outlined text-primary text-[15px]">timer</span>
          </div>
          <span className="text-base font-bold font-mono text-on-surface">{context.slaGraceRemaining}</span>
          <p className="text-[10px] text-on-surface-variant leading-tight mt-0.5">
            Auto-releases at expiration unless a dispute challenge is staked on Kleros.
          </p>
        </div>

        {/* Contract Actions */}
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-on-surface text-[11px]">Contract Actions</span>
          <Link
            href={`/contracts/${contractId}/review`}
            className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>Approve &amp; Sign ($3,500)</span>
          </Link>
          <Link
            href={`/contracts/${contractId}`}
            className="w-full py-1.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/20 font-medium"
          >
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span>View All Milestones</span>
          </Link>
        </div>

        {/* Verified Artifacts */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-on-surface text-[11px]">Verified Artifacts</span>
            <span className="font-mono text-on-surface-variant text-[10px]">{context.artifacts.length} Total</span>
          </div>
          <div className="flex flex-col gap-1">
            {context.artifacts.map((art, idx) => (
              <div
                key={idx}
                onClick={() => alert(`Artifact clicked: ${art.title}`)}
                className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high cursor-pointer flex items-center justify-between font-mono text-[11px] text-on-surface transition-colors border border-outline-variant/10"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    {art.type === 'ipfs' ? 'folder_zip' : 'merge'}
                  </span>
                  <span className="truncate">{art.title}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[12px]">arrow_outward</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-on-surface-variant font-mono text-[11px]">
        <span>Kleros Arb #1488</span>
        <span className="text-primary font-medium">Synced</span>
      </div>
    </aside>
  );
};
