'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminPayoutsApi } from '@/lib/api/adminApi';
import { AdminWithdrawal } from '@/types/adminTypes';
import { PayoutApproveModal } from './PayoutApproveModal';
import { PayoutRejectModal } from './PayoutRejectModal';
import { Smartphone, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PayoutQueueTable() {
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
  const [approvingWithdrawal, setApprovingWithdrawal] = useState<AdminWithdrawal | null>(null);
  const [rejectingWithdrawal, setRejectingWithdrawal] = useState<AdminWithdrawal | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-withdrawals', selectedStatus],
    queryFn: () => adminPayoutsApi.getWithdrawals({ status: selectedStatus || undefined }),
  });

  const withdrawals: AdminWithdrawal[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.withdrawals)
    ? (data as any).withdrawals
    : [];

  return (
    <div className="rounded-2xl border border-outline-variant bg-white shadow-2xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          {['PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={cn(
                'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
                selectedStatus === st
                  ? 'bg-primary text-white shadow-2xs'
                  : 'text-on-surface-variant hover:text-on-surface bg-surface-container'
              )}
            >
              {st}
            </button>
          ))}
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Queue
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container text-on-surface-variant uppercase text-[11px] font-semibold tracking-wider border-b border-outline-variant">
            <tr>
              <th className="py-3.5 px-5">Recipient Freelancer</th>
              <th className="py-3.5 px-4">Gateway</th>
              <th className="py-3.5 px-4">Account Number</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-on-surface">
            {isLoading ? (
              <tr><td colSpan={6} className="py-8 text-center text-outline">Loading payout queue...</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr><td colSpan={6} className="py-8 text-center text-outline font-medium">No {selectedStatus.toLowerCase()} withdrawals found.</td></tr>
            ) : (
              withdrawals.map((w) => (
                <tr key={w.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-5 font-bold text-on-surface">{w.freelancer?.email}</td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 font-bold text-secondary">
                      <Smartphone className="h-3.5 w-3.5" /> {w.method}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-on-surface-variant">{w.accountNumber}</td>
                  <td className="py-3.5 px-4 font-bold text-primary">৳{w.amount.toLocaleString()}</td>
                  <td className="py-3.5 px-4">
                    <span className={cn(
                      'text-xs font-semibold',
                      w.status === 'APPROVED' && 'text-primary',
                      w.status === 'REJECTED' && 'text-error',
                      w.status === 'PENDING' && 'text-amber-700'
                    )}>
                      {w.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {w.status === 'PENDING' && (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setApprovingWithdrawal(w)}
                          className="px-3 py-1 rounded-lg bg-primary hover:bg-primary-container text-white text-xs font-bold cursor-pointer transition-colors shadow-2xs"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => setRejectingWithdrawal(w)}
                          className="px-3 py-1 rounded-lg bg-error-container hover:bg-error/20 text-error border border-error/20 text-xs font-bold cursor-pointer transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <PayoutApproveModal
        withdrawal={approvingWithdrawal}
        onClose={() => setApprovingWithdrawal(null)}
        onSuccess={() => refetch()}
      />
      <PayoutRejectModal
        withdrawal={rejectingWithdrawal}
        onClose={() => setRejectingWithdrawal(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
