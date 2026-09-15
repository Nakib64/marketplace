import { apiClient } from '@/lib/api/apiClient';
import { LedgerTransaction, TransactionsMetrics } from '../types/transactionTypes';
import { contractsApi } from '@/features/contracts/api/contractsApi';

export const transactionsApi = {
  /**
   * Fetch transaction ledger metrics
   */
  async getMetrics(): Promise<TransactionsMetrics> {
    try {
      const { data } = await apiClient.get<TransactionsMetrics>('/transactions/metrics');
      return data;
    } catch {
      const contracts = await contractsApi.getUserContracts().catch(() => []);
      const completed = contracts.filter((c) => c.status === 'COMPLETED');
      const totalSettled = completed.reduce((sum, c) => sum + Number(c.amount || 0), 0);
      const disputes = contracts.filter((c) => c.status === 'DISPUTED').length;

      return {
        totalSettledUsdc: totalSettled,
        settledCount: completed.length,
        disputesCount: disputes,
        gasSavedUsd: 0,
        gaslessRelayCount: completed.length,
        pendingMempoolCount: contracts.filter((c) => c.status === 'PENDING_APPROVAL').length,
        pendingBlockNumber: 0,
        ipfsPinnedPct: 100,
        totalPinnedCount: contracts.length,
      };
    }
  },

  /**
   * Fetch paginated transactions
   */
  async getTransactions(): Promise<LedgerTransaction[]> {
    try {
      const { data } = await apiClient.get<LedgerTransaction[]>('/transactions');
      if (Array.isArray(data)) return data;
      return [];
    } catch {
      const contracts = await contractsApi.getUserContracts().catch(() => []);
      if (!contracts || contracts.length === 0) return [];

      return contracts.map((c, idx) => {
        const isCompleted = c.status === 'COMPLETED';
        return {
          id: `tx-${c.id || idx}`,
          txHash: c.contractAddress || `0x${(c.id || '').replace(/-/g, '').padEnd(64, '0')}`,
          timestamp: 'Recent',
          blockNumber: 1000 + idx,
          type: isCompleted ? 'SETTLEMENT_COMPLETE' : 'ESCROW_DEPOSIT',
          typeLabel: isCompleted ? 'Settled & Completed' : 'Escrow Deposit',
          typeIcon: isCompleted ? 'verified' : 'lock',
          contractTitle: c.title || 'Escrow Contract',
          counterparty: c.clientName || 'Counterparty',
          counterpartyAddress: c.clientName || 'Counterparty',
          amount: Number(c.amount || 0),
          isCredit: isCompleted,
          currency: c.currency || 'BDT',
          network: 'Banglance Escrow',
          gasCostText: 'Fee: 0%',
          status: isCompleted ? 'SETTLED' : 'PENDING',
          ipfsReceiptCid: '',
          merkleRoot: '',
        };
      });
    }
  },

  /**
   * Trigger CSV export download
   */
  async exportIrsCsv(): Promise<void> {
    const txs = await this.getTransactions();
    const csvContent =
      'data:text/csv;charset=utf-8,TxHash,Timestamp,Type,Amount,Currency,Network,Status\n' +
      txs.map((t) => `${t.txHash},${t.timestamp},${t.type},${t.amount},${t.currency},${t.network},${t.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'banglance_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
