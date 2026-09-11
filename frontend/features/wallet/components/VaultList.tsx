import React from 'react';
import { EscrowVaultItem } from '../types/walletTypes';
import { VaultCard } from './VaultCard';

interface VaultListProps {
  vaults: EscrowVaultItem[];
}

export const VaultList: React.FC<VaultListProps> = ({ vaults }) => {
  if (vaults.length === 0) {
    return (
      <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/30 text-center flex flex-col items-center justify-center gap-2">
        <span className="material-symbols-outlined text-3xl text-on-surface-variant">account_balance_wallet</span>
        <h3 className="text-sm font-bold text-on-surface">No Escrow Vaults Found</h3>
        <p className="text-xs text-on-surface-variant">Try adjusting your filter or search query.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {vaults.map((vault) => (
        <VaultCard key={vault.id} vault={vault} />
      ))}
    </div>
  );
};
