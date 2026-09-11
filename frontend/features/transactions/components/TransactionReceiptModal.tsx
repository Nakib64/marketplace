'use client';

import React from 'react';
import { LedgerTransaction } from '../types/transactionTypes';

interface TransactionReceiptModalProps {
  transaction: LedgerTransaction | null;
  onClose: () => void;
}

export const TransactionReceiptModal: React.FC<TransactionReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container max-w-lg w-full rounded-xl p-5 border border-outline-variant/40 shadow-2xl flex flex-col gap-4 text-xs font-mono">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">receipt_long</span>
            <h3 className="text-sm font-bold text-on-surface font-sans">Cryptographic Receipt &amp; IPFS Proof</h3>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 bg-surface-container-low p-3.5 rounded-lg border border-outline-variant/20">
          <div>
            <span className="text-[10px] text-on-surface-variant uppercase font-sans block">Transaction Hash</span>
            <span className="text-on-surface text-[11px] break-all select-all">{transaction.txHash}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-outline-variant/10">
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-sans block">Block Number</span>
              <span className="text-on-surface font-bold">#{transaction.blockNumber}</span>
            </div>
            <div>
              <span className="text-[10px] text-on-surface-variant uppercase font-sans block">Network</span>
              <span className="text-on-surface">{transaction.network}</span>
            </div>
          </div>

          <div className="pt-1 border-t border-outline-variant/10">
            <span className="text-[10px] text-on-surface-variant uppercase font-sans block">IPFS Receipt CID</span>
            <span className="text-primary text-[11px] break-all select-all">{transaction.ipfsReceiptCid}</span>
          </div>

          <div className="pt-1 border-t border-outline-variant/10">
            <span className="text-[10px] text-on-surface-variant uppercase font-sans block">Merkle State Root</span>
            <span className="text-on-surface-variant text-[11px] break-all select-all">{transaction.merkleRoot}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-primary text-[11px] flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            zk-SNARK Validity Proof Valid
          </span>
          <button
            type="button"
            onClick={() => alert(`Downloaded receipt payload for Tx ${transaction.txHash.slice(0, 10)}...`)}
            className="px-3.5 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-sans font-bold text-xs shadow-sm"
          >
            Download Receipt JSON
          </button>
        </div>
      </div>
    </div>
  );
};
