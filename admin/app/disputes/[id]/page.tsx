import type { Metadata } from 'next';
import { DisputeDetailPageClient } from '@/components/disputes/DisputeDetailPageClient';

export const metadata: Metadata = {
  title: 'Dispute Arbitration Dossier | Banglance Command Center',
  description: 'Evidence inspection, workroom chat log, and binding dispute resolution.',
};

export default async function AdminDisputeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <DisputeDetailPageClient id={id} />;
}
