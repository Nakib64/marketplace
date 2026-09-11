'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Wallet, User as UserIcon, LogOut, PlusCircle, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const isClient = user?.role === 'CLIENT';

  const navLinks = [
    { label: 'Find Work', href: '/jobs' },
    { label: 'Find Talent', href: '/freelancers' },
    { label: 'Vaults', href: '/wallet' },
    { label: 'Ledger', href: '/transactions' },
    { label: 'Disputes', href: '/disputes' },
    { label: 'Messages', href: '/messages', authRequired: true },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-b border-outline-variant/40">
      <div className="h-20 max-w-[1280px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-surface text-base">
              B
            </div>
            <span className="text-xl font-bold tracking-tight text-on-surface">
              Bang<span className="text-primary">lance</span>
            </span>
          </Link>
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-lowest border border-outline-variant/50 text-xs text-on-surface-variant font-mono">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span>ESCROW GUARANTEE</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            if (link.authRequired && !isAuthenticated) return null;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-surface-container-highest text-primary font-semibold'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/jobs"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface-variant text-xs hover:border-outline transition-colors"
          >
            <Search className="w-4 h-4 text-primary" />
            <span className="text-outline pr-4">Search jobs, talent...</span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline text-[10px] font-mono">
              ⌘K
            </kbd>
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg border border-outline-variant/60 text-xs font-semibold text-on-surface hover:bg-surface-container-high transition-all"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg bg-primary text-surface font-semibold text-xs hover:bg-tertiary transition-all shadow-sm"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {isClient ? (
                <Link
                  href="/client/jobs/new"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-surface text-xs font-semibold hover:bg-primary transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post a Job</span>
                </Link>
              ) : (
                <Link
                  href="/jobs"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container-highest transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Find Work</span>
                </Link>
              )}

              <Link
                href="/wallet"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/50 text-xs text-on-surface hover:border-primary/50 transition-colors"
              >
                <Wallet className="w-3.5 h-3.5 text-primary" />
                <span className="font-mono text-xs font-medium">Wallet</span>
              </Link>

              <Link
                href="/settings"
                title={user?.name || 'Profile'}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-container text-xs text-on-surface hover:bg-surface-container-high transition-colors"
              >
                <UserIcon className="w-3.5 h-3.5 text-primary" />
                <span className="hidden xl:inline text-xs font-medium max-w-[100px] truncate">
                  {user?.name || 'Account'}
                </span>
              </Link>

              <button
                onClick={logout}
                title="Log Out"
                className="p-2 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
