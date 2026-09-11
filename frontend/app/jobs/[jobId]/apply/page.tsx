import { Metadata } from 'next';
import { SubmitProposalView } from '@/features/proposals/components/SubmitProposalView';

interface ApplyPageProps {
  params: Promise<{ jobId: string }>;
}

export async function generateMetadata({ params }: ApplyPageProps): Promise<Metadata> {
  const { jobId } = await params;
  return {
    title: `Submit Proposal & Escrow Terms | Banglance Escrow`,
    description: `Configure proposal terms, milestone escrow schedules, and technical blueprints for job ${jobId}.`,
  };
}

export default async function JobApplyPage({ params }: ApplyPageProps) {
  const { jobId } = await params;
  return <SubmitProposalView jobId={jobId} />;
}
