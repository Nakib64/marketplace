'use client';

import React, { useState } from 'react';
import { adminUsersApi } from '@/lib/api/adminApi';
import { AdminUserListItem } from '@/types/adminTypes';
import { UserX, UserCheck, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  user: AdminUserListItem | null;
  targetBannedState: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function UserStatusModal({ user, targetBannedState, onClose, onSuccess }: Props) {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (targetBannedState && !reason.trim()) {
      return toast.error('A mandatory justification is required for account suspension.');
    }

    setIsLoading(true);
    try {
      await adminUsersApi.updateStatus(user.id, targetBannedState, reason);
      toast.success(`User ${user.email} ${targetBannedState ? 'suspended' : 're-activated'}`);
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update user status');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2">
            {targetBannedState ? (
              <UserX className="h-5 w-5 text-error" />
            ) : (
              <UserCheck className="h-5 w-5 text-primary" />
            )}
            <h3 className="text-base font-bold text-on-surface">
              {targetBannedState ? 'Suspend Platform Account' : 'Reactivate Platform Account'}
            </h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-surface-container-low p-3.5 rounded-xl border border-outline-variant/60 text-xs">
            <div className="text-on-surface-variant font-medium">Target Account:</div>
            <div className="text-on-surface font-bold text-sm mt-0.5">{user.email} ({user.role})</div>
          </div>

          {targetBannedState ? (
            <div>
              <label className="block text-xs font-semibold text-on-surface mb-1.5">
                Suspension Justification
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g., Anti-circumvention policy violation, fraudulent proposal spam, or payment anomaly."
                rows={3}
                required
                className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest p-3 text-xs text-on-surface placeholder:text-outline focus:border-error focus:outline-none transition-colors"
              />
            </div>
          ) : (
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to lift this suspension and restore full platform bidding and transaction access for this account?
            </p>
          )}

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
              className={`flex-1 flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold text-white shadow-sm cursor-pointer disabled:opacity-50 transition-colors ${
                targetBannedState ? 'bg-error hover:bg-error/90' : 'bg-primary hover:bg-primary-container'
              }`}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : targetBannedState ? 'Confirm Suspension' : 'Reactivate User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
