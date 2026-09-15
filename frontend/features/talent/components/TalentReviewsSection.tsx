import React from 'react';
import { Star, ShieldCheck, Check } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentReviewsSectionProps {
  profile: FreelancerProfile;
}

export function TalentReviewsSection({ profile }: TalentReviewsSectionProps) {
  const rating = Number(profile.rating || 5.0);
  const reviewCount = profile.totalReviews || 0;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Client Reviews &amp; Ratings</h2>
        </div>
        <div className="flex items-center gap-1 text-on-surface font-bold text-lg">
          <Star className="w-4 h-4 text-primary fill-primary" />
          <span>{rating.toFixed(1)}</span>
          <span className="text-xs text-on-surface-variant font-normal">({reviewCount} reviews)</span>
        </div>
      </div>

      {reviewCount === 0 ? (
        <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-2">
          <Star className="w-8 h-8 text-on-surface-variant/40" />
          <h3 className="text-sm font-bold text-on-surface">No Client Reviews Yet</h3>
          <p className="text-xs text-on-surface-variant max-w-sm">
            This freelancer is ready for their first contract on Banglance. All milestone payments are protected in escrow.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-surface-container-low border border-outline-variant/20 flex items-center justify-between">
            <span className="text-xs text-on-surface font-semibold">Verified Client Rating</span>
            <div className="flex items-center gap-1 text-xs text-primary font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>{rating.toFixed(1)} / 5.0</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
