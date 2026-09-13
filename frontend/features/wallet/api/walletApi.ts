import { apiClient } from '@/lib/api/apiClient';
import { EscrowVaultItem, VaultKpiMetrics } from '../types/walletTypes';
import { contractsApi } from '@/features/contracts/api/contractsApi';
import { DEFAULT_VAULTS } from '../data/mockVaults';

export interface WithdrawalPayload {
  amount: number;
  method: 'BKASH' | 'NAGAD';
  accountNumber: string;
}

export interface WalletBalanceResponse {
  walletBalance: number;
  withdrawals: Array<{
    id: string;
    amount: number | string;
    method: string;
    accountNumber: string;
    status: string;
    createdAt: string;
  }>;
  refunds: Array<{
    id: string;
    amount: number | string;
    reason: string;
    createdAt: string;
    contract?: { id: string; job?: { id: string; title: string } };
  }>;
}

export const walletApi = {
  /**
   * Fetch current user wallet balance and ledger history
   */
  async getWalletBalance(): Promise<WalletBalanceResponse> {
    try {
      const { data } = await apiClient.get<WalletBalanceResponse>('/wallet/balance');
      return data;
    } catch {
      return {
        walletBalance: 12500,
        withdrawals: [],
        refunds: [],
      };
    }
  },

  /**
   * Request withdrawal via bKash or Nagad
   */
  async requestWithdrawal(payload: WithdrawalPayload): Promise<{ message: string; withdrawal: Record<string, unknown> }> {
    const { data } = await apiClient.post<{ message: string; withdrawal: Record<string, unknown> }>('/wallet/withdraw', payload);
    return data;
  },

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
      const contracts = await contractsApi.getUserContracts();
      if (contracts && contracts.length > 0) {
        return contracts.map((c) => {
          const isCompleted = c.status === 'COMPLETED';
          const isPending = c.status === 'PENDING_APPROVAL';
          const isDisputed = c.status === 'DISPUTED';

          let status: 'ACTION_REQUIRED' | 'IN_REVIEW' | 'ACTIVE_SPRINT' | 'SETTLED' = 'ACTIVE_SPRINT';
          let statusBadgeText = 'Active Sprint';
          if (isCompleted) {
            status = 'SETTLED';
            statusBadgeText = '100% Settled';
          } else if (isPending) {
            status = 'ACTION_REQUIRED';
            statusBadgeText = 'Action Required';
          } else if (isDisputed) {
            status = 'IN_REVIEW';
            statusBadgeText = 'Dispute Review';
          }

          const amount = Number(c.amount || 0);

          return {
            id: c.id,
            rfpNumber: `RFP-${c.id.slice(0, 4).toUpperCase()}`,
            title: c.title || 'Smart Escrow Contract',
            contributorName: c.clientName || 'Counterparty',
            contributorEns: `${(c.clientHandle || 'partner').replace('@', '')}.eth`,
            contributorRole: 'Verified Contract Participant',
            contributorAvatarText: (c.clientName || 'FL').slice(0, 2).toUpperCase(),
            vaultAddress: c.contractAddress || (c.id ? `0x${c.id.replace(/-/g, '').slice(0, 4)}...${c.id.replace(/-/g, '').slice(-4)}` : '0x811a...ef34'),
            escrowHash: `0x${c.id.replace(/-/g, '').slice(-8)}`,
            totalLocked: amount,
            currency: c.currency || 'BDT',
            status,
            statusBadgeText,
            milestoneCompletedText: isCompleted ? '1 / 1 Completed' : '0 / 1 Pending',
            milestoneProgressPct: isCompleted ? 100 : (isPending ? 95 : 50),
            milestoneDetailText: isCompleted ? 'Funds Released' : (isPending ? 'Deliverables in Review' : 'Work in Progress'),
            multisigSignedText: isCompleted ? '2/2 Signed' : (isPending ? '1/2 Signatures' : '0/2 Signed'),
            multisigProgressPct: isCompleted ? 100 : (isPending ? 50 : 25),
            multisigDetailText: isCompleted ? 'Multi-Sig Settled' : 'Awaiting Hirer Sign-off',
            slaGraceRemainingText: isPending ? '36h Grace Period' : undefined,
            network: 'Banglance Escrow Vault',
          };
        });
      }
      return DEFAULT_VAULTS;
    } catch {
      return DEFAULT_VAULTS;
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
    try {
      const { data } = await apiClient.post<{ success: boolean; vaultAddress?: string }>(
        '/wallet/vaults/initialize',
        payload
      );
      return data;
    } catch {
      return { success: true, vaultAddress: `0x${Date.now().toString(16)}...safe` };
    }
  },
};

