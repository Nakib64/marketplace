import React from 'react';
import { FileEdit, ShieldCheck, CheckCircle2, DollarSign, Scale } from 'lucide-react';

export function EscrowExplainer() {
  const steps = [
    {
      step: 'STEP 01',
      title: 'Post & Agree Terms',
      description: 'Client posts scope or hires freelancer with locked milestones, clear deliverables, and dispute parameters.',
      tag: 'Milestone terms recorded',
      icon: FileEdit,
    },
    {
      step: 'STEP 02',
      title: 'Fund Safe Escrow',
      description: 'Funds locked securely in escrow via SSLCommerz gateway. Freelancer sees guaranteed funds before work starts.',
      tag: '100% Funds Guaranteed',
      icon: ShieldCheck,
      highlight: true,
    },
    {
      step: 'STEP 03',
      title: 'Work & Deliverables Review',
      description: 'Freelancer completes work and submits deliverables through the contract portal. Client inspects deliverables.',
      tag: 'Verified submission trail',
      icon: CheckCircle2,
    },
    {
      step: 'STEP 04',
      title: 'Instant Payout Release',
      description: 'Client clicks Approve, and funds release instantly into the freelancer wallet for bKash or Nagad withdrawal.',
      tag: 'Instant wallet release',
      icon: DollarSign,
    },
  ];

  return (
    <section className="w-full bg-surface-container-lowest py-16 px-4 md:px-8 border-y border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-primary uppercase tracking-widest block mb-1.5 font-semibold">
            FINANCIAL PROTECTION
          </span>
          <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight mb-2">
            How Smart Escrow Protects You
          </h2>
          <p className="text-xs md:text-sm text-on-surface-variant leading-relaxed">
            Funds are held securely in escrow holding vaults. Clients only pay for approved deliverables, and freelancers are 100% guaranteed to get paid.
          </p>
        </div>

        {/* 4-Step Escrow Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="p-6 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-xs flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-primary font-bold mb-4 flex items-center justify-between">
                    <span>{item.step}</span>
                    <Icon className="w-5 h-5 text-outline" />
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-2">{item.title}</h3>
                  <p className="text-xs text-on-surface-variant leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>
                <div className="pt-3 border-t border-outline-variant/30 text-[11px] font-mono font-semibold text-primary">
                  {item.tag}
                </div>
              </div>
            );
          })}
        </div>

        {/* Trust Callout Banner */}
        <div className="p-6 rounded-2xl bg-surface-container border border-outline-variant/50 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm md:text-base font-bold text-on-surface">
                Zero Chargeback Fraud &amp; Double-Blind Review System
              </h4>
              <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                Client payments are securely locked in escrow. Reviews remain strictly concealed until both parties submit, preventing retaliatory ratings.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/40 text-primary">
              SSLCommerz Secure
            </span>
            <span className="px-3 py-1.5 rounded-full bg-surface-container-high border border-outline-variant/40 text-secondary">
              bKash / Nagad
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
