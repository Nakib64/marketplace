'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Briefcase, MessageSquare, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const pathname = usePathname();

  const items = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Jobs', href: '/jobs', icon: Briefcase },
    { label: 'Messages', href: '/messages', icon: MessageSquare },
    { label: 'Wallet', href: '/wallet', icon: Wallet },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/95 backdrop-blur-md border-t border-outline-variant/40">
      <div className="flex items-center justify-around py-2.5 px-3 max-w-md mx-auto">
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 transition-colors relative py-1 px-3 rounded-lg',
                isActive
                  ? 'text-primary font-semibold'
                  : 'text-on-surface-variant hover:text-on-surface'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-mono">{item.label}</span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-primary absolute -bottom-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
