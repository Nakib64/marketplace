'use client';

import React from 'react';
import { TxType } from '../types/transactionTypes';

interface TransactionsFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedNetwork: string;
  onNetworkChange: (net: string) => void;
  selectedType: TxType;
  onTypeChange: (type: TxType) => void;
  onRefresh: () => void;
}

export const TransactionsFilterBar: React.FC<TransactionsFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedNetwork,
  onNetworkChange,
  selectedType,
  onTypeChange,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/30 mb-6 text-xs">
      {/* Search Field */}
      <div className="relative flex-1 min-w-[260px]">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by Tx Hash, Escrow ID, Contract Address, or ENS..."
          className="w-full pl-9 pr-3 py-1.5 bg-surface-container text-on-surface placeholder:text-on-surface-variant/60 rounded-lg font-mono focus:outline-none border border-outline-variant/30"
        />
      </div>

      {/* Dropdown Selectors */}
      <div className="flex flex-wrap items-center gap-2">
        <select
          value={selectedNetwork}
          onChange={(e) => onNetworkChange(e.target.value)}
          className="bg-surface-container text-on-surface px-2.5 py-1.5 rounded-lg border border-outline-variant/30 focus:outline-none"
        >
          <option value="Arbitrum One">Arbitrum One</option>
          <option value="Optimism">Optimism</option>
          <option value="Ethereum">Ethereum L1</option>
        </select>

        <select
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value as TxType)}
          className="bg-surface-container text-on-surface px-2.5 py-1.5 rounded-lg border border-outline-variant/30 focus:outline-none"
        >
          <option value="ALL">All Types</option>
          <option value="MILESTONE_RELEASE">Milestone Release</option>
          <option value="ESCROW_DEPOSIT">Escrow Deposit</option>
          <option value="YIELD_HARVEST">Yield Harvest</option>
          <option value="SETTLEMENT_COMPLETE">Settlement Complete</option>
          <option value="INITIAL_FUNDING">Initial Funding</option>
        </select>

        <button
          type="button"
          onClick={onRefresh}
          className="p-1.5 bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface rounded-lg transition-colors border border-outline-variant/30"
          title="Refresh Table"
        >
          <span className="material-symbols-outlined text-[18px]">cached</span>
        </button>
      </div>
    </div>
  );
};
