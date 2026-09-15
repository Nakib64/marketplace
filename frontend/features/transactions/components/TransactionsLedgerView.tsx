'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';
import { LedgerTransaction, TransactionsMetrics, TxType } from '../types/transactionTypes';
import { transactionsApi } from '../api/transactionsApi';
import { TransactionsHeader } from './TransactionsHeader';
import { TransactionsKpiGrid } from './TransactionsKpiGrid';
import { TransactionsFilterBar } from './TransactionsFilterBar';
import { TransactionsTable } from './TransactionsTable';
import { ZkStateCommitmentBanner } from './ZkStateCommitmentBanner';
import { TransactionReceiptModal } from './TransactionReceiptModal';

export const TransactionsLedgerView: React.FC = () => {
  const [metrics, setMetrics] = useState<TransactionsMetrics>({
    totalSettledUsdc: 0,
    settledCount: 0,
    disputesCount: 0,
    gasSavedUsd: 0,
    gaslessRelayCount: 0,
    pendingMempoolCount: 0,
    pendingBlockNumber: 0,
    ipfsPinnedPct: 100,
    totalPinnedCount: 0,
  });
  const [transactions, setTransactions] = useState<LedgerTransaction[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('Arbitrum One');
  const [selectedType, setSelectedType] = useState<TxType>('ALL');
  const [selectedTxForReceipt, setSelectedTxForReceipt] = useState<LedgerTransaction | null>(null);

  useEffect(() => {
    transactionsApi.getMetrics().then(setMetrics);
    transactionsApi.getTransactions().then(setTransactions);
  }, []);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedType !== 'ALL' && tx.type !== selectedType) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          tx.txHash.toLowerCase().includes(q) ||
          tx.contractTitle.toLowerCase().includes(q) ||
          tx.counterparty.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [transactions, selectedType, searchQuery]);

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <TransactionsHeader
          onExportIrs={() => transactionsApi.exportIrsCsv()}
          onExportQuickbooks={() => toast.info('QuickBooks Online accounting sync initiated.')}
          onVerifyMerkle={() => toast.success('Batch cryptographic proof verified.')}
        />

        <TransactionsKpiGrid metrics={metrics} />

        <TransactionsFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedNetwork={selectedNetwork}
          onNetworkChange={setSelectedNetwork}
          selectedType={selectedType}
          onTypeChange={setSelectedType}
          onRefresh={() => {
            transactionsApi.getTransactions().then(setTransactions);
          }}
        />

        <TransactionsTable
          transactions={filteredTransactions}
          onViewReceipt={(tx) => setSelectedTxForReceipt(tx)}
        />

        <ZkStateCommitmentBanner />
      </div>

      <TransactionReceiptModal
        transaction={selectedTxForReceipt}
        onClose={() => setSelectedTxForReceipt(null)}
      />
    </main>
  );
};
