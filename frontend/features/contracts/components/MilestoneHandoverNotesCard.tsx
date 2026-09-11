import React from 'react';

interface MilestoneHandoverNotesCardProps {
  notes?: string;
}

export const MilestoneHandoverNotesCard: React.FC<MilestoneHandoverNotesCardProps> = ({
  notes,
}) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">notes</span>
          <h3 className="text-sm font-bold text-on-surface">Engineer Technical Handover Note</h3>
        </div>
        <span className="text-[11px] text-on-surface-variant font-mono">Markdown Verified</span>
      </div>

      <div className="bg-surface-container-low rounded-lg p-3.5 text-xs text-on-surface-variant flex flex-col gap-2.5 leading-relaxed border border-outline-variant/20">
        <p>
          {notes ||
            "Completed all deliverable requirements for Milestone 2. Replaced legacy mock structures with stateful Foundry invariant test suites covering pool liquidity edge conditions."}
        </p>

        <div className="p-2.5 bg-surface-container rounded font-mono text-[11px] text-on-surface space-y-1 border border-outline-variant/20">
          <div className="text-primary font-semibold">{'// Key Optimizations Completed:'}</div>
          <div>1. <span className="text-on-surface-variant">TickMath:</span> Refactored zero-copy bitwise shifts (saved ~3,400 gas on tick crossing).</div>
          <div>2. <span className="text-on-surface-variant">Slither Audit:</span> Addressed 2 informational low-priority shadowing warnings in LiquidityManager.sol.</div>
          <div>3. <span className="text-on-surface-variant">Arbitrum Stylus:</span> Validated WASM inter-op bridge compatibility under high block contention.</div>
        </div>

        <p className="text-[11px]">
          Automated unit coverage reports are mirrored to the IPFS directory. Ready for your on-chain sign-off so we can begin Milestone 3 (L3 Orbit deploy &amp; telemetry monitoring).
        </p>
      </div>
    </div>
  );
};
