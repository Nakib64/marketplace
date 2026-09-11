'use client';

import React from 'react';
import { DisputeEvidenceItem } from '../types/disputesTypes';

interface DisputeEvidenceVaultProps {
  evidences: DisputeEvidenceItem[];
  onSubmitEvidence: () => void;
}

export const DisputeEvidenceVault: React.FC<DisputeEvidenceVaultProps> = ({
  evidences,
  onSubmitEvidence,
}) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[20px]">folder_special</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-on-surface">Cryptographic Evidence Vault</h3>
            <span className="text-[11px] text-on-surface-variant">Immutable submissions anchored to Merkle proof tree</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onSubmitEvidence}
          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all self-start sm:self-auto border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[15px] text-primary">add_circle</span>
          <span>Submit Evidence (IPFS)</span>
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        {evidences.map((ev) => (
          <div
            key={ev.id}
            className="bg-surface-container-low rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 border border-outline-variant/20"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5 text-primary">
                <span className="material-symbols-outlined text-[18px]">
                  {ev.type === 'audit' ? 'bug_report' : ev.type === 'memo' ? 'terminal' : 'description'}
                </span>
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-on-surface truncate">{ev.title}</span>
                  <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-mono text-[10px]">
                    Evidence #{ev.evidenceNumber}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant font-mono text-[10px] mt-1 flex-wrap">
                  <span>CID: <strong className="text-on-surface">{ev.ipfsCid}</strong></span>
                  <span>•</span>
                  <span>By: {ev.pinnedBy}</span>
                  <span>•</span>
                  <span className="text-primary flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[12px]">lock_reset</span> {ev.verifiedHash}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 self-start md:self-center text-xs">
              <button
                type="button"
                onClick={() => alert(`Opening evidence details: ${ev.title}`)}
                className="px-2.5 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors font-medium flex items-center gap-1 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[14px]">difference</span>
                <span>View Evidence</span>
              </button>
              <button
                type="button"
                onClick={() => alert(`IPFS gateway redirect for CID ${ev.ipfsCid}`)}
                className="w-7 h-7 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface-variant hover:text-on-surface flex items-center justify-center transition-colors border border-outline-variant/30"
                title="Open IPFS"
              >
                <span className="material-symbols-outlined text-[14px]">open_in_new</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
