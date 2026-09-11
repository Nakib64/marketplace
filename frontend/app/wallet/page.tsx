import { Metadata } from 'next';
import { EscrowVaultsView } from '@/features/wallet/components/EscrowVaultsView';

export const metadata: Metadata = {
  title: 'Escrow Smart Vault Balances & Multi-Sig Safe | Banglance',
  description: 'Autonomous non-custodial multi-sig smart vaults, locked milestone capital, and real-time yield accrual.',
};

export default function WalletPage() {
  return <EscrowVaultsView />;
}
