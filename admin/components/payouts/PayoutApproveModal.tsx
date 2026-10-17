'use client';

import React, { useState } from 'react';
import { adminPayoutsApi } from '@/lib/api/adminApi';
import { AdminWithdrawal } from '@/types/adminTypes';
import { CheckCircle2, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  withdrawal: AdminWithdrawal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function PayoutApproveModal({ withdrawal, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  if (!withdrawal) return null;

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await adminPayoutsApi.approve(withdrawal.id);
      toast.success(`Payout of ৳${withdrawal.amount.toLocaleString()} approved successfully`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to approve payout');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <CheckCircle2 className="h-5 w-5" />
            <h3 className="text-base font-bold text-on-surface">Authorize Payout Dispatch</h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-2.5 mb-5 bg-surface-container-low p-4 rounded-xl border border-outline-variant/60 text-xs">
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">Recipient:</span>
            <span className="text-on-surface font-bold">{withdrawal.freelancer?.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">MFS Gateway:</span>
            <span className="text-primary font-bold">{withdrawal.method}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-on-surface-variant font-medium">Account Number:</span>
            <span className="text-on-surface font-bold">{withdrawal.accountNumber}</span>
          </div>
          <div className="flex justify-between border-t border-outline-variant/80 pt-2 text-sm">
            <span className="text-on-surface-variant font-medium">Disbursal Amount:</span>
            <span className="text-primary font-bold">৳{withdrawal.amount.toLocaleString()} BDT</span>
          </div>
        </div>

        <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
          Please verify that funds have been transferred to the designated MFS account. Approving permanently marks this transaction as completed.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-xl border border-outline-variant bg-white py-2.5 text-xs font-bold text-on-surface hover:bg-surface-container cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApprove}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary hover:bg-primary-container py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Dispatch'}
          </button>
        </div>
      </div>
    </div>
  );
}
