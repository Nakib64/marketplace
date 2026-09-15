import { DisputeCaseDetail, DisputeMetrics } from '../types/disputesTypes';

export const INITIAL_DISPUTE_METRICS: DisputeMetrics = {
  activeCount: 0,
  resolvedCount: 0,
  totalDisputedUsdc: 0,
  avgTurnaroundDays: 0,
};

export const DEFAULT_DISPUTE_CASE: DisputeCaseDetail = {
  id: '',
  docketId: '',
  caseNumber: '',
  subcourtName: '',
  roundText: '',
  title: '',
  description: '',
  contractTitle: '',
  auditPhase: '',
  hirerName: '',
  hirerAddress: '',
  contractorName: '',
  contractorAddress: '',
  claimedValue: 0,
  currency: 'BDT',
  frozenVaultAddress: '',
  status: 'EVIDENCE',
  lifecycleStep: 1,
  jurorRewardEth: 0,
  jurorRewardUsd: 0,
  surchargeUsdc: 0,
  pnkPerJuror: 0,
  jurors: [],
  evidences: [],
};
