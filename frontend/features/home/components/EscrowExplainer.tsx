import React from 'react';
import { FileEdit, ShieldCheck, CheckCircle2, Banknote, Scale } from 'lucide-react';

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
      title: 'Deposit Protected Funds',
      description: 'Funds are held securely via SSLCommerz gateway. Freelancer sees guaranteed funds before work starts.',
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
      icon: Banknote,
    },
  ];

  return (
    <section className="w-full bg-[#13544e] py-20 px-4 md:px-8 text-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="max-w-2xl mb-14">
          <span className="text-xs uppercase font-bold text-[#14a800] bg-white px-3 py-1 rounded-full inline-block mb-3">
            TRUST &amp; SAFETY
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight mb-4">
            Why businesses turn to Banglance
          </h2>
          <p className="text-base text-emerald-100/80 leading-relaxed">
            The world’s work marketplace with built-in financial protection, double-blind reviews, and automated local payouts.
          </p>
        </div>

        {/* Upwork 3-Value Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#5eead4]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-serif tracking-tight">Proof of quality</h3>
            </div>
            <p className="text-sm text-emerald-100/70 leading-relaxed pl-13">
              Check any pro’s work samples, client reviews, and verified skill badges before you ever make an offer.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#5eead4]">
                <FileEdit className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-serif tracking-tight">No cost until you hire</h3>
            </div>
            <p className="text-sm text-emerald-100/70 leading-relaxed pl-13">
              Interview potential fits for your job, negotiate hourly or milestone rates, and only pay for deliverables you inspect and approve.
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-[#5eead4]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold font-serif tracking-tight">Safe and secure</h3>
            </div>
            <p className="text-sm text-emerald-100/70 leading-relaxed pl-13">
              Focus on your product knowing our institutional escrow vault holds your funds safely with zero chargeback risk.
            </p>
          </div>
        </div>

        {/* Upwork Escrow 4-Step Pipeline Tray */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm">
          {steps.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.step} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-emerald-300 font-mono tracking-wider">{item.step}</span>
                  <Icon className="w-4 h-4 text-[#5eead4]" />
                </div>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
                <p className="text-xs text-emerald-100/70 leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
