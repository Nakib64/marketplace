import { Metadata } from 'next';
import { EscrowVaultsView } from '@/features/wallet/components/EscrowVaultsView';

export const metadata: Metadata = {
  title: 'Payments & Balance Protection | Banglance',
  description: 'Manage project payments, account balances, and protected funds securely on Banglance.',
};

export default function WalletPage() {
  return <EscrowVaultsView />;
}
