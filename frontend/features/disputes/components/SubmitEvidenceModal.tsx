'use client';

import React, { useState } from 'react';

interface SubmitEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, ipfsCid: string) => Promise<void>;
}

export const SubmitEvidenceModal: React.FC<SubmitEvidenceModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [title, setTitle] = useState('');
  const [ipfsCid, setIpfsCid] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(title, ipfsCid);
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
            <span className="material-symbols-outlined text-primary text-[20px]">folder_special</span>
            <h3 className="text-sm font-bold text-on-surface">Submit Cryptographic Evidence</h3>
          </div>
          <button type="button" onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-xs">
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">Evidence Title / Artifact Description *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Invariant Fuzz Execution Log Output"
              className="bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg text-on-surface focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-semibold text-on-surface">IPFS Content Identifier (CID) *</label>
            <input
              type="text"
              required
              value={ipfsCid}
              onChange={(e) => setIpfsCid(e.target.value)}
              placeholder="bafybeic..."
              className="bg-surface-container-low border border-outline-variant/30 p-2.5 rounded-lg font-mono text-on-surface focus:outline-none focus:border-primary"
            />
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
              {isSubmitting ? 'Pinning to Court...' : 'Anchor Evidence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
