import { Metadata } from 'next';
import { ClientSettingsView } from '@/features/client/components/ClientSettingsView';

export const metadata: Metadata = {
  title: 'Client Organization Settings | Banglance Escrow',
  description: 'Manage hirer organization profile, legal billing details, multi-sig escrow safe, and verification attestations.',
};

export default function ClientSettingsPage() {
  return <ClientSettingsView />;
}
