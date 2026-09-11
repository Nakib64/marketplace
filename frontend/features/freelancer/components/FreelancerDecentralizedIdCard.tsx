import React from 'react';

const BADGES = [
  {
    id: 'badge-certik',
    title: 'CertiK Security Auditor',
    subtitle: 'Score: 96.4 / 100',
    icon: 'security',
  },
  {
    id: 'badge-zkpass',
    title: 'KYC Level 2 Verified',
    subtitle: 'zkPass Cryptographic Proof',
    icon: 'key',
  },
  {
    id: 'badge-gitcoin',
    title: 'Gitcoin Passport',
    subtitle: 'Score: 42.1 (Sybil Resistant)',
    icon: 'badge',
  },
];

export const FreelancerDecentralizedIdCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Decentralized ID</span>
        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {BADGES.map((b) => (
          <div key={b.id} className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">{b.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">{b.title}</span>
                <span className="font-mono text-[11px] text-on-surface-variant">{b.subtitle}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[16px]">check</span>
          </div>
        ))}
      </div>
    </div>
  );
};
