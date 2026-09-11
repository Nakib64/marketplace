'use client';

import React, { useState, useEffect } from 'react';
import { DisputeCaseDetail, DisputeMetrics } from '../types/disputesTypes';
import { disputesApi } from '../api/disputesApi';
import { DEFAULT_DISPUTE_CASE, INITIAL_DISPUTE_METRICS } from '../data/mockDisputesData';
import { DisputeHeaderBanner } from './DisputeHeaderBanner';
import { DisputeKpiGrid } from './DisputeKpiGrid';
import { DisputeCaseDossierCard } from './DisputeCaseDossierCard';
import { DisputeLifecycleStepper } from './DisputeLifecycleStepper';
import { DisputeEvidenceVault } from './DisputeEvidenceVault';
import { DisputeJurorCommitStatus } from './DisputeJurorCommitStatus';
import { DisputeEconomicsSidebar } from './DisputeEconomicsSidebar';
import { SubmitEvidenceModal } from './SubmitEvidenceModal';
import { NewDisputeModal } from './NewDisputeModal';

interface DisputeCenterViewProps {
  disputeId?: string;
}

export const DisputeCenterView: React.FC<DisputeCenterViewProps> = ({ disputeId = '1488' }) => {
  const [metrics, setMetrics] = useState<DisputeMetrics>(INITIAL_DISPUTE_METRICS);
  const [caseDetail, setCaseDetail] = useState<DisputeCaseDetail>(DEFAULT_DISPUTE_CASE);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isNewDisputeModalOpen, setIsNewDisputeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    disputesApi.getMetrics().then(setMetrics);
    disputesApi.getCase(disputeId).then(setCaseDetail);
  }, [disputeId]);

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-surface-container-high border border-primary/40 px-4 py-2.5 rounded-lg shadow-xl text-xs font-mono text-on-surface animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-[1440px]">
        <DisputeHeaderBanner onInitiateDispute={() => setIsNewDisputeModalOpen(true)} />
        <DisputeKpiGrid metrics={metrics} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 flex flex-col gap-6">
            <DisputeCaseDossierCard caseDetail={caseDetail} />
            <DisputeLifecycleStepper currentStep={caseDetail.lifecycleStep} />
            <DisputeEvidenceVault
              evidences={caseDetail.evidences}
              onSubmitEvidence={() => setIsEvidenceModalOpen(true)}
            />
            <DisputeJurorCommitStatus jurors={caseDetail.jurors} />
          </div>

          <div className="lg:col-span-4 sticky top-20">
            <DisputeEconomicsSidebar
              caseDetail={caseDetail}
              onProposeSettlement={async () => {
                await disputesApi.proposeSettlement(caseDetail.id, 50);
                showToast('Mutual 50/50 settlement proposed to counterparty.');
              }}
            />
          </div>
        </div>
      </div>

      <SubmitEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        onSubmit={async (title, ipfsCid) => {
          await disputesApi.submitEvidence(caseDetail.id, { title, ipfsCid });
          setCaseDetail((prev) => ({
            ...prev,
            evidences: [
              ...prev.evidences,
              {
                id: `ev-${Date.now()}`,
                title,
                evidenceNumber: prev.evidences.length + 1,
                ipfsCid,
                pinnedBy: 'Kroma Labs DAO (Hirer)',
                pinnedRole: 'Hirer',
                verifiedHash: 'Keccak-256 Validated',
                type: 'audit',
              },
            ],
          }));
          showToast(`Evidence pinned to IPFS CID ${ipfsCid.slice(0, 10)}...`);
        }}
      />

      <NewDisputeModal
        isOpen={isNewDisputeModalOpen}
        onClose={() => setIsNewDisputeModalOpen(false)}
        onSubmit={async (data) => {
          showToast(`Arbitration case initiated for contract ${data.contractAddress}`);
        }}
      />
    </main>
  );
};
