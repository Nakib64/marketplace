'use client';

import React, { useState } from 'react';
import { adminPayoutsApi } from '@/lib/api/adminApi';
import { AdminWithdrawal } from '@/types/adminTypes';
import { AlertCircle, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  withdrawal: AdminWithdrawal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PayoutRejectModal({ withdrawal, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!withdrawal) return null;

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return toast.error('Please specify a rejection reason');

    setIsLoading(true);
    try {
      await adminPayoutsApi.reject(withdrawal.id);
      toast.success('Withdrawal rejected. Funds automatically refunded to wallet.');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reject payout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2 text-error">
            <AlertCircle className="h-5 w-5" />
            <h3 className="text-base font-bold text-on-surface">Reject Withdrawal & Refund</h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleReject}>
          <div className="mb-4 bg-error-container/60 border border-error/20 p-3.5 rounded-xl text-xs text-error font-medium">
            Rejecting will automatically reverse the locked ৳{withdrawal.amount.toLocaleString()} BDT balance back into the freelancer&apos;s wallet immediately.
          </div>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-on-surface mb-1.5">Mandatory Rejection Note</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., MFS mobile number not registered or KYC account name mismatch."
              rows={3}
              required
              className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-xs text-on-surface placeholder:text-outline focus:border-error focus:outline-none transition-colors"
            />
          </div>

          <div className="flex gap-3">
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
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-error hover:bg-error/90 py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
