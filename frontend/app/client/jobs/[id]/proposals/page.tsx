import { Metadata } from 'next';
import { ProposalEvaluationView } from '@/features/proposals/components/ProposalEvaluationView';

interface ProposalsPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: ProposalsPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Candidate Proposals & Bid Matrix | Banglance Escrow`,
    description: `Evaluate candidate bids, verifiable credentials, milestone delivery schedules, and multi-sig escrow arbitration for job ${id}.`,
  };
}

export default async function ClientJobProposalsPage({ params }: ProposalsPageProps) {
  const { id } = await params;
  return <ProposalEvaluationView jobId={id} />;
}
