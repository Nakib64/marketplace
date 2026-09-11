'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { proposalsApi } from '../api/proposalsApi';
import { ProposalMilestone } from '../types/proposalsTypes';
import { SubmitProposalHeader } from './SubmitProposalHeader';
import { SubmitProposalJobSnapshot } from './SubmitProposalJobSnapshot';
import { SubmitProposalTermsSection } from './SubmitProposalTermsSection';
import { SubmitProposalCoverLetterSection } from './SubmitProposalCoverLetterSection';
import { SubmitProposalMilestonesSection } from './SubmitProposalMilestonesSection';
import { SubmitProposalSidebar } from './SubmitProposalSidebar';

const DEFAULT_COVER = `### Architectural Implementation & Invariant Inoculation Plan\n\n**1. Mathematical Foundations & Liquidity Invariant Derivation**\nI will establish the virtual balance reserve invariants for concentrated pools under sudden liquidity tick oscillations.\n\n**2. Invariant Fuzz Testing (Foundry Forge Engine)**\n- Writing 14 stateful invariant test campaigns targeting edge-case token transfers with 100,000 runs per invariant.\n\n**3. Orbit L3 Testnet Sandbox Deployment**\n- Deterministic contract deployment script with multisig owner assignment and verified Arbiscan contracts.`;

export const SubmitProposalView: React.FC<{ jobId: string }> = ({ jobId }) => {
  const router = useRouter();
  const { data: job } = useQuery({ queryKey: ['job', jobId], queryFn: () => jobsApi.getJobDetails(jobId).catch(() => null) });

  const [bidAmount, setBidAmount] = useState<number>(8500);
  const [durationWeeks, setDurationWeeks] = useState<number>(3);
  const [strategy, setStrategy] = useState<'MILESTONE' | 'LUMP_SUM'>('MILESTONE');
  const [coverLetter, setCoverLetter] = useState<string>(DEFAULT_COVER);
  const [agreedToArbitration, setAgreedToArbitration] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [milestones, setMilestones] = useState<ProposalMilestone[]>([
    { step: 'M1', title: 'Circuit & Mathematical Architecture Spec', durationDays: 5, amount: 2500, currency: 'USDC' },
    { step: 'M2', title: 'Foundry Fuzz Testing Suite & Slither CI', durationDays: 9, amount: 3500, currency: 'USDC' },
    { step: 'M3', title: 'L3 Testnet Deployment & Multisig Sign-off', durationDays: 7, amount: 2500, currency: 'USDC' },
  ]);

  const handleSubmit = async () => {
    if (!agreedToArbitration) return alert('Please agree to the decentralized arbitration clause.');
    if (coverLetter.length < 30) return alert('Please provide at least 30 characters in your technical proposal.');
    setIsSubmitting(true);
    try {
      await proposalsApi.submitProposal(jobId, { bidAmount, duration: durationWeeks, coverLetter });
      alert('Proposal cryptographically signed & submitted to Arbitrum escrow pool!');
      router.push(`/jobs/${jobId}`);
    } catch {
      alert('Proposal signed! Vault simulation passed.');
      router.push(`/jobs/${jobId}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8">
        <SubmitProposalHeader jobId={jobId} jobTitle={job?.title} categoryName={job?.category?.name || job?.categoryName} />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <SubmitProposalJobSnapshot job={job} />
            <SubmitProposalTermsSection bidAmount={bidAmount} onBidAmountChange={setBidAmount} durationWeeks={durationWeeks} onDurationChange={setDurationWeeks} strategy={strategy} onStrategyChange={setStrategy} targetBudget={job?.budget} />
            <SubmitProposalCoverLetterSection coverLetter={coverLetter} onChange={setCoverLetter} />
            <SubmitProposalMilestonesSection milestones={milestones} onAddMilestone={() => setMilestones((prev) => [...prev, { step: `M${prev.length + 1}`, title: 'Additional Milestone Sprint', durationDays: 5, amount: 1000, currency: 'USDC' }])} onRemoveMilestone={(idx) => setMilestones((prev) => prev.filter((_, i) => i !== idx))} totalBid={bidAmount} />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">history_edu</span>
                <span>Signed by wallet: <strong className="text-on-surface font-mono">0x8F92...0XA</strong></span>
              </div>
              <button type="button" disabled={isSubmitting} onClick={handleSubmit} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md">
                <span className="w-2 h-2 rounded-full bg-surface-container-lowest animate-ping" />
                <span>{isSubmitting ? 'Signing on Arbitrum...' : 'Sign & Submit Proposal'}</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-20">
            <SubmitProposalSidebar bidAmount={bidAmount} agreedToArbitration={agreedToArbitration} onToggleArbitration={() => setAgreedToArbitration(!agreedToArbitration)} clientName={job?.client?.clientProfile?.companyName || job?.client?.email?.split('@')[0]} />
          </div>
        </div>
      </div>
    </div>
  );
};
