'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';
import { EscrowVaultItem, VaultKpiMetrics, VaultStatus } from '../types/walletTypes';
import { walletApi } from '../api/walletApi';
import { DEFAULT_VAULTS } from '../data/mockVaults';
import { VaultHeaderTelemetry } from './VaultHeaderTelemetry';
import { VaultKpiGrid } from './VaultKpiGrid';
import { VaultFilterStrip } from './VaultFilterStrip';
import { VaultList } from './VaultList';
import { MultiSigGovernanceSafeCard } from './MultiSigGovernanceSafeCard';
import { EscrowYieldSweepCard } from './EscrowYieldSweepCard';
import { DisputeCourtShieldCard } from './DisputeCourtShieldCard';
import { InitializeVaultModal } from './InitializeVaultModal';
import { WithdrawalModal } from './WithdrawalModal';

export const EscrowVaultsView: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const [walletBalance, setWalletBalance] = useState(12500);
  const [metrics, setMetrics] = useState<VaultKpiMetrics>({
    tvl: 48200,
    tvlGrowthPct: 12.4,
    bufferAmount: 2450,
    pendingReleaseCount: 2,
    pendingReleaseAmount: 6000,
    avgSettleHours: 14.2,
    onTimeSlaPct: 100,
    openDisputesCount: 0,
    collateralSecurityPct: 99.4,
  });
  const [vaults, setVaults] = useState<EscrowVaultItem[]>(DEFAULT_VAULTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<VaultStatus>('ALL');
  const [selectedChain, setSelectedChain] = useState('Arbitrum One');
  const [isInitModalOpen, setIsInitModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);

  useEffect(() => {
    walletApi.getVaultMetrics().then(setMetrics);
    walletApi.getVaults().then((data) => {
      if (data && data.length > 0) setVaults(data);
    });
    walletApi.getWalletBalance().then((res) => {
      if (res?.walletBalance !== undefined) setWalletBalance(res.walletBalance);
    });
  }, []);

  const filteredVaults = useMemo(() => {
    return vaults.filter((v) => {
      if (statusFilter === 'PENDING_RELEASE' && v.status !== 'ACTION_REQUIRED' && v.status !== 'IN_REVIEW') return false;
      if (statusFilter === 'ACTIVE' && v.status !== 'ACTIVE_SPRINT') return false;
      if (statusFilter === 'SETTLED' && v.status !== 'SETTLED') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return v.title.toLowerCase().includes(q) || v.vaultAddress.toLowerCase().includes(q) || v.contributorName.toLowerCase().includes(q);
      }
      return true;
    });
  }, [vaults, statusFilter, searchQuery]);

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <VaultHeaderTelemetry
          onInitializeVault={() => setIsInitModalOpen(true)}
          onExportCsv={() => toast.success('Settlement CSV exported successfully.')}
        />

        {user?.role === 'FREELANCER' && (
          <div className="mb-6 p-4 rounded-xl bg-surface-container border border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[28px]">payments</span>
              <div>
                <h3 className="text-sm font-bold text-on-surface">Freelancer Available Balance</h3>
                <p className="text-xs text-on-surface-variant font-mono">
                  ৳{walletBalance.toLocaleString()} BDT available for instantaneous payout
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsWithdrawModalOpen(true)}
              className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span className="material-symbols-outlined text-[16px]">south_west</span>
              <span>Withdraw via bKash / Nagad</span>
            </button>
          </div>
        )}

        <VaultKpiGrid metrics={metrics} />
        <VaultFilterStrip
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          selectedChain={selectedChain}
          onChainChange={setSelectedChain}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <VaultList vaults={filteredVaults} />
          </div>
          <aside className="lg:col-span-4 flex flex-col gap-5 sticky top-20">
            <MultiSigGovernanceSafeCard />
            <EscrowYieldSweepCard />
            <DisputeCourtShieldCard />
          </aside>
        </div>
      </div>

      <InitializeVaultModal
        isOpen={isInitModalOpen}
        onClose={() => setIsInitModalOpen(false)}
        onSubmit={async (payload) => {
          await walletApi.initializeVault(payload);
          toast.success(`Smart Vault initialized for ${payload.title} with $${payload.amount} ${payload.currency}`);
        }}
      />

      <WithdrawalModal
        isOpen={isWithdrawModalOpen}
        walletBalance={walletBalance}
        onClose={() => setIsWithdrawModalOpen(false)}
        onSuccess={() => {
          walletApi.getWalletBalance().then((res) => {
            if (res?.walletBalance !== undefined) setWalletBalance(res.walletBalance);
          });
        }}
      />
    </main>
  );
};

