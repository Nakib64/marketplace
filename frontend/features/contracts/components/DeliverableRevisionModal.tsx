'use client';

import React, { useState } from 'react';

interface DeliverableRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => void;
}

export const DeliverableRevisionModal: React.FC<DeliverableRevisionModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [feedback, setFeedback] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(feedback);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container max-w-lg w-full rounded-xl p-5 border border-outline-variant/40 shadow-2xl flex flex-col gap-4">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">history_edu</span>
            <h3 className="text-sm font-bold text-on-surface">Request Deliverable Changes</h3>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface p-1">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="text-xs text-on-surface-variant leading-relaxed">
          Submitting a revision request pauses the 48-hour auto-release clock and creates an immutable change request log on-chain.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-xs">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface uppercase tracking-wider text-[10px]">
              Scope Discrepancies or Required Patches
            </label>
            <textarea
              required
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Specify failing test cases, missing invariant edge cases, or gas benchmark requirements..."
              className="w-full bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg font-mono text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-y leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-surface-container-low text-on-surface-variant hover:text-on-surface font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary font-bold shadow-md"
            >
              Confirm Revision Dispatch
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
