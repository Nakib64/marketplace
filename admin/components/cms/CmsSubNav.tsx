'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Sparkles, BarChart3, MessageSquare, BadgeCheck, Layers, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

const CMS_NAV_ITEMS = [
  { label: 'Overview', href: '/cms', icon: Globe },
  { label: 'Hero & Showcase', href: '/cms/hero', icon: Sparkles },
  { label: 'Platform Metrics', href: '/cms/metrics', icon: BarChart3 },
  { label: 'Customer Stories', href: '/cms/testimonials', icon: MessageSquare },
  { label: 'Trusted Brands', href: '/cms/brands', icon: BadgeCheck },
  { label: 'Bottom CTAs', href: '/cms/cta', icon: Layers },
];

export function CmsSubNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 bg-white p-2 rounded-2xl border border-outline-variant shadow-xs">
      {CMS_NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0',
              isActive
                ? 'bg-primary text-white shadow-xs'
                : 'text-on-surface hover:bg-surface-container'
            )}
          >
            <Icon className="h-3.5 w-3.5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
