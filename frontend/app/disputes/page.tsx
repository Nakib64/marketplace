import { Metadata } from 'next';
import { DisputeCenterView } from '@/features/disputes/components/DisputeCenterView';

export const metadata: Metadata = {
  title: 'Kleros Dispute Resolution Center | Banglance Arbitration',
  description: 'Non-custodial decentralized court powered by Kleros ERC-792 jurors, cryptographic evidence vaults, and Schelling consensus.',
};

export default function DisputesPage() {
  return <DisputeCenterView />;
}
