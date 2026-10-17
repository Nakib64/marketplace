'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  TrendingUp,
  Users,
  Building,
  WalletCards,
  Briefcase,
  FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const ANALYTICS_NAV_ITEMS = [
  {
    label: 'Executive Radar',
    href: '/analytics',
    icon: TrendingUp,
    badge: 'Overview',
    color: 'emerald',
    iconColor: 'text-[#14a800]',
    iconBg: 'bg-[#14a800]/10',
    activeGradient: 'bg-gradient-to-r from-[#14a800] to-[#00b377]',
  },
  {
    label: 'Freelancer Talent',
    href: '/analytics/freelancers',
    icon: Users,
    badge: 'Supply',
    color: 'violet',
    iconColor: 'text-violet-600',
    iconBg: 'bg-violet-500/10',
    activeGradient: 'bg-gradient-to-r from-violet-600 to-indigo-600',
  },
  {
    label: 'Clients & Spend',
    href: '/analytics/clients',
    icon: Building,
    badge: 'Demand',
    color: 'blue',
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-500/10',
    activeGradient: 'bg-gradient-to-r from-blue-600 to-cyan-600',
  },
  {
    label: 'Cash Flow & Vault',
    href: '/analytics/cash-flow',
    icon: WalletCards,
    badge: 'Escrow',
    color: 'teal',
    iconColor: 'text-[#0f766e]',
    iconBg: 'bg-teal-500/10',
    activeGradient: 'bg-gradient-to-r from-[#0f766e] to-[#14a800]',
  },
  {
    label: 'Job Postings',
    href: '/analytics/jobs',
    icon: Briefcase,
    badge: 'Requisitions',
    color: 'amber',
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-500/10',
    activeGradient: 'bg-gradient-to-r from-amber-500 to-orange-600',
  },
  {
    label: 'Proposals & Bids',
    href: '/analytics/proposals',
    icon: FileText,
    badge: 'Conversion',
    color: 'pink',
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-500/10',
    activeGradient: 'bg-gradient-to-r from-pink-600 to-rose-600',
  },
];

export function AnalyticsSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none select-none">
      {ANALYTICS_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer shrink-0 border',
              isActive
                ? `${item.activeGradient} text-white border-transparent shadow-[0_2px_12px_-2px_rgba(0,0,0,0.18)]`
                : 'bg-white hover:bg-slate-50 text-on-surface-variant hover:text-on-surface border-[#eaecf0] shadow-[0_2px_8px_-3px_rgba(0,0,0,0.03)]'
            )}
          >
            <div
              className={cn(
                'w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors',
                isActive ? 'bg-white/20 text-white' : `${item.iconBg} ${item.iconColor}`
              )}
            >
              <Icon className="h-3.5 w-3.5 stroke-[2]" />
            </div>

            <span>{item.label}</span>

            {item.badge && (
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-bold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container text-outline'
                )}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
