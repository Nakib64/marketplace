'use client';

import React, { useState } from 'react';
import { adminDisputesApi } from '@/lib/api/adminApi';
import { AdminDisputeDossier } from '@/types/adminTypes';
import { Scale, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  dossier: AdminDisputeDossier;
  verdictType: 'REFUND' | 'RELEASE' | 'SPLIT' | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ArbitrationVerdictModal({ dossier, verdictType, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState('');
  const [clientShare, setClientShare] = useState<number>(50);
  const [isLoading, setIsLoading] = useState(false);

  if (!verdictType) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return toast.error('Arbitration reasoning note is mandatory');

    setIsLoading(true);
    try {
      if (verdictType === 'REFUND') {
        await adminDisputesApi.refund(dossier.id, reason);
        toast.success('100% Escrow refunded to client wallet');
      } else if (verdictType === 'RELEASE') {
        await adminDisputesApi.release(dossier.id, reason);
        toast.success('Net escrow released to freelancer wallet');
      } else if (verdictType === 'SPLIT') {
        await adminDisputesApi.split(dossier.id, clientShare, reason);
        toast.success(`Dispute settled via ${clientShare}% / ${100 - clientShare}% split`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to execute arbitration verdict');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Scale className="h-5 w-5" />
            <h3 className="text-base font-bold text-on-surface">
              Execute Final Verdict: {verdictType}
            </h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {verdictType === 'SPLIT' && (
            <div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface-variant">Client Share: <strong className="text-secondary">{clientShare}%</strong></span>
                <span className="text-on-surface-variant">Freelancer Share: <strong className="text-primary">{100 - clientShare}%</strong></span>
              </div>
              <input
                type="range"
                min="10"
                max="90"
                step="5"
                value={clientShare}
                onChange={(e) => setClientShare(Number(e.target.value))}
                className="w-full accent-primary cursor-pointer"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-on-surface mb-1.5">Official Mediation Finding & Notes</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the factual basis for this arbitration ruling (recorded immutably in audit log)."
              rows={4}
              required
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 rounded-xl border border-outline-variant bg-white py-2.5 text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-container py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Enforce Binding Verdict'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
