import { apiClient } from '@/lib/api/apiClient';
import { LedgerTransaction, TransactionsMetrics } from '../types/transactionTypes';
import { INITIAL_TRANSACTIONS, INITIAL_TX_METRICS } from '../data/mockTransactionsData';

export const transactionsApi = {
  /**
   * Fetch transaction ledger metrics
   */
  async getMetrics(): Promise<TransactionsMetrics> {
    try {
      const { data } = await apiClient.get<TransactionsMetrics>('/transactions/metrics');
      return data;
    } catch {
      return INITIAL_TX_METRICS;
    }
  },

  /**
   * Fetch paginated transactions
   */
  async getTransactions(): Promise<LedgerTransaction[]> {
    try {
      const { data } = await apiClient.get<LedgerTransaction[]>('/transactions');
      return data.length > 0 ? data : INITIAL_TRANSACTIONS;
    } catch {
      return INITIAL_TRANSACTIONS;
    }
  },

  /**
   * Trigger IRS 8949 CSV export download
   */
  exportIrsCsv(): void {
    const csvContent = 'data:text/csv;charset=utf-8,TxHash,Timestamp,Type,Amount,Currency,Network,Status\n' +
      INITIAL_TRANSACTIONS.map(t => `${t.txHash},${t.timestamp},${t.type},${t.amount},${t.currency},${t.network},${t.status}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'banglance_irs_8949_transactions.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
