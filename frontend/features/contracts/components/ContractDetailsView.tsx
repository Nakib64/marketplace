'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft, Star } from 'lucide-react';
import { toast } from 'sonner';
import { ContractDetail, WorkSubmissionPayload, ReviewResponse, mapBackendContract } from '../types/contractsTypes';
import { contractsApi } from '../api/contractsApi';
import { ContractDetailsHeader } from './ContractDetailsHeader';
import { ContractOverviewCard } from './ContractOverviewCard';
import { ContractMilestoneTimeline } from './ContractMilestoneTimeline';
import { ContractWorkSubmissionForm } from './ContractWorkSubmissionForm';
import { ContractAuditTrailCard } from './ContractAuditTrailCard';
import { ContractVaultSidebar } from './ContractVaultSidebar';
import { ContractExtensionModal } from './ContractExtensionModal';
import { DoubleBlindReviewModal } from './DoubleBlindReviewModal';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/Button';

interface ContractDetailsViewProps {
  contractId: string;
}

export const ContractDetailsView: React.FC<ContractDetailsViewProps> = ({ contractId }) => {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const fetchReviews = () => {
    contractsApi.getContractReviews(contractId)
      .then((data) => {
        if (Array.isArray(data)) setReviews(data);
      })
      .catch(() => setReviews([]));
  };

  useEffect(() => {
    let isMounted = true;
    contractsApi.getContract(contractId)
      .then((data) => {
        if (isMounted && data) {
          setContract(mapBackendContract(data));
        }
      })
      .catch(() => {
        if (isMounted) setContract(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    fetchReviews();
    return () => { isMounted = false; };
  }, [contractId]);

  const handleWorkSubmit = async (payload: WorkSubmissionPayload) => {
    setIsSubmitting(true);
    try {
      await contractsApi.submitWork(contractId, payload);
      setContract((prev) => (prev ? { ...prev, status: 'PENDING_APPROVAL' } : null));
      toast.success('Milestone deliverables submitted successfully! Hirer notified.');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to submit milestone deliverable.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl animate-pulse space-y-6">
          <div className="h-10 bg-surface-container rounded-lg w-1/3" />
          <div className="h-64 bg-surface-container rounded-2xl" />
        </div>
      </main>
    );
  }

  if (!contract) {
    return (
      <main className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-primary mb-4 border border-outline-variant/30">
          <FileText className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Contract Not Found</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          The requested contract workspace could not be located or you do not have permission to view it.
        </p>
        <Link href="/wallet">
          <Button variant="primary" className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Escrow Vaults</span>
          </Button>
        </Link>
      </main>
    );
  }

  const isClient = user?.id === contract.clientId || user?.role === 'CLIENT';

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <ContractDetailsHeader
          contractId={contract.id}
          contractAddress={contract.contractAddress}
          title={contract.title}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <ContractOverviewCard contract={contract} />
            <ContractMilestoneTimeline milestones={contract.milestones} />
            
            {contract.status === 'COMPLETED' ? (
              <div className="flex flex-col gap-4">
                <div className="bg-surface-container-low border border-primary/30 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-[28px]">verified</span>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">Contract Successfully Completed</h3>
                      <p className="text-xs text-on-surface-variant">All project milestone funds have been completed and released.</p>
                    </div>
                  </div>
                  {!reviews.some((r) => r.reviewerId === user?.id) ? (
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">rate_review</span>
                      <span>Submit Double-Blind Review</span>
                    </button>
                  ) : !(reviews.length >= 2 && reviews.every((r) => r.status === 'PUBLISHED')) ? (
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                      <span className="material-symbols-outlined text-[16px]">lock</span>
                      <span>Your Review is Sealed (Awaiting Counterpart)</span>
                    </div>
                  ) : null}
                </div>

                {reviews.length >= 2 && reviews.every((r) => r.status === 'PUBLISHED') && (
                  <div className="bg-surface-container-low border border-emerald-500/30 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
                    <div className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                      <div className="flex items-center gap-2.5">
                        <span className="material-symbols-outlined text-emerald-500 text-[22px]">verified_user</span>
                        <div>
                          <h4 className="text-sm font-bold text-on-surface">Double-Blind Reviews Published</h4>
                          <p className="text-[11px] text-on-surface-variant">Both parties completed reviews independently. Ratings and feedback are unsealed with zero retaliation.</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
                        Mutual 5.0 ★
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {reviews.map((rev) => {
                        const isReviewerClient = rev.reviewerId === contract.clientId;
                        return (
                          <div key={rev.id} className="bg-surface-container p-4 rounded-xl border border-outline-variant/30 flex flex-col justify-between gap-3">
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-on-surface">
                                  {isReviewerClient ? 'Client Review (Hirer)' : 'Freelancer Review (Talent)'}
                                </span>
                                <div className="flex items-center gap-0.5">
                                  {[...Array(rev.rating)].map((_, i) => (
                                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  ))}
                                </div>
                              </div>
                              <p className="text-xs text-on-surface-variant italic leading-relaxed">
                                &ldquo;{rev.feedback}&rdquo;
                              </p>
                            </div>
                            <div className="text-[10px] text-on-surface-variant/70 pt-2 border-t border-outline-variant/10 flex items-center justify-between">
                              <span>Verified Double-Blind Feedback</span>
                              <span>Published</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : contract.status === 'PENDING_APPROVAL' ? (
              isClient ? (
                /* Client inspection & approval action card */
                <div className="bg-surface-container-low border-2 border-primary/40 rounded-2xl p-6 shadow-md flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3.5">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0 border border-primary/20">
                        <span className="material-symbols-outlined text-[28px]">fact_check</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-on-surface">Milestone Deliverables Submitted for Review</h3>
                          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">Action Required</span>
                        </div>
                        <p className="text-xs text-on-surface-variant leading-relaxed">
                          The freelancer has completed the work deliverables and submitted them for inspection. Please review the deliverable files and release the protected escrow payment.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-outline-variant/20">
                    <div className="flex items-center gap-2 text-xs text-on-surface-variant">
                      <span className="material-symbols-outlined text-primary text-[16px]">schedule</span>
                      <span>48h Review SLA Window active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/contracts/${contract.id}/review`}
                        className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold transition-all flex items-center gap-2 shadow-md cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[16px]">verified</span>
                        <span>Review Deliverables &amp; Release Payment</span>
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                /* Freelancer waiting state */
                <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">hourglass_top</span>
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-on-surface">Deliverables Submitted — Awaiting Hirer Approval</h3>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Your deliverable has been handed over to the client for inspection. Funds will be credited directly to your wallet upon client approval.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-outline-variant/20">
                    <button
                      type="button"
                      onClick={() => router.push(`/messages?contractId=${contract.id}`)}
                      className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/30 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[15px] text-primary">chat</span>
                      <span>Message Hirer</span>
                    </button>
                  </div>
                </div>
              )
            ) : contract.status === 'DISPUTED' ? (
              <div className="bg-surface-container-low border border-amber-500/30 rounded-2xl p-6 shadow-sm flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-amber-500 text-[26px]">gavel</span>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Contract Under Dispute Resolution</h3>
                    <p className="text-xs text-on-surface-variant">Arbitration has been initiated. Support administrators are reviewing contract deliverables.</p>
                  </div>
                </div>
              </div>
            ) : isClient ? (
              /* Client in-progress waiting state */
              <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-[22px]">motion_photos_on</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-on-surface">Freelancer is Actively Working</h3>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold">100% Escrow Protected</span>
                      </div>
                      <p className="text-xs text-on-surface-variant mt-1 leading-relaxed">
                        Funds are safely held in escrow. You will be notified immediately when the freelancer submits the milestone deliverable for your review.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => router.push(`/messages?contractId=${contract.id}`)}
                    className="px-3.5 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/30 shrink-0 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px] text-primary">chat</span>
                    <span>Open Workroom Chat</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Freelancer active work submission form */
              <ContractWorkSubmissionForm
                onSubmit={handleWorkSubmit}
                onRequestExtension={() => setIsExtensionModalOpen(true)}
                isSubmitting={isSubmitting}
              />
            )}

            <ContractAuditTrailCard />
          </div>

          <aside className="lg:col-span-4 sticky top-20">
            <ContractVaultSidebar
              contract={contract}
              onMessageHirer={() => router.push(`/messages?contractId=${contract.id}`)}
            />
          </aside>
        </div>
      </div>

      <ContractExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        onSubmit={(days, reason) => {
          toast.success(`Extension proposal submitted: +${days} days (${reason})`);
        }}
      />

      <DoubleBlindReviewModal
        isOpen={isReviewModalOpen}
        contractId={contract.id}
        counterPartyName={isClient ? 'the freelancer' : contract.clientName}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={fetchReviews}
      />
    </main>
  );
};
