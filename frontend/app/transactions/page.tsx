import { Metadata } from 'next';
import { TransactionsLedgerView } from '@/features/transactions/components/TransactionsLedgerView';

export const metadata: Metadata = {
  title: 'Cryptographic Transaction Ledger & Proofs | Banglance Treasury',
  description: 'Auditable on-chain ledger with zero-knowledge verification receipts, IPFS audit hashes, and institutional accounting export.',
};

export default function TransactionsPage() {
  return <TransactionsLedgerView />;
}
