'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sliders,
  ShieldCheck,
  WalletCards,
  FileCheck,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SETTINGS_TABS = [
  {
    label: 'General & Circuit Breakers',
    href: '/settings',
    icon: Sliders,
    badge: 'Kill Switches',
  },
  {
    label: 'Security & Access (SSO/MFA)',
    href: '/settings/security',
    icon: ShieldCheck,
    badge: 'Enterprise',
  },
  {
    label: 'Escrow & Gateways',
    href: '/settings/billing',
    icon: WalletCards,
    badge: 'bKash/SSL',
  },
  {
    label: 'KYC & Compliance',
    href: '/settings/compliance',
    icon: FileCheck,
    badge: 'AML/Tax',
  },
  {
    label: 'Webhooks & Alerts',
    href: '/settings/notifications',
    icon: Bell,
    badge: 'Events',
  },
];

export function EnterpriseSettingsSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-outline-variant/80 scrollbar-none select-none">
      {SETTINGS_TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer shrink-0',
              isActive
                ? 'bg-primary text-white shadow-xs'
                : 'bg-white hover:bg-surface-container text-on-surface-variant hover:text-on-surface border border-outline-variant/60'
            )}
          >
            <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-outline')} />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={cn(
                  'text-[10px] px-2 py-0.5 rounded-full font-bold',
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-surface-container text-outline'
                )}
              >
                {tab.badge}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
