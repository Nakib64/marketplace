import React from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export function BottomCTA() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 pb-20 pt-4 w-full">
      <div className="relative rounded-3xl bg-gradient-to-r from-surface-container to-surface-container-high p-8 md:p-14 shadow-xl overflow-hidden text-center border border-outline-variant/40">
        {/* Radial Accent Glow */}
        <div className="absolute -right-20 -bottom-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-72 h-72 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
          <span className="text-xs font-mono text-primary uppercase tracking-widest block mb-2 font-semibold">
            SECURE. FAIR. GUARANTEED.
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface tracking-tight mb-3">
            Ready to Experience True Freelance Security?
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-on-surface-variant mb-8 leading-relaxed">
            Join thousands of verified software engineers, designers, and clients building projects with instantaneous, escrow-protected settlements.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-primary text-surface font-semibold text-xs hover:bg-tertiary transition-all duration-200 shadow-md text-center cursor-pointer"
            >
              Join as a Freelancer
            </Link>
            <Link
              href="/client/jobs/new"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-surface-container-lowest text-on-surface border border-outline-variant/60 font-semibold text-xs hover:bg-surface-container transition-all duration-200 text-center shadow-xs cursor-pointer"
            >
              Post a Job for Free
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs font-mono text-outline">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Free Registration
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" /> 0% Chargebacks
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" /> Escrow Protected
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
