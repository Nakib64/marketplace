import React from 'react';
import { Star, ShieldCheck, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentReviewsSectionProps {
  profile: FreelancerProfile;
}

const DEFAULT_REVIEWS = [
  {
    id: 'r1',
    clientName: 'Kroma Labs',
    initials: 'KL',
    escrowId: 'ES-88291',
    releasedAt: 'Dec 2024',
    rating: 5,
    amount: 12000,
    txHash: '0x9f18...39ac',
    feedback:
      'Delivered mathematically sound tick math algorithms ahead of schedule. Incredible EVM knowledge, zero gas waste, and thorough documentation for our audit team.',
  },
  {
    id: 'r2',
    clientName: 'Stader Labs',
    initials: 'SL',
    escrowId: 'ES-76104',
    releasedAt: 'Oct 2024',
    rating: 5,
    amount: 18500,
    txHash: '0x4a12...88dd',
    feedback:
      'Top-tier security insights and zero-slippage rebalancing algorithms. Handled external review comments with extreme velocity. A master of Solidity design patterns.',
  },
];

export function TalentReviewsSection({ profile }: TalentReviewsSectionProps) {
  const rating = profile.rating || 5.0;
  const reviewCount = profile.totalReviews || 38;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Client Reviews &amp; Escrow History</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Cryptographically released milestones recorded on platform escrow
          </p>
        </div>
        <div className="flex items-center gap-1 text-on-surface font-bold text-lg font-mono">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span>{rating.toFixed(1)}</span>
          <span className="text-xs text-on-surface-variant font-normal">({reviewCount} reviews)</span>
        </div>
      </div>

      <div className="space-y-4">
        {DEFAULT_REVIEWS.map((r) => (
          <div
            key={r.id}
            className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary font-mono">
                  {r.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-on-surface">{r.clientName}</h4>
                  <span className="text-xs font-mono text-on-surface-variant">
                    Escrow #{r.escrowId} • Released {r.releasedAt}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 text-primary fill-primary" />
                ))}
                <span className="text-xs font-bold font-mono text-on-surface ml-1">5.0</span>
              </div>
            </div>

            <p className="text-sm text-on-surface-variant leading-relaxed italic">
              &ldquo;{r.feedback}&rdquo;
            </p>

            <div className="pt-2 flex items-center justify-between flex-wrap gap-2 text-xs font-mono text-on-surface-variant border-t border-outline-variant/10">
              <span className="flex items-center gap-1.5 text-on-surface font-semibold">
                <Check className="w-3.5 h-3.5 text-primary" />
                Escrow: {formatCurrency(r.amount)} Completed
              </span>
              <span className="text-primary flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Tx: {r.txHash}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
