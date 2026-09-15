'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileCheck2,
  MessageSquare,
  Wallet,
  Receipt,
  ShieldAlert,
  PlusCircle,
  UserCheck,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardNavLinksProps {
  pathname: string;
  role?: string;
  onItemClick?: () => void;
}

export const DashboardNavLinks: React.FC<DashboardNavLinksProps> = ({
  pathname,
  role,
  onItemClick,
}) => {
  const isClient = role === 'CLIENT';

  const mainNavItems = [
    {
      label: 'Dashboard',
      href: isClient ? '/client/jobs' : '/freelancer/dashboard',
      icon: LayoutDashboard,
      active: isClient ? pathname === '/client/jobs' : pathname === '/freelancer/dashboard',
    },
    {
      label: isClient ? 'Post a Job' : 'Find Work',
      href: isClient ? '/client/jobs/new' : '/jobs',
      icon: isClient ? PlusCircle : Briefcase,
      active: isClient ? pathname === '/client/jobs/new' : pathname === '/jobs',
    },
    {
      label: isClient ? 'Find Talent' : 'Browse Talent',
      href: '/freelancers',
      icon: Users,
      active: pathname.startsWith('/freelancers'),
    },
    {
      label: 'Contracts',
      href: '/contracts',
      icon: FileCheck2,
      active: pathname.startsWith('/contracts'),
    },
    {
      label: 'Messages',
      href: '/messages',
      icon: MessageSquare,
      active: pathname.startsWith('/messages'),
    },
  ];

  const financialItems = [
    {
      label: 'Wallet & Funds',
      href: '/wallet',
      icon: Wallet,
      active: pathname.startsWith('/wallet'),
    },
    {
      label: 'Transactions',
      href: '/transactions',
      icon: Receipt,
      active: pathname.startsWith('/transactions'),
    },
    {
      label: 'Help & Resolutions',
      href: '/disputes',
      icon: ShieldAlert,
      active: pathname.startsWith('/disputes'),
    },
  ];

  const accountItems = [
    {
      label: isClient ? 'Company Settings' : 'Profile Settings',
      href: isClient ? '/client/settings' : '/freelancer/profile/edit',
      icon: UserCheck,
      active: isClient ? pathname === '/client/settings' : pathname === '/freelancer/profile/edit',
    },
  ];

  return (
    <div className="flex flex-col gap-6 py-2 px-3 overflow-y-auto">
      {/* Primary Workspace */}
      <div className="flex flex-col gap-1">
        <span className="px-3 text-[11px]  uppercase tracking-wider text-outline">
          Workspace
        </span>
        {mainNavItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group',
                item.active
                  ? 'bg-surface-container-high text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  item.active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Escrow & Finance */}
      <div className="flex flex-col gap-1">
        <span className="px-3 text-[11px]  uppercase tracking-wider text-outline">
          Payments &amp; Activity
        </span>
        {financialItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group',
                item.active
                  ? 'bg-surface-container-high text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  item.active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Account & Identity */}
      <div className="flex flex-col gap-1">
        <span className="px-3 text-[11px]  uppercase tracking-wider text-outline">
          Account
        </span>
        {accountItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition-all group',
                item.active
                  ? 'bg-surface-container-high text-primary font-semibold shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 transition-colors',
                  item.active ? 'text-primary' : 'text-on-surface-variant group-hover:text-primary'
                )}
              />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
