'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';
import { adminAuthApi } from '@/lib/api/adminApi';
import { LogOut, Activity } from 'lucide-react';
import { toast } from 'sonner';

export function AdminTopBar() {
  const router = useRouter();
  const { admin, logout } = useAdminAuthStore();

  const handleLogout = async () => {
    try {
      await adminAuthApi.logout();
    } catch {
      // Ignore network errors on logout
    } finally {
      logout();
      toast.success('Admin session ended securely');
      router.replace('/login');
    }
  };

  return (
    <header className="h-16 border-b border-outline-variant bg-white/90 backdrop-blur-md px-6 flex items-center justify-between">
      <div />

      <div className="flex items-center gap-4">
        {admin && (
          <div className="flex items-center gap-3 pl-3 border-l border-outline-variant">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {admin.name?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div>
                <span className="text-xs font-bold text-on-surface block leading-tight">{admin.name}</span>
                <span className="text-[10px] font-semibold text-on-surface-variant block uppercase tracking-wider">{admin.role}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Terminate Admin Session"
              className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-error-container transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
