'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

interface RoleGuardProps {
  allowedRoles: ('CLIENT' | 'FREELANCER' | 'ADMIN')[];
  children: React.ReactNode;
  fallbackRedirect?: string;
}

export function RoleGuard({ allowedRoles, children, fallbackRedirect }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    if (user && !allowedRoles.includes(user.role as any)) {
      if (fallbackRedirect) {
        router.replace(fallbackRedirect);
      } else if (user.role === 'CLIENT') {
        router.replace('/client/jobs');
      } else if (user.role === 'FREELANCER') {
        router.replace('/freelancer/dashboard');
      } else {
        router.replace('/');
      }
    }
  }, [hasMounted, isAuthenticated, user, allowedRoles, fallbackRedirect, router]);

  // Initial SSR / hydration loading skeleton
  if (!hasMounted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs text-on-surface-variant animate-pulse font-medium">
          Verifying security authorization...
        </span>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <span className="text-xs text-on-surface-variant">Redirecting to login...</span>
      </div>
    );
  }

  // Role mismatch
  if (user && !allowedRoles.includes(user.role as any)) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-14 h-14 rounded-2xl bg-error/10 text-error flex items-center justify-center mb-4 border border-error/20">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-on-surface mb-1">Access Restricted</h2>
        <p className="text-xs text-on-surface-variant max-w-sm mb-4">
          This workspace is strictly reserved for {allowedRoles.join(' / ').toLowerCase()} accounts. Redirecting to your dashboard...
        </p>
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}
