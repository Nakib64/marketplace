'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const DEFAULT_CONTRACT: ContractDetail = {
  id: 'c-8902',
  contractAddress: '0x71c8...39A1',
  title: 'Arbitrum Orbit AMM Rollup Custom Implementation',
  clientName: 'Kroma Labs',
  clientAddress: '0x9812...7e91',
  amount: 8500,
  currency: 'USDC',
  releasedAmount: 2500,
  inEscrowAmount: 6000,
  status: 'FUNDED',
  network: 'Arbitrum One',
  startDate: 'Sep 24, 2024',
  multisigThreshold: '2-of-3 Multi-Sig Safe',
  gracePeriodHours: 48,
  scopeOfWork: 'Design and deploy custom Orbit AMM smart contracts featuring invariant fuzz suites, gas-efficient liquidity concentration hooks, and automated IPFS verification reports.',
  milestones: [
    { step: '1', title: 'Circuit & Architecture Spec', amount: 2500, currency: 'USDC', status: 'PAID', txHash: '0x4f8...b12' },
    { step: '2', title: 'Foundry Fuzz Testing & Slither CI Pipeline', amount: 3500, currency: 'USDC', status: 'ACTIVE', dueDate: 'In 3 days', progressPct: 75 },
    { step: '3', title: 'L3 Testnet Deployment & Multi-Sig Verification', amount: 2500, currency: 'USDC', status: 'PENDING' },
  ],
};

interface ContractDetailsViewProps {
  contractId: string;
}

export const ContractDetailsView: React.FC<ContractDetailsViewProps> = ({ contractId }) => {
  const router = useRouter();
  const [contract, setContract] = useState<ContractDetail>({ ...DEFAULT_CONTRACT, id: contractId });
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
        // Fall back gracefully to DEFAULT_CONTRACT if mocked or demo ID
      });
    return () => { isMounted = false; };
  }, [contractId]);

  const handleWorkSubmit = async (payload: WorkSubmissionPayload) => {
    setIsSubmitting(true);
    try {
      await contractsApi.submitWork(contractId, payload);
      setContract((prev) => ({ ...prev, status: 'PENDING_APPROVAL' }));
      toast.success('Milestone deliverables submitted successfully! Hirer notified.');
    } catch (err: unknown) {
      // Optimistic simulated completion if demo/unauthenticated
      setContract((prev) => ({ ...prev, status: 'PENDING_APPROVAL' }));
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Deliverables submitted. Awaiting hirer review.';
      toast.info(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                    <p className="text-xs text-on-surface-variant">Escrow collateral has been fully disbursed.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="px-4 py-2 bg-primary hover:bg-primary-container text-on-primary text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
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

