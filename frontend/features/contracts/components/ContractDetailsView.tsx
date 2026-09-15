'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { ContractDetail, WorkSubmissionPayload, mapBackendContract } from '../types/contractsTypes';
import { contractsApi } from '../api/contractsApi';
import { ContractDetailsHeader } from './ContractDetailsHeader';
import { ContractOverviewCard } from './ContractOverviewCard';
import { ContractMilestoneTimeline } from './ContractMilestoneTimeline';
import { ContractWorkSubmissionForm } from './ContractWorkSubmissionForm';
import { ContractAuditTrailCard } from './ContractAuditTrailCard';
import { ContractVaultSidebar } from './ContractVaultSidebar';
import { ContractExtensionModal } from './ContractExtensionModal';
import { DoubleBlindReviewModal } from './DoubleBlindReviewModal';
import { Button } from '@/components/ui/Button';

interface ContractDetailsViewProps {
  contractId: string;
}

export const ContractDetailsView: React.FC<ContractDetailsViewProps> = ({ contractId }) => {
  const router = useRouter();
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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
              <div className="bg-surface-container-low border border-primary/30 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-[28px]">verified</span>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">Contract Successfully Completed</h3>
                    <p className="text-xs text-on-surface-variant">All project milestone funds have been completed and released.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">rate_review</span>
                  <span>Submit Double-Blind Review</span>
                </button>
              </div>
            ) : (
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
              onMessageHirer={() => router.push('/messages')}
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
        counterPartyName={contract.clientName}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </main>
  );
};
