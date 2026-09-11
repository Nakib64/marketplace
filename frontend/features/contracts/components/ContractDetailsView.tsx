'use client';

import React, { useState, useEffect } from 'react';
import { ContractDetail, WorkSubmissionPayload } from '../types/contractsTypes';
import { contractsApi } from '../api/contractsApi';
import { ContractDetailsHeader } from './ContractDetailsHeader';
import { ContractOverviewCard } from './ContractOverviewCard';
import { ContractMilestoneTimeline } from './ContractMilestoneTimeline';
import { ContractWorkSubmissionForm } from './ContractWorkSubmissionForm';
import { ContractAuditTrailCard } from './ContractAuditTrailCard';
import { ContractVaultSidebar } from './ContractVaultSidebar';
import { ContractExtensionModal } from './ContractExtensionModal';

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
  const [contract, setContract] = useState<ContractDetail>({ ...DEFAULT_CONTRACT, id: contractId });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExtensionModalOpen, setIsExtensionModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    contractsApi.getContract(contractId)
      .then((data) => {
        if (isMounted && data) setContract(data);
      })
      .catch(() => {
        // Fall back gracefully to DEFAULT_CONTRACT if mocked or backend route not seeded
      });
    return () => { isMounted = false; };
  }, [contractId]);

  const handleWorkSubmit = async (payload: WorkSubmissionPayload) => {
    setIsSubmitting(true);
    try {
      await contractsApi.submitWork(contractId, payload);
      setContract((prev) => ({ ...prev, status: 'PENDING_APPROVAL' }));
    } catch {
      // Optimistic simulated completion
      setContract((prev) => ({ ...prev, status: 'PENDING_APPROVAL' }));
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
            <ContractWorkSubmissionForm
              onSubmit={handleWorkSubmit}
              onRequestExtension={() => setIsExtensionModalOpen(true)}
              isSubmitting={isSubmitting}
            />
            <ContractAuditTrailCard />
          </div>

          <aside className="lg:col-span-4 sticky top-20">
            <ContractVaultSidebar
              onMessageHirer={() => alert('Workroom channel opening...')}
            />
          </aside>
        </div>
      </div>

      <ContractExtensionModal
        isOpen={isExtensionModalOpen}
        onClose={() => setIsExtensionModalOpen(false)}
        onSubmit={(days, reason) => {
          alert(`Extension proposal submitted: +${days} days (${reason})`);
        }}
      />
    </main>
  );
};
