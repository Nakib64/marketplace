'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, LayoutDashboard, PlusCircle, Briefcase } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuthStore();

  const isClient = user?.role === 'CLIENT';
  const isFreelancer = user?.role === 'FREELANCER';

  // Role-targeted navigation links
  const clientNavLinks = [
    { label: 'My Job Posts', href: '/client/jobs' },
    { label: 'Find Talent', href: '/freelancers' },
    { label: 'Messages', href: '/messages' },
    { label: 'Activity', href: '/transactions' },
    { label: 'Resolutions', href: '/disputes' },
  ];

  const freelancerNavLinks = [
    { label: 'Find Work', href: '/jobs' },
    { label: 'My Workspace', href: '/freelancer/dashboard' },
    { label: 'Messages', href: '/messages' },
    { label: 'Activity', href: '/transactions' },
    { label: 'Resolutions', href: '/disputes' },
  ];

  const publicNavLinks = [
    { label: 'Find Work', href: '/jobs' },
    { label: 'Find Talent', href: '/freelancers' },
  ];

  const navLinks = isAuthenticated
    ? isClient
      ? clientNavLinks
      : freelancerNavLinks
    : publicNavLinks;

  const dashboardHref = isClient ? '/client/jobs' : '/freelancer/dashboard';

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
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
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
            href={isClient ? '/freelancers' : '/jobs'}
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container border border-outline-variant/40 text-on-surface-variant text-xs hover:border-outline transition-colors"
          >
            <Search className="w-4 h-4 text-primary" />
            <span className="text-outline pr-4">
              {isClient ? 'Search talent...' : 'Search jobs...'}
            </span>
            <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-outline text-[10px] ">
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
            <div className="flex items-center gap-2.5">
              {isClient && (
                <Link
                  href="/client/jobs/new"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container text-surface text-xs font-semibold hover:bg-primary transition-all"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post a Job</span>
                </Link>
              )}

              {isFreelancer && (
                <Link
                  href="/jobs"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium hover:bg-surface-container-highest transition-all"
                >
                  <Briefcase className="w-3.5 h-3.5 text-primary" />
                  <span>Find Work</span>
                </Link>
              )}

              {/* Dedicated Dashboard Button */}
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-surface text-xs font-bold hover:bg-tertiary shadow-sm transition-all cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
