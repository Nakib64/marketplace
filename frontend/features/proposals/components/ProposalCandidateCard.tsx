'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProposalItem } from '../types/proposalsTypes';
import { ProposalMilestoneList } from './ProposalMilestoneList';

interface ProposalCandidateCardProps {
  proposal: ProposalItem;
  onAccept: (proposalId: string) => void;
}

export const ProposalCandidateCard: React.FC<ProposalCandidateCardProps> = ({ proposal, onAccept }) => {
  const [shortlisted, setShortlisted] = useState(proposal.isShortlisted ?? false);

  return (
    <div className="bg-surface-container border border-outline-variant/30 p-5 rounded-xl flex flex-col gap-4 relative overflow-hidden shadow-lg transition-all">
      {proposal.fitScore >= 95 && <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />}

      {/* Candidate Primary Details */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-outline-variant/40">
            <Image src={proposal.freelancerAvatar} alt={proposal.freelancerName} fill className="object-cover" />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-surface-container flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-primary ring-2 ring-surface-container" />
            </span>
          </div>
          <div className="min-w-0">
            <div className="flex items-center flex-wrap gap-2">
              <h3 className="text-base font-bold text-on-surface">{proposal.freelancerName}</h3>
              <span className="font-mono text-xs text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded">
                {proposal.freelancerHandle}
              </span>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface text-xs font-medium">
                {proposal.freelancerRole}
              </span>
              <span className="font-mono text-xs text-on-surface-variant">{proposal.sbtId}</span>
            </div>
            <p className="text-xs text-on-surface-variant mt-1 line-clamp-1">{proposal.bio}</p>
          </div>
        </div>

        {/* Fit score badge with circular gauge */}
        <div className="flex items-center gap-2.5 shrink-0 self-start bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-xl">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end font-mono text-xs text-primary font-bold">
              <span>{proposal.fitScore}%</span>
              <span className="material-symbols-outlined text-[15px]">verified</span>
            </div>
            <div className="text-[11px] text-on-surface-variant">Algorithmic Fit</div>
          </div>
          <svg className="w-8 h-8 -rotate-90" viewBox="0 0 36 36">
            <path className="text-surface-container-high" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3.5" />
            <path className="text-primary" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeDasharray={`${proposal.fitScore}, 100`} strokeLinecap="round" strokeWidth="3.5" />
          </svg>
        </div>
      </div>

      {/* Proposal Commercials Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-surface-container-low p-3 rounded-xl border border-outline-variant/20">
        <div>
          <div className="text-xs text-on-surface-variant">Total Bid</div>
          <div className="text-base font-bold text-on-surface mt-0.5 font-mono">${proposal.bidAmount.toLocaleString()} USDC</div>
          <div className="font-mono text-[11px] text-primary mt-0.5">{proposal.budgetComparison}</div>
        </div>
        <div>
          <div className="text-xs text-on-surface-variant">Estimated Delivery</div>
          <div className="text-base font-bold text-on-surface mt-0.5 font-mono">{proposal.durationWeeks} Weeks</div>
          <div className="font-mono text-[11px] text-on-surface-variant mt-0.5">{proposal.deliveryDate}</div>
        </div>
        <div>
          <div className="text-xs text-on-surface-variant">Milestones</div>
          <div className="text-base font-bold text-on-surface mt-0.5 font-mono">{proposal.milestoneCount} Phases</div>
          <div className="font-mono text-[11px] text-on-surface-variant mt-0.5">100% Escrow Backed</div>
        </div>
        <div>
          <div className="text-xs text-on-surface-variant">Arbitration Clause</div>
          <div className="text-base font-bold text-on-surface mt-0.5 font-mono">{proposal.arbitration}</div>
          <div className="font-mono text-[11px] text-secondary mt-0.5">Court {proposal.courtId}</div>
        </div>
      </div>

      {/* Milestones Schedule */}
      <ProposalMilestoneList milestones={proposal.milestones} />

      {/* Proposal Note Quote */}
      <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
        <div className="flex items-center gap-1 text-on-surface-variant text-xs mb-1">
          <span className="material-symbols-outlined text-[14px]">format_quote</span>
          <span>Proposal Note:</span>
        </div>
        <p className="text-xs text-on-surface-variant italic">&quot;{proposal.coverLetter}&quot;</p>
      </div>

      {/* Action Strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/30">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => alert(`Starting encrypted workroom with ${proposal.freelancerHandle}...`)} className="px-3.5 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors text-xs font-semibold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">chat</span>
            <span>Message &amp; Schedule</span>
          </button>
          <button type="button" onClick={() => setShortlisted(!shortlisted)} className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors text-xs font-semibold flex items-center gap-1.5">
            <span className={`material-symbols-outlined text-[16px] ${shortlisted ? 'text-primary' : 'text-on-surface-variant'}`}>bookmark</span>
            <span>{shortlisted ? 'Shortlisted' : 'Shortlist'}</span>
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => onAccept(proposal.id)} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary transition-all text-xs font-bold flex items-center gap-1.5 shadow-md">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            <span>Accept Bid &amp; Fund Escrow</span>
          </button>
        </div>
      </div>
    </div>
  );
};
