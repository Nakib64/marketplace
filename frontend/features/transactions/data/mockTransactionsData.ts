import { LedgerTransaction, TransactionsMetrics } from '../types/transactionTypes';

export const INITIAL_TX_METRICS: TransactionsMetrics = {
  totalSettledUsdc: 0,
  settledCount: 0,
  disputesCount: 0,
  gasSavedUsd: 0,
  gaslessRelayCount: 0,
  pendingMempoolCount: 0,
  pendingBlockNumber: 0,
  ipfsPinnedPct: 100,
  totalPinnedCount: 0,
};

export const INITIAL_TRANSACTIONS: LedgerTransaction[] = [];
