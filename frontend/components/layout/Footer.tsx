import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant/40 pt-12 pb-24 md:pb-12 text-on-surface-variant">
      <div className="max-w-[1280px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary-container flex items-center justify-center font-bold text-surface text-sm">
                B
              </div>
              <span className="text-lg font-bold text-on-surface">
                Bang<span className="text-primary">lance</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed text-on-surface-variant">
              The trusted freelance marketplace with automated escrow protection and local mobile payouts via bKash and Nagad.
            </p>
          </div>

          {/* Categories */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-on-surface text-sm mb-3">Categories</h4>
            <p><Link href="/jobs?category=development" className="hover:text-primary transition-colors">Development & IT</Link></p>
            <p><Link href="/jobs?category=design" className="hover:text-primary transition-colors">UI/UX & Design</Link></p>
            <p><Link href="/jobs?category=mobile" className="hover:text-primary transition-colors">Mobile Applications</Link></p>
            <p><Link href="/jobs?category=security" className="hover:text-primary transition-colors">Security & Audit</Link></p>
          </div>

          {/* Platform */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-on-surface text-sm mb-3">Platform</h4>
            <p><Link href="/jobs" className="hover:text-primary transition-colors">Browse Jobs</Link></p>
            <p><Link href="/freelancers" className="hover:text-primary transition-colors">Find Talent</Link></p>
            <p><Link href="/contracts" className="hover:text-primary transition-colors">Escrow Vaults</Link></p>
            <p><Link href="/wallet" className="hover:text-primary transition-colors">Local Payouts (bKash/Nagad)</Link></p>
          </div>

          {/* Trust & Guarantees */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-on-surface text-sm mb-3">Trust & Security</h4>
            <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/50 space-y-1.5">
              <span className="text-[10px] font-mono text-primary uppercase font-bold tracking-wider block">
                ESCROW PROTECTION
              </span>
              <p className="text-[11px] text-on-surface-variant leading-relaxed">
                Funds are held in secure escrow holding vaults until project deliverables are approved.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-outline">
          <p>© {new Date().getFullYear()} Banglance. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-primary font-semibold">SSLCommerz Secured</span>
            <span>•</span>
            <span>Double-Blind Feedback</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
