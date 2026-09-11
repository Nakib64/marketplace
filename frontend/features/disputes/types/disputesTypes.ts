export interface DisputeEvidenceItem {
  id: string;
  title: string;
  evidenceNumber: number;
  ipfsCid: string;
  pinnedBy: string;
  pinnedRole: 'Hirer' | 'Contractor' | 'Protocol';
  verifiedHash: string;
  type: 'audit' | 'memo' | 'spec' | 'code';
}

export interface DisputeJurorCommit {
  jurorNumber: number;
  status: 'COMMITTED' | 'AWAITING';
  hash?: string;
  stakePnk: number;
  timeRemaining?: string;
}

export interface DisputeCaseDetail {
  id: string;
  docketId: string;
  caseNumber: string;
  subcourtName: string;
  roundText: string;
  title: string;
  description: string;
  contractTitle: string;
  auditPhase: string;
  hirerName: string;
  hirerAddress: string;
  contractorName: string;
  contractorAddress: string;
  claimedValue: number;
  currency: string;
  frozenVaultAddress: string;
  status: 'EVIDENCE' | 'VOTING' | 'APPEAL' | 'RESOLVED';
  lifecycleStep: number;
  jurors: DisputeJurorCommit[];
  evidences: DisputeEvidenceItem[];
  jurorRewardEth: number;
  jurorRewardUsd: number;
  surchargeUsdc: number;
  pnkPerJuror: number;
}

export interface DisputeMetrics {
  activeCount: number;
  resolvedCount: number;
  totalDisputedUsdc: number;
  avgTurnaroundDays: number;
}
