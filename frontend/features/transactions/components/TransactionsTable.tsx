'use client';

import React from 'react';
import { LedgerTransaction } from '../types/transactionTypes';

interface TransactionsTableProps {
  transactions: LedgerTransaction[];
  onViewReceipt: (tx: LedgerTransaction) => void;
}

export const TransactionsTable: React.FC<TransactionsTableProps> = ({
  transactions,
  onViewReceipt,
}) => {
  return (
    <div className="w-full rounded-xl bg-surface-container-low overflow-hidden border border-outline-variant/30 shadow-md">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-surface-container/60 text-on-surface-variant uppercase tracking-wider text-[10px] border-b border-outline-variant/20">
              <th className="py-3 px-4 font-semibold">Date</th>
              <th className="py-3 px-3 font-semibold">Type</th>
              <th className="py-3 px-3 font-semibold">Project &amp; Party</th>
              <th className="py-3 px-3 font-semibold text-right">Amount</th>
              <th className="py-3 px-3 font-semibold">Method</th>
              <th className="py-3 px-3 font-semibold text-center">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/10">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-surface-container/40 transition-colors group">
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span className="text-on-surface font-medium">{tx.timestamp}</span>
                </td>

                <td className="py-3.5 px-3 whitespace-nowrap">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-surface-container text-on-surface text-xs">
                    <span className="material-symbols-outlined text-[14px] text-primary">{tx.typeIcon}</span>
                    <span>{tx.typeLabel}</span>
                  </div>
                </td>

                <td className="py-3.5 px-3">
                  <div className="flex flex-col max-w-[200px]">
                    <span className="text-on-surface font-medium truncate">{tx.contractTitle}</span>
                    <span className="text-[11px] text-on-surface-variant truncate">{tx.counterparty}</span>
                  </div>
                </td>

                <td className="py-3.5 px-3 text-right whitespace-nowrap">
                  <div className="flex flex-col items-end">
                    <span className={`font-semibold  ${tx.isCredit ? 'text-primary' : 'text-on-surface'}`}>
                      {tx.isCredit ? '+' : '-'}৳{tx.amount.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-on-surface-variant">{tx.currency === 'USDC' ? 'BDT' : (tx.currency || 'BDT')}</span>
                  </div>
                </td>

                <td className="py-3.5 px-3 whitespace-nowrap">
                  <span className="text-on-surface text-xs">{tx.network}</span>
                </td>

                <td className="py-3.5 px-3 text-center whitespace-nowrap">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container-high text-[11px] text-on-surface">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>Completed</span>
                  </span>
                </td>

                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <button
                    type="button"
                    onClick={() => onViewReceipt(tx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-on-surface text-[11px] transition-colors font-medium border border-outline-variant/30"
                  >
                    <span className="material-symbols-outlined text-[13px] text-on-surface-variant">receipt_long</span>
                    <span>Receipt</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
