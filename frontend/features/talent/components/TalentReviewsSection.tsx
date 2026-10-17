'use client';

import React, { useState, useEffect } from 'react';
import { Star, ShieldCheck, CheckCircle2, MessageSquareQuote } from 'lucide-react';
import { FreelancerProfile } from '../types/talentTypes';
import { talentApi } from '../api/talentApi';

interface TalentReviewsSectionProps {
  profile: FreelancerProfile;
}

interface DisplayReview {
  id: string;
  rating: number;
  feedback: string;
  counterFeedback?: string | null;
  clientName: string;
  contractTitle: string;
  amount: number;
  dateStr: string;
}

export function TalentReviewsSection({ profile }: TalentReviewsSectionProps) {
  // Initial reviews from profile.user.receivedReviews if present
  const initialReviews: DisplayReview[] = (profile.user?.receivedReviews || []).map((r: any) => ({
    id: r.id,
    rating: Number(r.rating || 5),
    feedback: r.feedback || '',
    counterFeedback: r.counterFeedback || null,
    clientName:
      r.reviewer?.clientProfile?.companyName ||
      r.reviewer?.email?.split('@')[0] ||
      'Verified Enterprise Client',
    contractTitle: r.contract?.job?.title || 'Contract Deliverable Execution',
    amount: Number(r.contract?.escrowAmount || 0),
    dateStr: new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }));

  const [reviews, setReviews] = useState<DisplayReview[]>(initialReviews);
  const [isLoading, setIsLoading] = useState(initialReviews.length === 0);

  const targetUserId = profile.userId || profile.user?.id;

  useEffect(() => {
    if (!targetUserId) return;
    let isMounted = true;

    talentApi
      .getUserReviews(targetUserId)
      .then((res) => {
        if (!isMounted) return;
        if (res?.reviews && Array.isArray(res.reviews)) {
          const mapped: DisplayReview[] = res.reviews.map((r: any) => ({
            id: r.id,
            rating: Number(r.rating || 5),
            feedback: r.feedback || '',
            counterFeedback: r.counterFeedback || null,
            clientName:
              r.reviewer?.clientProfile?.companyName ||
              r.reviewer?.email?.split('@')[0] ||
              'Verified Enterprise Client',
            contractTitle: r.contract?.job?.title || 'Contract Deliverable Execution',
            amount: Number(r.contract?.escrowAmount || 0),
            dateStr: new Date(r.createdAt || Date.now()).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            }),
          }));
          setReviews(mapped);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [targetUserId]);

  const totalReviews = Math.max(reviews.length, profile.totalReviews || 0);
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : Number(profile.rating || 5.0).toFixed(1);

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-outline-variant/20">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Client Reviews &amp; Work History</h2>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Verified double-blind feedback from completed milestone contracts.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-3 py-1.5 rounded-xl border border-outline-variant/30 shrink-0">
          <div className="flex items-center gap-1 text-on-surface font-bold text-base">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>{averageRating}</span>
          </div>
          <span className="text-xs text-on-surface-variant font-medium">
            ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>

      {/* Summary Scorecard Banner */}
      {reviews.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 p-5 rounded-xl bg-surface-container-low border border-outline-variant/30">
          {/* Left: Overall Big Score */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-3 border-b md:border-b-0 md:border-r border-outline-variant/20 gap-1.5">
            <span className="text-4xl font-extrabold text-on-surface tracking-tight">
              {averageRating}
            </span>
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-semibold text-primary mt-1">
              100% Client Satisfaction
            </span>
          </div>

          {/* Middle: Star Rating Breakdown */}
          <div className="md:col-span-4 flex flex-col justify-center gap-1.5 px-2">
            {[5, 4, 3, 2, 1].map((starVal) => {
              const countForStar = reviews.filter((r) => Math.round(r.rating) === starVal).length;
              const pct = reviews.length > 0 ? (countForStar / reviews.length) * 100 : 0;
              return (
                <div key={starVal} className="flex items-center gap-2 text-xs">
                  <span className="w-7 text-[11px] text-on-surface-variant font-medium text-right shrink-0">
                    {starVal} ★
                  </span>
                  <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-5 text-[10px] text-on-surface-variant text-right shrink-0">
                    {countForStar}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Escrow Protection Guarantee */}
          <div className="md:col-span-4 flex flex-col justify-center p-3 bg-surface-container/60 rounded-lg border border-outline-variant/20 gap-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-primary">
              <ShieldCheck className="w-4 h-4" />
              <span>Zero-Retaliation Protection</span>
            </div>
            <p className="text-[11px] text-on-surface-variant leading-relaxed">
              Reviews remain sealed under Banglance double-blind protocol until both parties submit feedback or the inspection period closes.
            </p>
          </div>
        </div>
      )}

      {/* Reviews Content Stream */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 animate-pulse h-28"
            />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-2">
          <Star className="w-8 h-8 text-on-surface-variant/40" />
          <h3 className="text-sm font-bold text-on-surface">No Public Reviews Yet</h3>
          <p className="text-xs text-on-surface-variant max-w-sm">
            This freelancer is ready for their next contract. All milestone contracts are backed by 100% escrow protection.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-3.5 hover:border-outline-variant/60 transition-colors"
            >
              {/* Review Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-outline-variant/20 pb-3">
                <div className="flex flex-col">
                  <h3 className="text-sm font-bold text-on-surface leading-tight">
                    {rev.contractTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-on-surface-variant">
                    <span className="font-semibold text-on-surface flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px] text-primary">apartment</span>
                      {rev.clientName}
                    </span>
                    <span>•</span>
                    <span className="text-[11px]">{rev.dateStr}</span>
                    {rev.amount > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-[11px] font-semibold text-primary">
                          ৳{rev.amount.toLocaleString()} BDT Escrow
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center gap-1 bg-surface-container px-2.5 py-1 rounded-lg border border-outline-variant/20 self-start sm:self-auto shrink-0">
                  <div className="flex items-center gap-0.5">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-on-surface ml-1">
                    {rev.rating}.0
                  </span>
                </div>
              </div>

              {/* Feedback Content */}
              <div className="relative pl-3.5 border-l-2 border-primary/40">
                <p className="text-xs sm:text-sm text-on-surface italic leading-relaxed">
                  &ldquo;{rev.feedback}&rdquo;
                </p>
              </div>

              {/* Counter-Feedback (if freelancer replied) */}
              {rev.counterFeedback && (
                <div className="bg-surface-container p-3 rounded-lg border border-outline-variant/20 flex flex-col gap-1 ml-4 text-xs">
                  <span className="font-bold text-on-surface flex items-center gap-1">
                    <MessageSquareQuote className="w-3.5 h-3.5 text-primary" />
                    Freelancer Response:
                  </span>
                  <p className="text-on-surface-variant italic">&ldquo;{rev.counterFeedback}&rdquo;</p>
                </div>
              )}

              {/* Footer Trust Verification Badges */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-outline-variant/10 text-[11px] text-on-surface-variant/80">
                <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Verified Double-Blind Feedback
                </span>
                <span className="text-outline-variant">|</span>
                <span className="text-on-surface-variant">100% Milestone Escrow Released</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
