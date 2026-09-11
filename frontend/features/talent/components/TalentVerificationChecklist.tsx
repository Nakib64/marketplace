import React from 'react';
import { ShieldCheck, Code, Lock, CheckCircle2 } from 'lucide-react';

export function TalentVerificationChecklist() {
  const items = [
    { label: 'Identity KYC Level 2', value: 'Verified', icon: ShieldCheck },
    { label: 'GitHub Contributions', value: '1,420 (Verified)', icon: Code },
    { label: 'Protocols Audited', value: 'Zero Exploits', icon: Lock },
    { label: 'Escrow Completion', value: '100% On-Time', icon: CheckCircle2 },
  ];

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
      <h3 className="text-sm font-bold text-on-surface">Protocol Verification</h3>
      <ul className="space-y-3 text-xs">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.label} className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-on-surface-variant">
                <Icon className="w-4 h-4 text-primary shrink-0" />
                {item.label}
              </span>
              <span className="font-mono text-on-surface font-semibold">{item.value}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
