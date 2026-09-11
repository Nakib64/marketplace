'use client';

import React from 'react';

interface MilestoneArtifactsInspectionCardProps {
  githubPrUrl?: string;
  githubPrTitle?: string;
  ipfsCid?: string;
  onCopyCid?: (cid: string) => void;
}

export const MilestoneArtifactsInspectionCard: React.FC<MilestoneArtifactsInspectionCardProps> = ({
  githubPrUrl = 'https://github.com/kroma-labs/arbitrum-amm-core/pull/42',
  githubPrTitle = 'GitHub Pull Request #42',
  ipfsCid = 'bafybeicg2by7v2zq4s2vdffzldq4k57rpxp73nd389',
  onCopyCid,
}) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">folder_zip</span>
          <h3 className="text-sm font-bold text-on-surface">Deliverable Artifacts &amp; Cryptographic Evidence</h3>
        </div>
        <span className="font-mono text-xs text-on-surface-variant">3 Verification Checks Passed</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* GitHub PR */}
        <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-on-surface text-[18px]">alt_route</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface truncate">{githubPrTitle}</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">All 412 Tests Pass</span>
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant truncate block mt-0.5">
                kroma-labs/arbitrum-amm-core/pull/42
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
            <span className="font-mono text-[11px] text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Merged in #staging-v2
            </span>
            <a
              href={githubPrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-surface-container-highest text-on-surface text-xs hover:bg-surface-bright transition-colors flex items-center gap-1 font-medium"
            >
              <span>Inspect PR</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>
        </div>

        {/* IPFS Build */}
        <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
              <span className="material-symbols-outlined text-on-surface text-[18px]">cloud_done</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-on-surface truncate">IPFS Build Package &amp; Bytecode</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-container-highest text-on-surface-variant">Filecoin Pinned</span>
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant truncate block mt-0.5">
                ipfs://{ipfsCid}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onCopyCid?.(ipfsCid)}
            className="px-2.5 py-1 rounded bg-surface-container-highest text-on-surface text-xs hover:bg-surface-bright transition-colors flex items-center gap-1 font-medium self-start sm:self-center"
          >
            <span>Copy CID</span>
            <span className="material-symbols-outlined text-[13px]">content_copy</span>
          </button>
        </div>

        {/* Invariant Matrix */}
        <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">query_stats</span>
              <span className="text-xs font-bold text-on-surface">Foundry Invariant Coverage Matrix</span>
            </div>
            <span className="font-mono text-xs text-primary font-semibold">96.4% Statement Coverage</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-mono">
            <div className="bg-surface-container p-2 rounded border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block font-sans">Total Runs</span>
              <span className="text-xs font-bold text-on-surface">50,000 runs</span>
            </div>
            <div className="bg-surface-container p-2 rounded border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block font-sans">Invariant Checks</span>
              <span className="text-xs font-bold text-on-surface">142 assertions</span>
            </div>
            <div className="bg-surface-container p-2 rounded border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block font-sans">Fuzz Failures</span>
              <span className="text-xs font-bold text-primary">0 detected</span>
            </div>
            <div className="bg-surface-container p-2 rounded border border-outline-variant/20">
              <span className="text-[10px] text-on-surface-variant block font-sans">Gas Avg (Swap)</span>
              <span className="text-xs font-bold text-on-surface">94,210 gas</span>
            </div>
          </div>

          <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1">
            <div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: '96.4%' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
