'use client';

import React from 'react';

const ATTESTATIONS = [
  {
    id: 'att-1',
    title: 'CertiK Security Auditor',
    tokenId: 'SBT Token ID #8819',
    metricLabel: 'EAS Schema Score:',
    metricValue: '96.4 / 100',
    hash: 'Txn 0x9f...a8',
    icon: 'verified_user',
  },
  {
    id: 'att-2',
    title: 'Gitcoin Passport Sybil-Proof',
    tokenId: 'Scorer v2 Unique Human',
    metricLabel: 'Stamp Index:',
    metricValue: '42.8 Threshold Passed',
    hash: 'Registry Sync',
    icon: 'shield',
  },
  {
    id: 'att-3',
    title: 'OpenZeppelin Fellowship',
    tokenId: 'Alumni Cohort IV (#0891)',
    metricLabel: 'Issued:',
    metricValue: 'Block #16509121',
    hash: 'Permanent SBT',
    icon: 'military_tech',
  },
  {
    id: 'att-4',
    title: 'zkPass ZK-KYC Attestation',
    tokenId: 'Zero-Knowledge Proof ID',
    metricLabel: 'Compliance:',
    metricValue: 'FATF Standard (Anonymized)',
    hash: 'Active Lock',
    icon: 'visibility_off',
  },
];

export const ProfileVerifiableAttestationsSection: React.FC = () => {
  return (
    <section className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          </div>
          <div>
            <h2 className="text-base font-bold text-on-surface">Verifiable Attestations &amp; Soulbound Tokens</h2>
            <p className="text-xs text-on-surface-variant">Non-transferable on-chain proof of expertise and sybil resistance</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => alert('Initiating EAS / Verifiable Credential schema attestation...')}
          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1 self-start transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[15px] text-primary">add</span>
          <span>Mint New Attestation</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {ATTESTATIONS.map((att) => (
          <div key={att.id} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3 hover:bg-surface-container-high/30 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">{att.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">{att.title}</span>
                  <span className="font-mono text-[11px] text-on-surface-variant">{att.tokenId}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high font-mono text-[10px] text-primary flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> Verified
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/10">
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant font-mono">
                <span>{att.metricLabel}</span>
                <span className="text-on-surface font-semibold">{att.metricValue}</span>
              </div>
              <span className="font-mono text-[11px] text-primary">{att.hash}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
