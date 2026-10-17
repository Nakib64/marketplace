'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminAuditApi } from '@/lib/api/adminApi';
import { AdminAuditLog } from '@/types/adminTypes';
import { Search, RefreshCw } from 'lucide-react';

export function AuditTrailTable() {
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-audit-logs', search, actionFilter],
    queryFn: () => adminAuditApi.getLogs({ search: search || undefined, action: actionFilter || undefined }),
  });

  const logs: AdminAuditLog[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.logs)
    ? (data as any).logs
    : [];

  return (
    <div className="rounded-2xl border border-outline-variant bg-white shadow-2xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-outline-variant">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              type="text"
              placeholder="Search audit trail or details..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-xl border border-outline-variant bg-surface-container-lowest pl-9 pr-3 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none transition-colors"
            />
          </div>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="h-10 rounded-xl border border-outline-variant bg-surface-container-lowest px-3 text-xs text-on-surface focus:border-primary focus:outline-none transition-colors font-medium"
          >
            <option value="">All Actions</option>
            <option value="PAYOUT_APPROVED">Payout Approved</option>
            <option value="PAYOUT_REJECTED">Payout Rejected</option>
            <option value="DISPUTE_REFUNDED">Dispute Refunded</option>
            <option value="DISPUTE_RELEASED">Dispute Released</option>
            <option value="DISPUTE_SPLIT">Dispute Split</option>
            <option value="USER_STATUS_UPDATED">User Status</option>
            <option value="CIRCUIT_BREAKER_TOGGLED">Circuit Breaker</option>
          </select>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Log
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container text-on-surface-variant uppercase text-[11px] font-semibold tracking-wider border-b border-outline-variant">
            <tr>
              <th className="py-3.5 px-5">Timestamp (UTC)</th>
              <th className="py-3.5 px-4">Operator</th>
              <th className="py-3.5 px-4">Action</th>
              <th className="py-3.5 px-4">Target Type / ID</th>
              <th className="py-3.5 px-5">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-on-surface">
            {isLoading ? (
              <tr><td colSpan={5} className="py-8 text-center text-outline">Loading audit history...</td></tr>
            ) : logs.length === 0 ? (
              <tr><td colSpan={5} className="py-8 text-center text-outline font-medium">No matching audit events recorded.</td></tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-3.5 px-5 text-on-surface-variant font-medium">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-primary">{log.admin?.email || log.adminId}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-on-surface">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-on-surface text-[11px] font-medium">
                    {log.targetType} {log.targetId && `(${log.targetId.slice(0, 8)}...)`}
                  </td>
                  <td className="py-3.5 px-5 text-on-surface-variant max-w-sm truncate" title={log.details}>
                    {log.details || 'System event'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
