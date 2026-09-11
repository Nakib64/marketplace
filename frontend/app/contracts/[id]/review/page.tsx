import { Metadata } from 'next';
import { MilestoneReviewView } from '@/features/contracts/components/MilestoneReviewView';

interface MilestoneReviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MilestoneReviewPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Review Milestone • Contract #${id} | Banglance Escrow`,
    description: 'Cryptographic milestone review, automated fuzz test auditing, and multisig escrow release authorization.',
  };
}

export default async function MilestoneReviewPage({ params }: MilestoneReviewPageProps) {
  const { id } = await params;
  return <MilestoneReviewView contractId={id} />;
}
