'use client';

import React, { useState } from 'react';

interface ContractExtensionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (days: number, reason: string) => void;
}

export const ContractExtensionModal: React.FC<ContractExtensionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [days, setDays] = useState(3);
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(days, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl max-w-md w-full p-6 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">schedule</span>
            <h3 className="text-base font-bold text-on-surface">Request Milestone Extension</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <p className="text-on-surface-variant leading-relaxed">
            Submit an on-chain extension proposal to the hirer. Upon multisig approval, the milestone deadline will update automatically.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface">Extension Duration</label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 5, 7].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDays(d)}
                  className={`py-2 rounded-lg font-mono font-semibold border transition-all ${
                    days === d
                      ? 'bg-primary text-on-primary border-primary shadow-sm'
                      : 'bg-surface-container text-on-surface border-outline-variant/30 hover:bg-surface-container-high'
                  }`}
                >
                  +{d} Days
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface">Reason for Extension</label>
            <textarea
              required
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Detail reasons such as edge-case invariant testing or extra audits..."
              className="w-full bg-surface-container border border-outline-variant/30 p-2.5 rounded-lg font-mono text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold shadow-md"
            >
              Propose Extension
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
