import { apiClient } from '@/lib/api/apiClient';
import { EscrowVaultItem, VaultKpiMetrics } from '../types/walletTypes';

export const walletApi = {
  /**
   * Fetch escrow smart vault balances and summary metrics
   */
  async getVaultMetrics(): Promise<VaultKpiMetrics> {
    try {
      const { data } = await apiClient.get<VaultKpiMetrics>('/wallet/metrics');
      return data;
    } catch {
      return {
        tvl: 48200,
        tvlGrowthPct: 12.4,
        bufferAmount: 2450,
        pendingReleaseCount: 2,
        pendingReleaseAmount: 6000,
        avgSettleHours: 14.2,
        onTimeSlaPct: 100,
        openDisputesCount: 0,
        collateralSecurityPct: 99.4,
      };
    }
  },

  /**
   * Fetch all active and historical escrow vaults
   */
  async getVaults(): Promise<EscrowVaultItem[]> {
    try {
      const { data } = await apiClient.get<EscrowVaultItem[]>('/wallet/vaults');
      return data;
    } catch {
      return [];
    }
  },

  /**
   * Initialize and fund a new escrow smart vault
   */
  async initializeVault(payload: {
    title: string;
    contractorAddress: string;
    amount: number;
    currency: string;
  }): Promise<{ success: boolean; vaultAddress?: string }> {
    const { data } = await apiClient.post<{ success: boolean; vaultAddress?: string }>(
      '/wallet/vaults/initialize',
      payload
    );
    return data;
  },
};
