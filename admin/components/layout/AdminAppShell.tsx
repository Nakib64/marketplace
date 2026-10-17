'use client';

import React, { Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { AdminRoleGuard } from '@/components/auth/AdminRoleGuard';
import { AdminSidebar } from './AdminSidebar';
import { AdminTopBar } from './AdminTopBar';

function AdminAppShellInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // On login route, render bare without navigation chrome
  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <AdminRoleGuard>
      <div className="flex h-screen w-full overflow-hidden bg-surface-dim text-on-surface font-sans">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
          {/* <AdminTopBar /> */}
          <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-surface-dim transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>

      </div>
    </AdminRoleGuard>
  );
}

export function AdminAppShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-dim" />}>
      <AdminAppShellInner>{children}</AdminAppShellInner>
    </Suspense>
  );
}
