'use client';

import React from 'react';

interface SubmitProposalCoverLetterSectionProps {
  coverLetter: string;
  onChange: (val: string) => void;
}

export const SubmitProposalCoverLetterSection: React.FC<SubmitProposalCoverLetterSectionProps> = ({
  coverLetter,
  onChange,
}) => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <span className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center font-mono text-primary font-bold text-xs">
            02
          </span>
          <div>
            <h2 className="text-base font-bold text-on-surface">Technical Proposal &amp; Engineering Blueprint</h2>
            <p className="text-xs text-on-surface-variant">Detailed architectural rationale, testing invariants, and repository verification methodology.</p>
          </div>
        </div>
        <span className="text-on-surface-variant font-mono text-xs flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">markdown</span>
          <span>Markdown</span>
        </span>
      </div>

      {/* Editor Box */}
      <div className="rounded-xl bg-surface-container border border-outline-variant/30 overflow-hidden shadow-inner">
        <div className="flex items-center justify-between px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="font-bold px-1.5 py-0.5 rounded hover:bg-surface-container cursor-pointer">B</span>
            <span className="italic px-1.5 py-0.5 rounded hover:bg-surface-container cursor-pointer">I</span>
            <span className="px-1.5 py-0.5 rounded hover:bg-surface-container cursor-pointer">&lt;/&gt;</span>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span>{coverLetter.length} chars</span>
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span>Auto-saved to IPFS Draft</span>
          </div>
        </div>
        <textarea
          value={coverLetter}
          onChange={(e) => onChange(e.target.value)}
          rows={8}
          placeholder="Detail your engineering architecture, math invariants, and test coverage strategies..."
          className="w-full bg-transparent p-3 text-on-surface font-mono text-xs leading-relaxed focus:outline-none resize-y"
        />
      </div>

      {/* Proofs Drag and Drop Zone */}
      <div className="mt-4">
        <span className="text-xs font-semibold text-on-surface block mb-1.5">Engineering Artifacts &amp; Cryptographic Proofs</span>
        <div className="p-4 rounded-xl bg-surface-container/60 border border-dashed border-outline-variant/50 hover:border-primary transition-all flex flex-col items-center justify-center text-center group cursor-pointer">
          <span className="material-symbols-outlined text-primary text-[24px] mb-1">cloud_upload</span>
          <p className="text-xs font-semibold text-on-surface mb-0.5">Drop technical whitepapers, architecture SVGs, or test runners</p>
          <p className="text-[11px] text-on-surface-variant mb-2">Files are pinned to IPFS and signed with your connected wallet address.</p>
          <div className="flex flex-wrap gap-2 justify-center">
            <span className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-lg text-on-surface font-mono text-[11px]">
              <span className="material-symbols-outlined text-primary text-[13px]">link</span>
              github.com/alexr-dev/amm-arbitrum-invariants
            </span>
            <span className="flex items-center gap-1 bg-surface-container-high px-2 py-0.5 rounded-lg text-on-surface font-mono text-[11px]">
              <span className="material-symbols-outlined text-secondary text-[13px]">picture_as_pdf</span>
              amm-formal-spec-v1.4.pdf (2.4 MB)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
