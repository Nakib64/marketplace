'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopHeader } from './DashboardTopHeader';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isDashboardPage =
    pathname.startsWith('/client') ||
    pathname.startsWith('/freelancer') ||
    pathname.startsWith('/contracts') ||
    pathname.startsWith('/wallet') ||
    pathname.startsWith('/messages') ||
    pathname.startsWith('/transactions') ||
    pathname.startsWith('/disputes');

  if (isDashboardPage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        {/* Desktop Sidebar (fixed w-64) & Mobile Drawer */}
        <DashboardSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dashboard Workspace Layout */}
        <div className="flex-1 flex flex-col min-w-0 md:pl-64">
          <DashboardTopHeader
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          />
          <main className="flex-1 w-full">{children}</main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
};
