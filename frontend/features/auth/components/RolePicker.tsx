'use client';

import React from 'react';
import { Building2, Terminal, CheckCircle2 } from 'lucide-react';
import { UserRole } from '@/types/user';
import { cn } from '@/lib/utils';

interface RolePickerProps {
  selectedRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export function RolePicker({ selectedRole, onSelectRole }: RolePickerProps) {
  const roles = [
    {
      id: 'CLIENT' as UserRole,
      title: 'I want to hire talent',
      typeLabel: 'PROTOCOL TYPE: CLIENT',
      description: 'Post jobs, fund secure milestone escrows, and recruit verified talent.',
      icon: Building2,
      points: [
        'Secure milestone escrow vaults',
        'Direct deliverables inspection',
        'SSLCommerz & cards payment',
      ],
    },
    {
      id: 'FREELANCER' as UserRole,
      title: 'I want to find work',
      typeLabel: 'PROTOCOL TYPE: TALENT',
      description: 'Submit proposals, get hired by verified clients, and receive guaranteed payouts.',
      icon: Terminal,
      popular: true,
      points: [
        'Guaranteed escrow release on approval',
        'Instant bKash & Nagad local payouts',
        'Non-retaliatory double-blind reviews',
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {roles.map((item) => {
        const isSelected = selectedRole === item.id;
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            onClick={() => onSelectRole(item.id)}
            className={cn(
              'group relative cursor-pointer rounded-xl p-5 transition-all duration-200 flex flex-col justify-between border select-none',
              isSelected
                ? 'bg-surface-container-high border-primary shadow-md shadow-primary/5'
                : 'bg-surface-container-low border-outline-variant/50 hover:bg-surface-container hover:border-outline-variant'
            )}
          >
            <div>
              {/* Header: Icon & Radio */}
              <div className="flex items-start justify-between mb-3">
                <div
                  className={cn(
                    'w-10 h-10 rounded-lg flex items-center justify-center transition-colors',
                    isSelected
                      ? 'bg-surface-container-highest text-primary'
                      : 'bg-surface-container text-on-surface-variant group-hover:text-primary'
                  )}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div
                  className={cn(
                    'w-5 h-5 rounded-full flex items-center justify-center border transition-all',
                    isSelected
                      ? 'border-primary bg-primary/20'
                      : 'border-outline-variant bg-surface-container'
                  )}
                >
                  {isSelected && <div className="w-2 h-2 rounded-full bg-primary" />}
                </div>
              </div>

              {/* Title & Badge */}
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base font-bold text-on-surface">{item.title}</h3>
                {item.popular && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                    POPULAR
                  </span>
                )}
              </div>
              <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">{item.description}</p>

              {/* Feature Points */}
              <div className="space-y-1.5 pt-1">
                {item.points.map((point) => (
                  <div key={point} className="flex items-center gap-2 text-xs text-on-surface">
                    <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span>{point}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Tag */}
            <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between text-[11px] font-mono">
              <span className={isSelected ? 'text-primary font-semibold' : 'text-on-surface-variant'}>
                {item.typeLabel}
              </span>
              <span className={isSelected ? 'text-primary' : 'text-on-surface-variant group-hover:text-on-surface'}>
                {isSelected ? 'Active ✓' : 'Select →'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
