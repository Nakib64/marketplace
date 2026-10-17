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
    <header className="sticky top-0 z-30 h-16 bg-[#090d16]/85 backdrop-blur-xl border-b border-white/10 px-4 md:px-8 flex items-center justify-between gap-4 transition-all">
      {/* Mobile: Hamburger & Logo */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation menu"
          className="p-2 rounded-xl text-on-surface hover:bg-white/5 active:scale-90 transition-all duration-150 cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary to-[#00b377] flex items-center justify-center font-bold text-surface text-sm shadow-[0_0_15px_-3px_rgba(0,229,153,0.35)]">
            B
          </div>
          <span className="text-base font-bold text-on-surface tracking-tight">
            Bang<span className="text-primary font-extrabold">lance</span>
          </span>
        </Link>
      </div>

      {/* Desktop: Quick Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md">
        <Link
          href={isClient ? '/freelancers' : '/jobs'}
          className="w-full flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-surface-container/60 border border-white/10 text-xs text-on-surface-variant hover:border-white/20 hover:text-on-surface transition-all backdrop-blur-sm"
        >
          <Search className="w-4 h-4 text-primary" />
          <span className="flex-1 text-outline text-xs">
            {isClient ? 'Search talent, skills, builders...' : 'Search marketplace jobs, skills, builders...'}
          </span>
          <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline text-[10px] border border-white/5 font-semibold">
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
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-primary to-[#00f5a3] text-surface text-xs font-bold shadow-[0_0_20px_-3px_rgba(0,229,153,0.35)] hover:shadow-[0_0_25px_0_rgba(0,229,153,0.5)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Post a Job</span>
          </Link>
        ) : (
          <Link
            href="/jobs"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface-container-high border border-white/10 hover:bg-surface-container-highest text-on-surface text-xs font-semibold hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
          >
            <Briefcase className="w-3.5 h-3.5 text-primary" />
            <span>Find Work</span>
          </Link>
        )}

        {/* Messages */}
        <Link
          href="/messages"
          title="Messages"
          className="p-2 rounded-xl bg-surface-container border border-white/10 hover:border-white/20 text-on-surface-variant hover:text-on-surface hover:-translate-y-0.5 active:scale-95 transition-all duration-200 relative"
        >
          <MessageSquare className="w-4 h-4 text-primary" />
          <span className="w-1.5 h-1.5 rounded-full bg-primary absolute top-1.5 right-1.5 animate-pulse" />
        </Link>

        {/* Wallet */}
        <Link
          href="/wallet"
          title="Wallet"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-container border border-white/10 hover:border-primary/40 text-xs text-on-surface hover:-translate-y-0.5 active:scale-95 transition-all duration-200"
        >
          <Wallet className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline text-xs font-sans font-semibold">Wallet</span>
        </Link>
      </div>
    </header>
  );
};
