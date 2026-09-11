import { Metadata } from 'next';
import { DisputeCenterView } from '@/features/disputes/components/DisputeCenterView';

interface DisputeCasePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: DisputeCasePageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Dispute Case #${id} | Banglance Kleros Court`,
    description: 'Decentralized arbitration dossier, juror voting status, and cryptographic evidence vault.',
  };
}

export default async function DisputeCasePage({ params }: DisputeCasePageProps) {
  const { id } = await params;
  return <DisputeCenterView disputeId={id} />;
}
