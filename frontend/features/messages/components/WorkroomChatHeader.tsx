'use client';

import React from 'react';
import Link from 'next/link';
import { WorkroomChannel } from '../types/messageTypes';

interface WorkroomChatHeaderProps {
  channel: WorkroomChannel;
}

export const WorkroomChatHeader: React.FC<WorkroomChatHeaderProps> = ({ channel }) => {
  return (
    <div className="flex flex-col shrink-0 border-b border-outline-variant/30">
      <div className="px-4 py-3 bg-surface-container-lowest flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-surface-container flex items-center justify-center font-bold text-sm text-primary shrink-0 border border-outline-variant/30">
            {channel.avatarText}
          </div>
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-bold text-on-surface truncate">{channel.contactName}</span>
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary">
                {channel.contactEns}
              </span>
              <span className="hidden sm:inline text-xs text-on-surface-variant">• {channel.contactRole}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-on-surface-variant flex-wrap mt-0.5">
              <span className="truncate">{channel.title}</span>
              <span>•</span>
              <span className="font-mono text-on-surface font-semibold">${channel.totalVault.toLocaleString()} {channel.currency} Vault</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container font-mono text-[10px] text-primary">
                {channel.activeMilestone}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0 text-xs">
          <Link
            href={`/contracts/${channel.id}`}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1 border border-outline-variant/20 font-medium"
          >
            <span className="material-symbols-outlined text-[15px] text-primary">account_balance_wallet</span>
            <span className="hidden md:inline">Inspect Escrow</span>
          </Link>
          <button
            type="button"
            onClick={() => alert('Launching WebRTC peer-to-peer encrypted huddle...')}
            className="px-2.5 py-1.5 rounded-lg bg-surface-container text-on-surface hover:bg-surface-container-high transition-colors flex items-center gap-1 border border-outline-variant/20 font-medium"
          >
            <span className="material-symbols-outlined text-[15px]">videocam</span>
            <span className="hidden md:inline">Huddle</span>
          </button>
        </div>
      </div>

      <div className="px-4 py-1.5 bg-surface-container-low flex items-center justify-between gap-2 text-[11px] font-mono text-on-surface-variant">
        <div className="flex items-center gap-1.5 truncate">
          <span className="material-symbols-outlined text-primary text-[14px] shrink-0">lock</span>
          <span className="truncate">XMTP End-to-End Encrypted via Ethereum Keypair (EIP-1271). Counterparties only.</span>
        </div>
        <button
          type="button"
          onClick={() => alert('Handshake verified cryptographically on Arbitrum')}
          className="text-primary hover:underline shrink-0 flex items-center gap-0.5"
        >
          <span>Verify</span>
          <span className="material-symbols-outlined text-[12px]">arrow_outward</span>
        </button>
      </div>
    </div>
  );
};
