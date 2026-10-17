'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';
import { ShieldAlert } from 'lucide-react';

export function AdminRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAdminAuthStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isHydrated, isAuthenticated, pathname, router]);

  if (!isHydrated) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-dim">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-xs uppercase tracking-widest text-on-surface-variant font-medium">Initializing System Shell...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== '/login') {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-dim">
        <div className="flex flex-col items-center gap-3 text-center">
          <ShieldAlert className="h-10 w-10 text-amber-500 animate-pulse" />
          <p className="text-sm font-semibold text-on-surface">Authentication Required</p>
          <p className="text-xs text-on-surface-variant">Redirecting to Secure Gateway...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
