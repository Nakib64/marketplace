import React from 'react';

export const ProposalBenchmarkMatrixWidget: React.FC = () => {
  return (
    <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex flex-col gap-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Candidate Benchmark Matrix</span>
        <span className="font-mono text-xs text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded">
          Stylus AMM
        </span>
      </div>

      <div className="flex flex-col gap-3 font-mono text-xs">
        {/* Security Audit Score */}
        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center text-on-surface font-sans text-xs">
            <span>Security Audit Score</span>
            <span className="font-mono text-primary font-semibold">Alex R. (96.4/100)</span>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full" style={{ width: '96.4%' }} />
          </div>
          <div className="flex justify-between text-on-surface-variant text-[11px] pt-0.5">
            <span>Alex: 96.4</span>
            <span>Marcus: 92.0</span>
            <span>Sophia: 88.5</span>
          </div>
        </div>

        {/* Execution Speed */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex justify-between items-center text-on-surface font-sans text-xs">
            <span>Stylus Execution Speed</span>
            <span className="font-mono text-secondary font-semibold">Sophia (0.12ms)</span>
          </div>
          <div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-secondary rounded-full" style={{ width: '92%' }} />
          </div>
          <div className="flex justify-between text-on-surface-variant text-[11px] pt-0.5">
            <span>Sophia: 0.12ms</span>
            <span>Alex: 0.18ms</span>
            <span>Marcus: 0.24ms</span>
          </div>
        </div>

        {/* Turnaround Duration */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex justify-between items-center text-on-surface font-sans text-xs">
            <span>Turnaround Duration</span>
            <span className="font-mono text-on-surface">2.5w — 4.0w</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
            <div className="bg-surface-container-low py-1 rounded text-on-surface border border-outline-variant/20">Alex: 3.0w</div>
            <div className="bg-surface-container-low py-1 rounded text-on-surface border border-outline-variant/20">Marcus: 4.0w</div>
            <div className="bg-surface-container-low py-1 rounded text-primary font-bold border border-outline-variant/20">Sophia: 2.5w</div>
          </div>
        </div>

        {/* Total Cost Efficiency */}
        <div className="flex flex-col gap-1 pt-1">
          <div className="flex justify-between items-center text-on-surface font-sans text-xs">
            <span>Total Cost vs. Budget</span>
            <span className="font-mono text-primary font-semibold">Alex (-$500)</span>
          </div>
          <div className="grid grid-cols-3 gap-1 text-center text-[11px]">
            <div className="bg-surface-container-low py-1 rounded text-on-surface border border-outline-variant/20">$14.5k</div>
            <div className="bg-surface-container-low py-1 rounded text-on-surface border border-outline-variant/20">$15.0k</div>
            <div className="bg-surface-container-low py-1 rounded text-primary font-bold border border-outline-variant/20">$13.2k</div>
          </div>
        </div>
      </div>
    </div>
  );
};
