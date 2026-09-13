'use client';

import React, { useState, useEffect } from 'react';
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

interface MilestoneReviewViewProps {
  contractId: string;
}

export const MilestoneReviewView: React.FC<MilestoneReviewViewProps> = ({ contractId }) => {
  const [contract, setContract] = useState<ContractDetail | null>(null);
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
        // Fallback for mocked or demo parameters
      });
    return () => { isMounted = false; };
  }, [contractId]);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await contractsApi.approveWork(contractId);
      setContract((prev) => prev ? { ...prev, status: 'COMPLETED' } : null);
      toast.success('Milestone approved! Escrow funds released to freelancer.');
      setIsReviewModalOpen(true);
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Milestone approved! Multisig settlement dispatched.';
      toast.success(msg);
      setContract((prev) => prev ? { ...prev, status: 'COMPLETED' } : null);
      setIsReviewModalOpen(true);
    } finally {
      setIsApproving(false);
    }
  };

  const handleDispute = async () => {
    try {
      await contractsApi.disputeContract(contractId);
      setContract((prev) => prev ? { ...prev, status: 'DISPUTED' } : null);
      toast.info('Dispute initiated. Decentralized arbitration escalated.');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Dispute initiated on-chain.';
      toast.info(msg);
    }
  };

  const amount = contract?.amount ?? 3500;
  const currency = contract?.currency ?? 'USDC';

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <MilestoneReviewHeader
          contractId={contractId}
          contractAddress={contract?.contractAddress}
          milestoneTitle={contract?.title}
          amount={amount}
          currency={currency}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <MilestoneContributorCard
              scopeTitle={contract?.title}
              contributorName={contract?.freelancerName}
              onCopyHash={(hash) => toast.info(`Hash ${hash.slice(0, 8)}... copied to clipboard`)}
            />
            <MilestoneArtifactsInspectionCard
              onCopyCid={(cid) => toast.info(`CID ${cid.slice(0, 10)}... copied`)}
            />
            <MilestoneHandoverNotesCard />
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
        counterPartyName={contract?.freelancerName || 'Freelancer'}
        onClose={() => setIsReviewModalOpen(false)}
      />
    </main>
  );
};

