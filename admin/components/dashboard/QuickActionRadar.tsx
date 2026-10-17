'use client';

import React from 'react';
import { WalletCards, Scale, Sliders, Users, ArrowRight } from 'lucide-react';

export function QuickActionRadar() {
  const actions = [
    {
      title: 'Review Payout Queue',
      desc: 'Verify bKash & Nagad withdrawal requests and dispatch funds.',
      href: '/payouts',
      icon: WalletCards,
    },
    {
      title: 'Arbitrate Disputes',
      desc: 'Inspect contract transcripts, verify deliverables, and issue rulings.',
      href: '/disputes',
      icon: Scale,
    },
    {
      title: 'User Governance',
      desc: 'Manage roles, verify identities, or execute risk suspensions.',
      href: '/users',
      icon: Users,
    },
    {
      title: 'Emergency Switches',
      desc: 'Control platform kill switches and commission adjustments.',
      href: '/settings',
      icon: Sliders,
    },
  ];

  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-2xs">
      <h2 className="text-sm font-bold text-on-surface tracking-wide uppercase mb-4">
        Operational Quick Dispatch
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actions.map((act, idx) => {
          const Icon = act.icon;
          return (
            <a
              key={idx}
              href={act.href}
              className="group flex items-start gap-4 p-4 rounded-xl bg-surface-container-low border border-outline-variant hover:border-primary hover:bg-white hover:shadow-xs transition-all cursor-pointer"
            >
              <div className="p-2.5 rounded-lg bg-surface-container text-primary group-hover:bg-primary group-hover:text-white transition-all">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="mb-1">
                  <span className="text-xs font-bold text-on-surface group-hover:text-primary transition-colors">
                    {act.title}
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant leading-relaxed">{act.desc}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-outline group-hover:text-primary group-hover:translate-x-0.5 transition-all mt-1" />
            </a>
          );
        })}
      </div>
    </div>
  );
}
