'use client';

import React from 'react';
import { VaultStatus } from '../types/walletTypes';

interface VaultFilterStripProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  statusFilter: VaultStatus;
  onStatusChange: (status: VaultStatus) => void;
  selectedChain: string;
  onChainChange: (chain: string) => void;
}

export const VaultFilterStrip: React.FC<VaultFilterStripProps> = ({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  selectedChain,
  onChainChange,
}) => {
  return (
    <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 mb-6 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 min-w-[260px]">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search vault by 0x Address, Contributor ENS, or RFP ID..."
          className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 text-on-surface placeholder:text-on-surface-variant/60 text-xs font-mono focus:outline-none focus:border-primary"
        />
      </div>

      {/* Filter Tabs & Selectors */}
      <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto text-xs">
        <button
          type="button"
          onClick={() => onStatusChange('ALL')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${statusFilter === 'ALL' ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}
        >
          All Vaults
        </button>
        <button
          type="button"
          onClick={() => onStatusChange('PENDING_RELEASE')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${statusFilter === 'PENDING_RELEASE' ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}
        >
          Pending Release
        </button>
        <button
          type="button"
          onClick={() => onStatusChange('ACTIVE')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${statusFilter === 'ACTIVE' ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}
        >
          Active Sprints
        </button>
        <button
          type="button"
          onClick={() => onStatusChange('SETTLED')}
          className={`px-3 py-1 rounded-full font-medium transition-all ${statusFilter === 'SETTLED' ? 'bg-primary/20 text-primary border border-primary/40' : 'bg-surface-container text-on-surface-variant hover:text-on-surface'}`}
        >
          Settled
        </button>

        <div className="h-4 w-px bg-outline-variant/40 mx-1 hidden sm:block" />

        {/* Chain selector */}
        <select
          value={selectedChain}
          onChange={(e) => onChainChange(e.target.value)}
          className="bg-surface-container text-on-surface px-2.5 py-1 rounded-lg border border-outline-variant/30 text-xs focus:outline-none"
        >
          <option value="Arbitrum One">Arbitrum One</option>
          <option value="Optimism">Optimism Mainnet</option>
          <option value="Ethereum">Ethereum L1</option>
        </select>
      </div>
    </div>
  );
};
