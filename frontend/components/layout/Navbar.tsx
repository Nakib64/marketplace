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

  const subCategories = [
    { label: 'Development & IT', href: '/jobs?category=development' },
    { label: 'AI Services', href: '/jobs?category=ai' },
    { label: 'Design & Creative', href: '/jobs?category=design' },
    { label: 'Sales & Marketing', href: '/jobs?category=marketing' },
    { label: 'Writing & Translation', href: '/jobs?category=writing' },
    { label: 'Admin & Customer Support', href: '/jobs?category=admin' },
    { label: 'Finance & Accounting', href: '/jobs?category=finance' },
    { label: 'Engineering & Architecture', href: '/jobs?category=engineering' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#e4ebe4] transition-all shadow-[0_1px_4px_rgba(0,0,0,0.02)]">
      {/* Main Top Header */}
      <div className="h-18 max-w-[1400px] mx-auto px-4 md:px-8 flex items-center justify-between gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-[#001e00] flex items-center">
              bang<span className="text-[#14a800]">lance</span>
              <span className="w-2 h-2 rounded-full bg-[#14a800] ml-0.5 inline-block" />
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'text-sm font-semibold transition-colors',
                    isActive
                      ? 'text-[#14a800]'
                      : 'text-[#001e00] hover:text-[#14a800]'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/why-banglance"
              className="text-sm font-semibold text-[#001e00] hover:text-[#14a800] transition-colors"
            >
              Why Banglance
            </Link>
            <Link
              href="/enterprise"
              className="text-sm font-semibold text-[#001e00] hover:text-[#14a800] transition-colors"
            >
              Enterprise
            </Link>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {/* Upwork-style Search Pill */}
          <Link
            href={isClient ? '/freelancers' : '/jobs'}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-white border border-[#d5e0d5] text-[#5e6d55] text-xs hover:border-[#14a800] transition-colors shadow-2xs"
          >
            <Search className="w-4 h-4 text-[#001e00]" />
            <span className="text-[#5e6d55] pr-3 text-xs font-normal">
              {isClient ? 'Search talent' : 'Search jobs'}
            </span>
            <span className="h-4 w-[1px] bg-[#d5e0d5]" />
            <span className="text-[#001e00] font-semibold text-[11px] flex items-center gap-1">
              {isClient ? 'Talent' : 'Projects'}
            </span>
          </Link>

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-sm font-semibold text-[#001e00] hover:text-[#14a800] px-3 py-2 transition-colors"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="px-5 py-2 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white font-semibold text-sm transition-colors shadow-xs"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {isClient && (
                <Link
                  href="/client/jobs/new"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#14a800] text-[#14a800] hover:bg-[#f2f7f2] text-xs font-semibold transition-colors"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span>Post a Job</span>
                </Link>
              )}

              {isFreelancer && (
                <Link
                  href="/jobs"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f2f7f2] text-[#001e00] hover:bg-[#e4ebe4] text-xs font-medium transition-colors"
                >
                  <Briefcase className="w-3.5 h-3.5 text-[#14a800]" />
                  <span>Find Work</span>
                </Link>
              )}

              {/* Dedicated Dashboard Button */}
              <Link
                href={dashboardHref}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upwork Sub-Navbar Category Navigation Strip */}
      <div className="hidden md:block border-t border-[#e4ebe4] bg-white">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 flex items-center gap-7 overflow-x-auto py-2 text-xs font-medium text-[#001e00] no-scrollbar">
          {subCategories.map((sub) => (
            <Link
              key={sub.label}
              href={sub.href}
              className="whitespace-nowrap hover:text-[#14a800] transition-colors py-0.5"
            >
              {sub.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
