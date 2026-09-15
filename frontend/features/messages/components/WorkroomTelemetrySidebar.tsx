'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
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
        {/* Project Funds & Status */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Project Funds</span>
            <span className="px-1.5 py-0.2 rounded bg-surface-container text-primary  text-[10px]">Protected</span>
          </div>
          <div className="p-3 rounded-xl bg-surface-container flex flex-col gap-2 border border-outline-variant/20">
            <span className="text-[11px] text-on-surface-variant font-medium">{context.milestoneTitle}</span>
            <div className="flex items-baseline justify-between">
              <span className="text-lg font-bold  text-on-surface">${context.lockedAmount.toLocaleString()}</span>
              <span className="text-[11px]  text-on-surface-variant">{context.currency} In Protection</span>
            </div>
            <div className="w-full h-1.5 bg-surface-container-low rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full w-1/2" />
            </div>
            <div className="flex items-center justify-between text-on-surface-variant  text-[10px]">
              <span>Paid: ${context.releasedAmount.toLocaleString()}</span>
              <span>Remaining: ${context.remainingAmount.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Review Period */}
        <div className="p-3 rounded-xl bg-surface-container flex flex-col gap-1 border border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-on-surface-variant text-[11px]">Review Window</span>
            <span className="material-symbols-outlined text-primary text-[15px]">timer</span>
          </div>
          <span className="text-base font-bold  text-on-surface">{context.slaGraceRemaining}</span>
          <p className="text-[10px] text-on-surface-variant leading-tight mt-0.5">
            Auto-approved when review window ends unless changes are requested.
          </p>
        </div>

        {/* Contract Actions */}
        <div className="flex flex-col gap-1.5">
          <span className="font-semibold text-on-surface text-[11px]">Actions</span>
          <Link
            href={`/contracts/${contractId}/review`}
            className="w-full py-2 px-3 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>Review &amp; Approve ($3,500)</span>
          </Link>
          <Link
            href={`/contracts/${contractId}`}
            className="w-full py-1.5 px-3 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors flex items-center justify-center gap-1.5 border border-outline-variant/20 font-medium"
          >
            <span className="material-symbols-outlined text-[15px]">description</span>
            <span>View All Milestones</span>
          </Link>
        </div>

        {/* Deliverable Files */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-on-surface text-[11px]">Submitted Deliverables</span>
            <span className=" text-on-surface-variant text-[10px]">{context.artifacts.length} Files</span>
          </div>
          <div className="flex flex-col gap-1">
            {context.artifacts.map((art, idx) => (
              <div
                key={idx}
                onClick={() => toast.info(`Opening deliverable: ${art.title}`)}
                className="p-1.5 rounded bg-surface-container hover:bg-surface-container-high cursor-pointer flex items-center justify-between  text-[11px] text-on-surface transition-colors border border-outline-variant/10"
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="material-symbols-outlined text-primary text-[14px]">
                    {art.type === 'ipfs' ? 'folder_zip' : 'file_present'}
                  </span>
                  <span className="truncate">{art.title}</span>
                </div>
                <span className="material-symbols-outlined text-on-surface-variant text-[12px]">arrow_outward</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-on-surface-variant text-xs">
        <span className="text-on-surface font-medium">Payment Protection</span>
        <span className="text-primary font-semibold flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">verified_user</span>
          Active
        </span>
      </div>
    </aside>
  );
};
