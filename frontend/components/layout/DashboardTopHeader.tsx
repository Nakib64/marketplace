'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, Search, MessageSquare, Wallet, PlusCircle, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

interface DashboardTopHeaderProps {
  onOpenMobileSidebar: () => void;
}

export const DashboardTopHeader: React.FC<DashboardTopHeaderProps> = ({ onOpenMobileSidebar }) => {
  const user = useAuthStore((s) => s.user);
  const isClient = user?.role === 'CLIENT';

  return (
    <header className="sticky top-0 z-30 h-16 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/30 px-4 md:px-8 flex items-center justify-between gap-4">
      {/* Mobile: Hamburger & Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center font-bold text-surface text-sm">
            B
          </div>
          <span className="text-base font-bold text-on-surface">
            Bang<span className="text-primary">lance</span>
          </span>
        </Link>
      </div>

      {/* Desktop: Quick Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <Link
          href={isClient ? '/freelancers' : '/jobs'}
          className="w-full flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant hover:border-outline-variant transition-colors"
        >
          <Search className="w-4 h-4 text-primary" />
          <span className="flex-1 text-outline">
            {isClient ? 'Search talent, skills, builders...' : 'Search marketplace jobs, skills, builders...'}
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline text-[10px] ">
            ⌘K
          </kbd>
        </Link>
      </div>

      {/* Right Quick Actions */}
      <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
        {/* Primary CTA */}
        {isClient ? (
          <Link
            href="/client/jobs/new"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post a Job</span>
          </Link>
        ) : (
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-medium transition-colors"
          >
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            <span>Find Work</span>
          </Link>
        )}

        {/* Messages */}
        <Link
          href="/messages"
          title="Messages"
          className="p-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface transition-colors relative"
        >
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1.5 right-1.5" />
        </Link>

        {/* Wallet */}
        <Link
          href="/wallet"
          title="Wallet"
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 hover:border-primary/40 text-xs  text-on-surface transition-colors"
        >
          <Wallet className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline text-[11px]">Wallet</span>
        </Link>
      </div>
    </header>
  );
};
