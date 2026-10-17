'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { MobileNav } from './MobileNav';
import { DashboardSidebar } from './DashboardSidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isDashboardPage =
    (pathname.startsWith('/client/') || pathname === '/client') ||
    ((pathname.startsWith('/freelancer/') || pathname === '/freelancer') && !pathname.startsWith('/freelancers')) ||
    pathname.startsWith('/contracts') ||
    pathname.startsWith('/wallet') ||
    pathname.startsWith('/messages') ||
    pathname.startsWith('/transactions') ||
    pathname.startsWith('/disputes') ||
    pathname.startsWith('/settings');

  // Dedicated auth canvas for login & forgot-password matching theme
  if (pathname === '/login' || pathname === '/forgot-password') {
    return <main className="min-h-screen flex flex-col">{children}</main>;
  }

  if (isDashboardPage) {
    return (
      <div className="flex h-screen w-full overflow-hidden bg-background text-on-surface font-sans">
        {/* Animated Hover Sidebar on Desktop, Drawer on Mobile */}
        <DashboardSidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />

        {/* Dashboard Workspace Layout - Flexible width transition without topbar */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
          {/* Mobile hamburger banner only on small mobile viewports (< md) */}
          <div className="md:hidden h-14 border-b border-outline-variant flex items-center justify-between px-4 bg-white shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileSidebarOpen(true)}
              aria-label="Open navigation menu"
              className="p-2 rounded-xl text-on-surface hover:bg-surface-container active:scale-90 transition-all cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-[#00b377] flex items-center justify-center font-bold text-white text-xs shadow-sm">
                B
              </div>
              <span className="font-bold text-sm text-on-surface">
                bang<span className="text-primary font-black">lance</span>
              </span>
            </div>
          </div>

          <main className="flex-1 overflow-y-auto w-full transition-all duration-300 ease-in-out">
            {children}
          </main>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 md:pt-28">{children}</main>
      <Footer />
      <MobileNav />
    </>
  );
};
