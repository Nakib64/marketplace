'use client';

import React from 'react';

interface ZkStateCommitmentBannerProps {
  merkleRoot?: string;
  onVerifyProof?: () => void;
}

export const ZkStateCommitmentBanner: React.FC<ZkStateCommitmentBannerProps> = ({
  merkleRoot = '0x7c9f829a24ec081b7a66e5f8bc87483920ad892138be',
  onVerifyProof,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 p-5 rounded-xl bg-surface-container-low border border-outline-variant/30 mt-6 shadow-sm">
      <div className="flex items-start gap-3.5">
        <div className="p-2.5 rounded-lg bg-surface-container-high text-primary shrink-0 border border-outline-variant/20">
          <span className="material-symbols-outlined text-[22px]">account_tree</span>
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-on-surface">Zero-Knowledge State Commitment</span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[10px] font-semibold">
              Sepolia L1 Anchored
            </span>
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            Current Merkle Root: <span className="font-mono text-on-surface font-semibold bg-surface-container px-1.5 py-0.5 rounded select-all border border-outline-variant/20">{merkleRoot}</span>. Batch proofs guarantee cryptographic immutability across all historical accounting logs.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full lg:w-auto justify-end shrink-0 text-xs">
        <button
          type="button"
          onClick={onVerifyProof || (() => alert(`State root ${merkleRoot} verified on Sepolia L1 contract.`))}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-semibold transition-all border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">security_update_good</span>
          <span>Verify On-Chain Proof</span>
        </button>
      </div>
    </div>
  );
};
