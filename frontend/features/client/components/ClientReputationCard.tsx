import React from 'react';

export const ClientReputationCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 lg:p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-on-surface">Hirer Reputation SBT</h3>
        <span className="material-symbols-outlined text-[18px] text-primary">verified</span>
      </div>

      <div className="relative overflow-hidden rounded-lg bg-surface-container p-3.5 flex flex-col gap-3 border border-outline-variant/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface-variant">CertiK Trust Score</span>
          <span className="font-mono font-bold text-primary">98 / 100</span>
        </div>
        <div className="w-full h-1 bg-surface-container-highest rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full" style={{ width: '98%' }} />
        </div>
        <div className="flex flex-col gap-2 pt-1 text-xs text-on-surface-variant">
          <div className="flex items-center justify-between">
            <span>Soulbound NFT ID</span>
            <span className="font-mono text-on-surface">#0091 Verified DAO</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Prompt Payment Rating</span>
            <span className="font-mono text-on-surface font-semibold">5.0 / 5.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Avg. Milestone Release</span>
            <span className="font-mono text-primary">14 hours</span>
          </div>
        </div>
      </div>
    </div>
  );
};
