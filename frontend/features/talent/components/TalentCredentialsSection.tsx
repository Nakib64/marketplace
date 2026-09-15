import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Award } from 'lucide-react';

const VERIFIED_PROTECTIONS = [
  {
    title: 'Identity & Email Verified',
    subtitle: 'Verified talent account on Banglance',
    icon: ShieldCheck,
  },
  {
    title: 'Payment Protection Guarantee',
    subtitle: '100% Escrow protected contracts',
    icon: Lock,
  },
  {
    title: 'Milestone Delivery Escrow',
    subtitle: 'Multi-sig release upon sign-off',
    icon: CheckCircle2,
  },
  {
    title: 'Dispute Arbitration Ready',
    subtitle: 'Banglance protocol resolution support',
    icon: Award,
  },
];

export function TalentCredentialsSection() {
  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
      <h2 className="text-xl font-bold text-on-surface">Verified Protections &amp; Standards</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {VERIFIED_PROTECTIONS.map((cred) => {
          const Icon = cred.icon;
          return (
            <div
              key={cred.title}
              className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-on-surface truncate">{cred.title}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{cred.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
