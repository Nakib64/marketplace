'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { contractsApi } from '../api/contractsApi';
import { ContractDetail, mapBackendContract } from '../types/contractsTypes';
import { MilestoneReviewHeader } from './MilestoneReviewHeader';
import { MilestoneContributorCard } from './MilestoneContributorCard';
import { MilestoneArtifactsInspectionCard } from './MilestoneArtifactsInspectionCard';
import { MilestoneHandoverNotesCard } from './MilestoneHandoverNotesCard';
import { MilestoneSecurityReportCard } from './MilestoneSecurityReportCard';
import { MilestoneEscrowReleaseSidebar } from './MilestoneEscrowReleaseSidebar';
import { DeliverableRevisionModal } from './DeliverableRevisionModal';
import { DoubleBlindReviewModal } from './DoubleBlindReviewModal';
import { Button } from '@/components/ui/Button';

interface MilestoneReviewViewProps {
  contractId: string;
}

export const MilestoneReviewView: React.FC<MilestoneReviewViewProps> = ({ contractId }) => {
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    contractsApi.getContract(contractId)
      .then((data) => {
        if (isMounted && data) setContract(mapBackendContract(data));
      })
      .catch(() => {
        if (isMounted) setContract(null);
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });
    return () => { isMounted = false; };
  }, [contractId]);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await contractsApi.approveWork(contractId);
      setContract((prev) => (prev ? { ...prev, status: 'COMPLETED' } : null));
      toast.success('Milestone approved! Payment released to freelancer.');
      setIsReviewModalOpen(true);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to approve milestone.';
      toast.error(msg);
    } finally {
      setIsApproving(false);
    }
  };

  const handleDispute = async () => {
    try {
      await contractsApi.disputeContract(contractId);
      setContract((prev) => (prev ? { ...prev, status: 'DISPUTED' } : null));
      toast.info('Resolution request opened. Support team notified.');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to open dispute.';
      toast.error(msg);
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
        <h1 className="text-2xl font-bold text-on-surface mb-2">Milestone Review Not Found</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          The requested milestone review could not be found or has already been completed.
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

  const amount = contract.amount ?? 0;
  const currency = contract.currency ?? 'BDT';

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MilestoneReviewHeader
          contractId={contractId}
          contractAddress={contract.contractAddress}
          milestoneTitle={contract.title}
          amount={amount}
          currency={currency}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <MilestoneContributorCard
              scopeTitle={contract.title}
              amount={amount}
              currency={currency}
              contributorName={contract.freelancerName || 'Freelancer'}
              onCopyHash={(hash) => toast.info(`Reference ${hash.slice(0, 8)}... copied`)}
            />
            <MilestoneArtifactsInspectionCard
              onCopyCid={(cid) => toast.info(`CID ${cid.slice(0, 10)}... copied`)}
            />
            <MilestoneHandoverNotesCard notes={contract.scopeOfWork} />
            <MilestoneSecurityReportCard />
          </div>

          <aside className="lg:col-span-4 sticky top-20">
            <MilestoneEscrowReleaseSidebar
              amount={amount}
              currency={currency}
              isApproving={isApproving}
              onApprove={handleApprove}
              onRequestChanges={() => setIsRevisionModalOpen(true)}
              onDispute={handleDispute}
            />
          </aside>
        </div>
      </div>

      <DeliverableRevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onSubmit={(feedback) => {
          toast.info(`Revision feedback logged: "${feedback.slice(0, 30)}..."`);
        }}
      />

      <DoubleBlindReviewModal
        isOpen={isReviewModalOpen}
        contractId={contractId}
        counterPartyName={contract.freelancerName || 'Freelancer'}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </main>
  );
};
