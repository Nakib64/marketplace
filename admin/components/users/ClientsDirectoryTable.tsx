'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminUsersApi } from '@/lib/api/adminApi';
import { AdminUserListItem } from '@/types/adminTypes';
import { UserStatusModal } from './UserStatusModal';
import { UserProfileDossierModal } from './UserProfileDossierModal';
import { Search, RefreshCw, Building, Edit3, Star, Briefcase } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ClientsDirectoryTable() {
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [targetBanState, setTargetBanState] = useState<boolean>(false);
  const [dossierUserId, setDossierUserId] = useState<string | null>(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-clients', search],
    queryFn: () => adminUsersApi.getUsers({ search: search || undefined, role: 'CLIENT' }),
  });

  const users: AdminUserListItem[] = Array.isArray(data)
    ? data
    : Array.isArray((data as any)?.users)
    ? (data as any).users
    : [];

  const openStatusModal = (user: AdminUserListItem, ban: boolean) => {
    setSelectedUser(user);
    setTargetBanState(ban);
  };

  return (
    <div className="rounded-2xl border border-outline-variant bg-white shadow-2xs overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-outline-variant">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-outline" />
            <input
              type="text"
              placeholder="Search clients by email, company or ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 rounded-xl border border-outline-variant bg-surface-container-lowest pl-9 pr-3 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        <button
          onClick={() => refetch()}
          className="flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer font-semibold"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Refresh Clients
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-surface-container text-on-surface-variant uppercase text-[11px] font-semibold tracking-wider border-b border-outline-variant">
            <tr>
              <th className="py-3.5 px-5">Client Account</th>
              <th className="py-3.5 px-4">Company Name</th>
              <th className="py-3.5 px-4">Rating</th>
              <th className="py-3.5 px-4">Total Spent</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/60 text-on-surface">
            {isLoading ? (
              <tr><td colSpan={6} className="py-12 text-center text-outline">Loading registered clients...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="py-12 text-center text-outline font-medium">No clients found.</td></tr>
            ) : (
              users.map((u) => {
                const cp = u.clientProfile;
                return (
                  <tr key={u.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="py-3.5 px-5 font-bold text-on-surface">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] text-primary flex items-center justify-center font-bold text-xs shrink-0">
                          <Building className="h-4 w-4" />
                        </div>
                        <div>
                          <div>{u.email}</div>
                          <div className="text-[10px] text-outline font-normal">
                            ID: {u.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-on-surface">
                        {cp?.companyName || 'Independent Client'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1 font-bold text-amber-500">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{cp?.rating ? cp.rating.toFixed(1) : '5.0'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-black text-primary">৳{Number(cp?.totalSpent || 0).toLocaleString()}</div>
                      <div className="text-[10px] text-outline">Wallet: ৳{Number(u.walletBalance || 0).toLocaleString()}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={cn(
                        'text-xs font-semibold px-2 py-0.5 rounded-full',
                        u.isBanned ? 'bg-red-50 text-red-600' : 'bg-[#eaf5ea] text-[#14a800]'
                      )}>
                        {u.isBanned ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDossierUserId(u.id)}
                          className="px-2.5 py-1 rounded-lg border border-outline-variant hover:border-primary hover:bg-[#eaf5ea] text-on-surface hover:text-primary text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Dossier</span>
                        </button>
                        {u.isBanned ? (
                          <button
                            onClick={() => openStatusModal(u, false)}
                            className="px-2.5 py-1 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant text-xs font-bold cursor-pointer transition-colors"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => openStatusModal(u, true)}
                            className="px-2.5 py-1 rounded-lg bg-error-container hover:bg-error/20 text-error border border-error/20 text-xs font-bold cursor-pointer transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <UserStatusModal
        user={selectedUser}
        targetBannedState={targetBanState}
        onClose={() => setSelectedUser(null)}
        onSuccess={() => refetch()}
      />

      <UserProfileDossierModal
        userId={dossierUserId}
        onClose={() => setDossierUserId(null)}
        onSuccess={() => refetch()}
      />
    </div>
  );
}
