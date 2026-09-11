import React from 'react';
import { Shield, GraduationCap, Award, BadgeCheck } from 'lucide-react';

const CREDENTIALS = [
  {
    title: 'CertiK Verified Auditor',
    subtitle: 'ID: CRTK-9921 • 2023',
    icon: Shield,
  },
  {
    title: 'OpenZeppelin Fellow',
    subtitle: 'Security Research Cohort 4',
    icon: GraduationCap,
  },
  {
    title: 'ConsenSys Academy Alum',
    subtitle: 'Smart Contract Dev Honors',
    icon: Award,
  },
  {
    title: 'Gitcoin Passport: 48.2',
    subtitle: 'Sybil Resistant Level 4',
    icon: BadgeCheck,
  },
];

export function TalentCredentialsSection() {
  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
      <h2 className="text-xl font-bold text-on-surface">Verified Credentials</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {CREDENTIALS.map((cred) => {
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
                <p className="text-[11px] font-mono text-on-surface-variant truncate">{cred.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
