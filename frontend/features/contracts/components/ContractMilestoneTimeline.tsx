import React from 'react';
import { ContractMilestone } from '../types/contractsTypes';

interface ContractMilestoneTimelineProps {
  milestones: ContractMilestone[];
}

export const ContractMilestoneTimeline: React.FC<ContractMilestoneTimelineProps> = ({ milestones }) => {
  const activeCount = milestones.filter(m => m.status === 'PAID').length + 1;
  const totalCount = milestones.length || 3;

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">alt_route</span>
          <h2 className="text-base font-bold text-on-surface">Execution Milestones</h2>
        </div>
        <span className="font-mono text-xs text-on-surface-variant bg-surface-container px-2.5 py-0.5 rounded border border-outline-variant/20">
          Stage {activeCount} of {totalCount} Active
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {milestones.map((m, idx) => {
          if (m.status === 'PAID') {
            return (
              <div key={idx} className="bg-surface-container rounded-xl p-3.5 flex flex-col gap-2 border border-outline-variant/20 opacity-90">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-on-surface-variant font-medium">Milestone {m.step || idx + 1}</span>
                      <h3 className="text-xs font-bold text-on-surface">{m.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-center font-mono">
                    <span className="text-xs text-on-surface font-semibold">${m.amount.toLocaleString()} {m.currency}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-[10px]">
                      <span className="material-symbols-outlined text-[12px]">check_circle</span> Paid
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-on-surface-variant pt-1 border-t border-outline-variant/10">
                  <span className="text-[11px]">Completed &amp; validated on-chain via smart release.</span>
                  {m.txHash && <span className="font-mono text-[11px] text-primary">Tx: {m.txHash}</span>}
                </div>
              </div>
            );
          }

          if (m.status === 'ACTIVE') {
            return (
              <div key={idx} className="bg-surface-container rounded-xl p-4 flex flex-col gap-3 border border-primary/40 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
                      <span className="material-symbols-outlined text-primary text-[16px]">motion_photos_on</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-primary font-mono font-bold text-[11px] uppercase tracking-wider">Milestone {m.step || idx + 1} • Active</span>
                        <span className="bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded font-mono text-[10px]">{m.dueDate || 'Due soon'}</span>
                      </div>
                      <h3 className="text-sm font-bold text-on-surface mt-0.5">{m.title}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col sm:items-end font-mono">
                    <span className="text-sm font-bold text-on-surface">${m.amount.toLocaleString()} {m.currency}</span>
                    <span className="text-[10px] text-on-surface-variant">Locked in Smart Vault</span>
                  </div>
                </div>

                <div className="flex flex-col gap-1 bg-surface-container-low p-2.5 rounded-lg border border-outline-variant/20">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-on-surface-variant">Deliverable Readiness</span>
                    <span className="font-mono text-primary font-bold">{m.progressPct || 75}% Complete</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-surface-container-high overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${m.progressPct || 75}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-on-surface-variant pt-0.5 font-mono">
                    <span>{m.deliverableNotes || '3 of 4 unit test suites passing fuzz invariants'}</span>
                    <span>Target: Invariant Quorum</span>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={idx} className="bg-surface-container/60 rounded-xl p-3.5 flex flex-col gap-1.5 border border-outline-variant/20 opacity-70">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-surface-container flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant text-[15px]">lock</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-on-surface-variant font-medium">Milestone {m.step || idx + 1} • Up Next</span>
                    <h3 className="text-xs font-bold text-on-surface">{m.title}</h3>
                  </div>
                </div>
                <span className="font-mono text-xs text-on-surface-variant">${m.amount.toLocaleString()} {m.currency}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
