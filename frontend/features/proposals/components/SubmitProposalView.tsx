'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { proposalsApi } from '../api/proposalsApi';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { ProposalMilestone } from '../types/proposalsTypes';
import { SubmitProposalHeader } from './SubmitProposalHeader';
import { SubmitProposalJobSnapshot } from './SubmitProposalJobSnapshot';
import { SubmitProposalTermsSection } from './SubmitProposalTermsSection';
import { SubmitProposalCoverLetterSection } from './SubmitProposalCoverLetterSection';
import { SubmitProposalMilestonesSection } from './SubmitProposalMilestonesSection';
import { SubmitProposalSidebar } from './SubmitProposalSidebar';

const DEFAULT_COVER = `### Project Approach & Execution Plan

**1. Technical Architecture & Setup**
I will design the core module structure, database schema, and configure clean API interfaces.

**2. Feature Implementation & Automated Testing**
- Implement complete business logic with comprehensive unit tests and automated CI checks.

**3. Deployment & Final Quality Assurance**
- Production-ready deployment, verified security standards, and documentation.`;

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
    { step: 'M1', title: 'Architecture Specification & Setup', durationDays: 5, amount: 2500, currency: 'BDT' },
    { step: 'M2', title: 'Core Implementation & Test Suite', durationDays: 9, amount: 3500, currency: 'BDT' },
    { step: 'M3', title: 'Production Deployment & Handoff', durationDays: 7, amount: 2500, currency: 'BDT' },
  ]);

  const handleSubmit = async () => {
    if (!agreedToArbitration) {
      toast.error('Please agree to the marketplace terms and payment protection policy.');
      return;
    }
    if (coverLetter.length < 30) {
      toast.error('Please provide at least 30 characters in your technical proposal.');
      return;
    }
    setIsSubmitting(true);
    try {
      await proposalsApi.submitProposal(jobId, { bidAmount, duration: durationWeeks, coverLetter });
      toast.success('Proposal submitted successfully!');
      router.push(`/jobs/${jobId}`);
    } catch (err: unknown) {
      let msg = 'Failed to submit proposal. Please ensure you are logged in as a freelancer with a verified email.';
      if (isAxiosError<{ message?: string | string[] }>(err) && err.response?.data?.message) {
        const serverMsg = err.response.data.message;
        msg = Array.isArray(serverMsg) ? serverMsg[0] : serverMsg;
      }
      toast.error(msg);
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
            <SubmitProposalMilestonesSection milestones={milestones} onAddMilestone={() => setMilestones((prev) => [...prev, { step: `M${prev.length + 1}`, title: 'Additional Milestone Sprint', durationDays: 5, amount: 1000, currency: 'BDT' }])} onRemoveMilestone={(idx) => setMilestones((prev) => prev.filter((_, i) => i !== idx))} totalBid={bidAmount} />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 shadow-sm">
              <div className="flex items-center gap-2 text-on-surface-variant text-xs">
                <span className="material-symbols-outlined text-primary text-[18px]">verified_user</span>
                <span className="text-on-surface font-medium">Verified Freelancer Account</span>
              </div>
              <button type="button" disabled={isSubmitting} onClick={handleSubmit} className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md">
                <span>{isSubmitting ? 'Submitting...' : 'Submit Proposal'}</span>
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
