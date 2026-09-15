import React from 'react';
import Link from 'next/link';

export const DisputeCourtShieldCard: React.FC = () => {
  return (
    <div className="rounded-xl bg-surface-container-low p-5 border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2 text-primary pb-1 border-b border-outline-variant/20">
        <span className="material-symbols-outlined text-[20px]">support_agent</span>
        <h3 className="text-sm font-bold text-on-surface">Resolution Support</h3>
      </div>

      <div className="flex flex-col gap-2 pt-1 text-xs">
        <Link
          href="/contracts"
          className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface border border-outline-variant/20"
        >
          <span>Payment Protection Guidelines</span>
          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">arrow_forward</span>
        </Link>
        <Link
          href="/messages"
          className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface border border-outline-variant/20"
        >
          <span>Contact Resolution Support</span>
          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">arrow_forward</span>
        </Link>
      </div>
    </div>
  );
};

