'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { DisputeCaseDetail, DisputeMetrics } from '../types/disputesTypes';
import { disputesApi } from '../api/disputesApi';
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

export const DisputeCenterView: React.FC<DisputeCenterViewProps> = ({ disputeId }) => {
  const [metrics, setMetrics] = useState<DisputeMetrics>({
    activeCount: 0,
    resolvedCount: 0,
    totalDisputedUsdc: 0,
    avgTurnaroundDays: 0,
  });
  const [caseDetail, setCaseDetail] = useState<DisputeCaseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);
  const [isNewDisputeModalOpen, setIsNewDisputeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  useEffect(() => {
    disputesApi.getMetrics().then(setMetrics);
    if (disputeId) {
      disputesApi.getCase(disputeId).then((data) => {
        setCaseDetail(data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [disputeId]);

  return (
    <main className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 bg-surface-container-high border border-primary/40 px-4 py-2.5 rounded-lg shadow-xl text-xs text-on-surface animate-fade-in">
          <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="mx-auto max-w-[1440px]">
        <DisputeHeaderBanner onInitiateDispute={() => setIsNewDisputeModalOpen(true)} />
        <DisputeKpiGrid metrics={metrics} />

        {caseDetail ? (
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
        ) : !isLoading ? (
          <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl p-12 text-center flex flex-col items-center justify-center my-6">
            <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center mb-4 text-primary">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2">No Active Disputes</h3>
            <p className="text-xs text-on-surface-variant max-w-md">
              All contracts are in good standing. If an issue arises with milestone requirements or deliverables, a dispute can be initiated directly from the contract review workspace.
            </p>
          </div>
        ) : null}
      </div>

      {caseDetail && (
        <SubmitEvidenceModal
          isOpen={isEvidenceModalOpen}
          onClose={() => setIsEvidenceModalOpen(false)}
          onSubmit={async (title, ipfsCid) => {
            await disputesApi.submitEvidence(caseDetail.id, { title, ipfsCid });
            setCaseDetail((prev) =>
              prev
                ? {
                    ...prev,
                    evidences: [
                      ...prev.evidences,
                      {
                        id: `ev-${Date.now()}`,
                        title,
                        evidenceNumber: prev.evidences.length + 1,
                        ipfsCid,
                        pinnedBy: 'Participant',
                        pinnedRole: 'Hirer',
                        verifiedHash: 'Keccak-256 Validated',
                        type: 'audit',
                      },
                    ],
                  }
                : null
            );
            showToast(`Evidence pinned to IPFS CID ${ipfsCid.slice(0, 10)}...`);
          }}
        />
      )}

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
