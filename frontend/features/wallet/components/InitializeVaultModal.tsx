'use client';

import React, { useState } from 'react';

interface InitializeVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: { title: string; contractorAddress: string; amount: number; currency: string }) => Promise<void>;
}

export const InitializeVaultModal: React.FC<InitializeVaultModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [contractorAddress, setContractorAddress] = useState('');
  const [amount, setAmount] = useState('5000');
  const [currency, setCurrency] = useState('USDC');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit({ title, contractorAddress, amount: Number(amount), currency });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container max-w-md w-full rounded-xl p-5 border border-outline-variant/40 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">add_circle</span>
            <h3 className="text-sm font-bold text-on-surface">Initialize New Escrow Smart Vault</h3>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">Project Scope / RFP Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ZK Rollup Bridge Auditing"
              className="bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">Beneficiary Contributor (0x or ENS) *</label>
            <input
              type="text"
              required
              value={contractorAddress}
              onChange={(e) => setContractorAddress(e.target.value)}
              placeholder="0x... or vitalik.eth"
              className="bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg font-mono text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Vault Initial Deposit *</label>
              <input
                type="number"
                required
                min="50"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg font-mono text-on-surface focus:outline-none focus:border-primary"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-semibold text-on-surface">Collateral Asset</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg text-on-surface focus:outline-none"
              >
                <option value="USDC">USDC (Stable)</option>
                <option value="USDT">USDT</option>
                <option value="ETH">ETH (Native)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold shadow-md"
            >
              {isSubmitting ? 'Deploying Vault Safe...' : 'Fund & Initialize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
