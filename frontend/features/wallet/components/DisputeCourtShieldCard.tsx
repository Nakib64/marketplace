import React from 'react';
import Link from 'next/link';

export const DisputeCourtShieldCard: React.FC = () => {
  return (
    <div className="rounded-xl bg-surface-container-low p-5 border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center gap-2 text-primary pb-1 border-b border-outline-variant/20">
        <span className="material-symbols-outlined text-[20px]">gavel</span>
        <h3 className="text-sm font-bold text-on-surface">Dispute Court Shield</h3>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed">
        Every vault is protected by ERC-792 decentralized arbitration via Kleros. In case of non-delivery, a 48-hour challenge lock activates on-chain mediation.
      </p>

      <div className="flex flex-col gap-2 pt-1 text-xs">
        <Link
          href="/contracts"
          className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface border border-outline-variant/20"
        >
          <span>Escrow Resolution Guidelines</span>
          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">arrow_forward</span>
        </Link>
        <a
          href="https://kleros.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between p-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface border border-outline-variant/20"
        >
          <span>Kleros Court Protocol</span>
          <span className="material-symbols-outlined text-[15px] text-on-surface-variant">open_in_new</span>
        </a>
      </div>
    </div>
  );
};
