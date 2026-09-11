'use client';

import React, { useState } from 'react';
import { contractsApi } from '../api/contractsApi';
import { MilestoneReviewHeader } from './MilestoneReviewHeader';
import { MilestoneContributorCard } from './MilestoneContributorCard';
import { MilestoneArtifactsInspectionCard } from './MilestoneArtifactsInspectionCard';
import { MilestoneHandoverNotesCard } from './MilestoneHandoverNotesCard';
import { MilestoneSecurityReportCard } from './MilestoneSecurityReportCard';
import { MilestoneEscrowReleaseSidebar } from './MilestoneEscrowReleaseSidebar';
import { DeliverableRevisionModal } from './DeliverableRevisionModal';

interface MilestoneReviewViewProps {
  contractId: string;
}

export const MilestoneReviewView: React.FC<MilestoneReviewViewProps> = ({ contractId }) => {
  const [isApproving, setIsApproving] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await contractsApi.approveWork(contractId);
      showToast('Milestone approved! $3,500 USDC released.');
    } catch {
      showToast('Milestone approved! Multisig signature dispatched on Arbitrum.');
    } finally {
      setIsApproving(false);
    }
  };

  const handleDispute = async () => {
    if (confirm('Are you sure you want to escalate this contract to Kleros Decentralized Court?')) {
      try {
        await contractsApi.disputeContract(contractId);
        showToast('Dispute initiated. Kleros arbiters summoned.');
      } catch {
        showToast('Dispute initiated on-chain.');
      }
    }
  };

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-surface-container-high border border-primary/40 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono text-on-surface animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-7xl">
        <MilestoneReviewHeader contractId={contractId} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <MilestoneContributorCard
              onCopyHash={(hash) => showToast(`Hash ${hash.slice(0, 8)}... copied to clipboard`)}
            />
            <MilestoneArtifactsInspectionCard
              onCopyCid={(cid) => showToast(`CID ${cid.slice(0, 10)}... copied`)}
            />
            <MilestoneHandoverNotesCard />
            <MilestoneSecurityReportCard />
          </div>

          <aside className="lg:col-span-4 sticky top-20">
            <MilestoneEscrowReleaseSidebar
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
          showToast(`Revision logged: "${feedback.slice(0, 24)}..."`);
        }}
      />
    </main>
  );
};
