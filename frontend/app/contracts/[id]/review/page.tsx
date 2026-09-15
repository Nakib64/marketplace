import { Metadata } from 'next';
import { MilestoneReviewView } from '@/features/contracts/components/MilestoneReviewView';

interface MilestoneReviewPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: MilestoneReviewPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Review Milestone • Contract #${id} | Banglance`,
    description: 'Review submitted work deliverables and authorize milestone payment release.',
  };
}

export default async function MilestoneReviewPage({ params }: MilestoneReviewPageProps) {
  const { id } = await params;
  return <MilestoneReviewView contractId={id} />;
}
