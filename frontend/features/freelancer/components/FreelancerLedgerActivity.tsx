import React from 'react';

const EVENTS = [
  {
    id: 'evt-1',
    title: 'Milestone 1 Approved',
    amount: '+$4,250',
    subtitle: 'Kroma Labs • Tx: 0x9f...39ac',
    icon: 'check_circle',
    isPositive: true,
  },
  {
    id: 'evt-2',
    title: 'Escrow Funded',
    amount: '$14,200',
    subtitle: 'Stader Labs (Vault Contract)',
    icon: 'lock',
    isPositive: false,
  },
  {
    id: 'evt-3',
    title: 'SBT Attestation Minted',
    amount: 'On-Chain',
    subtitle: 'CertiK Verified Smart Contract Auditor',
    icon: 'workspace_premium',
    isPositive: true,
  },
];

export const FreelancerLedgerActivity: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Ledger Activity</span>
        <span className="font-mono text-[11px] text-on-surface-variant">Last 24h</span>
      </div>

      <div className="flex flex-col gap-3">
        {EVENTS.map((evt) => (
          <div key={evt.id} className="flex items-start gap-3 p-2.5 rounded-lg bg-surface-container border border-outline-variant/20">
            <div className="w-7 h-7 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
              <span className={`material-symbols-outlined text-[16px] ${evt.isPositive ? 'text-primary' : 'text-on-surface-variant'}`}>
                {evt.icon}
              </span>
            </div>
            <div className="flex flex-col flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-on-surface truncate">{evt.title}</span>
                <span className={`font-mono text-xs font-bold shrink-0 ${evt.isPositive ? 'text-primary' : 'text-on-surface-variant'}`}>
                  {evt.amount}
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant truncate">{evt.subtitle}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
