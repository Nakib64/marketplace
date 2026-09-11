import React from 'react';
import { Lock, ShieldCheck } from 'lucide-react';

export function JobSecurityCard() {
  return (
    <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-primary" />
        <h4 className="text-sm font-bold text-on-surface">Banglance Secure Escrow</h4>
      </div>
      <p className="text-xs text-on-surface-variant leading-relaxed">
        Milestone payments are securely held in automated escrow before work commences.
        Released exclusively upon milestone completion and mutual verification.
      </p>
      <div className="flex items-center gap-2 pt-1 text-xs text-secondary font-medium">
        <Lock className="w-3.5 h-3.5 shrink-0" />
        <span>SSLCommerz &amp; Zero chargeback protection active</span>
      </div>
    </section>
  );
}
