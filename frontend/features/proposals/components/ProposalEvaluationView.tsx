'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { proposalsApi } from '../api/proposalsApi';
import { ProposalItem } from '../types/proposalsTypes';
import { ProposalHeaderTelemetry } from './ProposalHeaderTelemetry';
import { ProposalFilterStrip } from './ProposalFilterStrip';
import { ProposalCandidateCard } from './ProposalCandidateCard';
import { ProposalEscrowSummaryWidget } from './ProposalEscrowSummaryWidget';
import { ProposalBenchmarkMatrixWidget } from './ProposalBenchmarkMatrixWidget';
import { ProposalMultisigVaultStatus } from './ProposalMultisigVaultStatus';

interface RawProposal {
  id: string;
  jobId: string;
  freelancerId: string;
  bidAmount: number | string;
  coverLetter: string;
  status: string;
  createdAt: string;
  freelancer?: {
    email?: string;
    freelancerProfile?: {
      title?: string;
      rating?: number;
      description?: string;
      avatarUrl?: string;
    };
  };
}

function mapBackendProposal(raw: RawProposal): ProposalItem {
  const profile = raw.freelancer?.freelancerProfile;
  const name = raw.freelancer?.email?.split('@')[0] || 'Talent Candidate';
  const amount = Number(raw.bidAmount) || 0;
  return {
    id: raw.id,
    jobId: raw.jobId,
    freelancerId: raw.freelancerId,
    freelancerName: name,
    freelancerHandle: `@${name.toLowerCase()}`,
    freelancerAvatar: profile?.avatarUrl || '',
    freelancerRole: profile?.title || 'Verified Specialist',
    sbtId: `SBT #${raw.freelancerId.slice(0, 4)}`,
    bio: profile?.description || 'Experienced specialist with verified platform track record.',
    fitScore: profile?.rating ? Math.round(profile.rating * 20) : 95,
    bidAmount: amount,
    currency: 'BDT',
    budgetComparison: 'Competitive bid',
    durationWeeks: 3,
    deliveryDate: new Date(Date.now() + 21 * 24 * 3600 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    milestoneCount: 2,
    arbitration: 'Kleros Core',
    courtId: '#32',
    coverLetter: raw.coverLetter,
    isShortlisted: raw.status === 'ACCEPTED',
    credentials: [],
    milestones: [
      { step: 'M1', title: 'Initial Milestone Sprint', durationDays: 7, amount: Math.round(amount * 0.4), currency: 'BDT' },
      { step: 'M2', title: 'Final Delivery & Acceptance', durationDays: 14, amount: Math.round(amount * 0.6), currency: 'BDT' },
    ],
    createdAt: raw.createdAt,
    status: (raw.status as ProposalItem['status']) || 'PENDING',
  };
}

export const ProposalEvaluationView: React.FC<{ jobId: string }> = ({ jobId }) => {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [seniority, setSeniority] = useState('ALL');
  const [hasCertikFilter, setHasCertikFilter] = useState(false);

  const { data: job } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getJobDetails(jobId).catch(() => null),
  });

  const { data: rawProposals = [], isLoading } = useQuery({
    queryKey: ['job-proposals', jobId],
    queryFn: () => proposalsApi.getJobProposals(jobId).catch(() => []),
  });

  const handleAccept = async (proposalId: string) => {
    try {
      const res = await proposalsApi.acceptProposal(proposalId);
      if (res.paymentRequired && res.gatewayUrl) {
        toast.info('Redirecting to SSLCommerz Secure Payment Gateway...');
        window.location.href = res.gatewayUrl;
      } else if (res.contract) {
        toast.success('Proposal accepted! Protected payment funded from wallet balance.');
        router.push(`/contracts/${res.contract.id}`);
      } else {
        toast.success('Proposal accepted successfully!');
        router.push('/client/jobs');
      }
    } catch (err: unknown) {
      let msg = 'Failed to accept proposal. Please ensure you have sufficient balance or gateway access.';
      if (isAxiosError<{ message?: string | string[] }>(err) && err.response?.data?.message) {
        const serverMsg = err.response.data.message;
        msg = Array.isArray(serverMsg) ? serverMsg[0] : serverMsg;
      }
      toast.error(msg);
    }
  };

  const proposals: ProposalItem[] = (rawProposals as unknown as RawProposal[]).map(mapBackendProposal);

  const filtered = proposals.filter((p) => {
    if (search && !p.freelancerName.toLowerCase().includes(search.toLowerCase()) && !p.freelancerHandle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCopyJobLink = () => {
    const publicSlug = job?.slug || jobId;
    const url = `${window.location.origin}/jobs/${publicSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('Job link copied to clipboard! Share it with candidates to receive proposals.');
  };

  return (
    <div className="w-full bg-background min-h-screen py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
        <ProposalHeaderTelemetry jobId={jobId} jobTitle={job?.title} budget={job?.budget} totalProposals={proposals.length} />
        
        {proposals.length > 0 && (
          <ProposalFilterStrip search={search} onSearchChange={setSearch} seniority={seniority} onSeniorityChange={setSeniority} hasCertikFilter={hasCertikFilter} onToggleCertik={() => setHasCertikFilter(!hasCertikFilter)} />
        )}

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          <div className="xl:col-span-8 flex flex-col gap-6 min-w-0">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="bg-surface-container border border-outline-variant/30 p-6 rounded-2xl animate-pulse h-48" />
                ))}
              </div>
            ) : proposals.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-10 flex flex-col items-center justify-center text-center gap-4 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[36px]">assignment_ind</span>
                </div>
                <div className="flex flex-col gap-1 max-w-md">
                  <h3 className="text-lg font-bold text-on-surface">No Proposals Received Yet</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed">
                    Freelancers are currently discovering this project. You can share your job listing link to invite targeted talent directly.
                  </p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCopyJobLink}
                    className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    <span>Copy Job Link</span>
                  </button>
                  <Link
                    href={`/jobs/${job?.slug || jobId}`}
                    target="_blank"
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                  >
                    <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                    <span>View Public Listing</span>
                  </Link>
                </div>
              </div>
            ) : filtered.length === 0 ? (
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-8 flex flex-col items-center justify-center text-center gap-2">
                <span className="material-symbols-outlined text-[28px] text-on-surface-variant">search_off</span>
                <span className="text-xs text-on-surface-variant">No proposals match your search criteria.</span>
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="mt-2 px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-on-surface"
                >
                  Clear Search
                </button>
              </div>
            ) : (
              filtered.map((item) => (
                <ProposalCandidateCard key={item.id} proposal={item} onAccept={handleAccept} />
              ))
            )}
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6 xl:sticky xl:top-20">
            <ProposalEscrowSummaryWidget budget={job?.budget} proposals={proposals} />
            <ProposalBenchmarkMatrixWidget proposals={proposals} />
            <ProposalMultisigVaultStatus />
          </div>
        </div>
      </div>
    </div>
  );
};
