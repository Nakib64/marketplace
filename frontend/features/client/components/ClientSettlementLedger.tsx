'use client';
import React from 'react';
import { toast } from 'sonner';

const TRANSACTIONS = [
  {
    id: 'tx-1',
    title: 'Milestone 1 Approved',
    subtitle: 'Alex Rivera • Payment released',
    amount: '$2,500 USDC',
  },
  {
    id: 'tx-2',
    title: 'Project Funded',
    subtitle: 'Security Audit Contract',
    amount: '$12,000 USDC',
  },
  {
    id: 'tx-3',
    title: 'Contract Completed',
    subtitle: 'David Chen • Successfully completed',
    amount: '$6,400 USDC',
  },
];

export const ClientSettlementLedger: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-4 lg:p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-on-surface">Recent Activity</h3>
        <span className="material-symbols-outlined text-[18px] text-on-surface-variant">receipt_long</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {TRANSACTIONS.map((tx) => (
          <div key={tx.id} className="flex items-center justify-between gap-2 p-2.5 bg-surface-container rounded-lg border border-outline-variant/20">
            <div className="flex flex-col gap-0.5">
              <span className="text-xs font-semibold text-on-surface">{tx.title}</span>
              <span className="text-[11px] text-on-surface-variant">{tx.subtitle}</span>
            </div>
            <span className=" text-xs font-semibold text-on-surface shrink-0">{tx.amount}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => toast.info('Loading full transaction history...')}
        className="text-xs text-on-surface-variant hover:text-on-surface flex items-center justify-center gap-1 transition-colors pt-1"
      >
        <span>View All Transactions</span>
        <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
      </button>
    </div>
  );
};

