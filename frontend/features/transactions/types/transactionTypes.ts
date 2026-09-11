export type TxType =
  | 'ALL'
  | 'MILESTONE_RELEASE'
  | 'ESCROW_DEPOSIT'
  | 'YIELD_HARVEST'
  | 'SETTLEMENT_COMPLETE'
  | 'INITIAL_FUNDING';

export interface LedgerTransaction {
  id: string;
  txHash: string;
  timestamp: string;
  blockNumber: number;
  type: TxType;
  typeLabel: string;
  typeIcon: string;
  contractTitle: string;
  counterparty: string;
  counterpartyAddress: string;
  amount: number;
  isCredit?: boolean;
  currency: string;
  network: string;
  gasCostText: string;
  status: 'SETTLED' | 'PENDING' | 'DISPUTED';
  ipfsReceiptCid: string;
  merkleRoot: string;
}

export interface TransactionsMetrics {
  totalSettledUsdc: number;
  settledCount: number;
  disputesCount: number;
  gasSavedUsd: number;
  gaslessRelayCount: number;
  pendingMempoolCount: number;
  pendingBlockNumber: number;
  ipfsPinnedPct: number;
  totalPinnedCount: number;
}
