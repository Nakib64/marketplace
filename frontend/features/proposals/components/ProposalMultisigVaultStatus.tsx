'use client';

import React from 'react';
import { toast } from 'sonner';

export const ProposalMultisigVaultStatus: React.FC = () => {
  return (
    <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex flex-col gap-4 shadow-lg">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Payment Protection</span>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-xs text-primary font-semibold">Active</span>
        </div>
      </div>

      <div className="bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/20 flex flex-col gap-3">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
          <span className="text-xs font-semibold text-on-surface">Guaranteed Marketplace Protection</span>
        </div>

        <div className="flex flex-col gap-2 pt-1 text-xs text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Funds safely held until milestone acceptance</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Automated 48-hour review &amp; revision period</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span>Full resolution support for both parties</span>
          </div>
        </div>
      </div>
    </div>
  );
};
