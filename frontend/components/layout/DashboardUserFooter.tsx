'use client';

import React from 'react';
import Link from 'next/link';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

interface DashboardUserFooterProps {
  onLogout?: () => void;
}

export const DashboardUserFooter: React.FC<DashboardUserFooterProps> = ({ onLogout }) => {
  const { user, logout } = useAuthStore();
  const isVerified = user?.isEmailVerified;
  const roleLabel = user?.role === 'CLIENT' ? 'Client' : 'Freelancer';
  const displayName = user?.clientProfile?.companyName || user?.name || user?.email?.split('@')[0] || 'User';

  const handleLogout = () => {
    logout();
    onLogout?.();
  };

  return (
    <div className="mt-auto p-3 border-t border-outline-variant/30 flex flex-col gap-2.5 bg-surface-container-low/50">
      <div className="flex items-center justify-between gap-2">
        <Link
          href={user?.role === 'CLIENT' ? '/client/settings' : '/freelancer/profile/edit'}
          className="flex items-center gap-2.5 min-w-0 flex-1 group hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0">
            <UserIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-semibold text-on-surface truncate capitalize">
              {displayName}
            </span>
            <span className="text-[10px] text-primary flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {roleLabel}
            </span>
          </div>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          title="Sign Out"
          className="p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      <Link
        href="/verify-email"
        className="px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-between text-xs hover:border-primary/50 transition-colors"
      >
        <span className="text-on-surface-variant">Email Status:</span>
        <span className={`font-semibold flex items-center gap-1 ${isVerified ? 'text-primary' : 'text-secondary hover:underline'}`}>
          <span className="material-symbols-outlined text-[14px]">{isVerified ? 'verified' : 'mail'}</span>
          {isVerified ? 'Verified' : 'Verify Email'}
        </span>
      </Link>
    </div>
  );
};
