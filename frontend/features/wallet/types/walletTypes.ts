export type VaultStatus = 'ALL' | 'ACTIVE' | 'PENDING_RELEASE' | 'SETTLED' | 'DISPUTED';

export interface EscrowVaultItem {
  id: string;
  rfpNumber: string;
  title: string;
  contributorName: string;
  contributorEns: string;
  contributorRole: string;
  contributorAvatarText: string;
  vaultAddress: string;
  escrowHash: string;
  totalLocked: number;
  currency: string;
  status: 'ACTION_REQUIRED' | 'IN_REVIEW' | 'ACTIVE_SPRINT' | 'SETTLED';
  statusBadgeText: string;
  milestoneCompletedText: string;
  milestoneProgressPct: number;
  milestoneDetailText: string;
  multisigSignedText: string;
  multisigProgressPct: number;
  multisigDetailText: string;
  slaGraceRemainingText?: string;
  yieldAccruedText?: string;
  network: string;
  disbursedDate?: string;
}

export interface VaultKpiMetrics {
  tvl: number;
  tvlGrowthPct: number;
  bufferAmount: number;
  pendingReleaseCount: number;
  pendingReleaseAmount: number;
  avgSettleHours: number;
  onTimeSlaPct: number;
  openDisputesCount: number;
  collateralSecurityPct: number;
}
