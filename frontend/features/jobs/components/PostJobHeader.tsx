import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';

export function PostJobHeader() {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
        <Link href="/client/jobs" className="hover:text-primary transition-colors">
          Client Workspace
        </Link>
        <ChevronRight className="w-3 h-3 text-outline-variant shrink-0" />
        <Link href="/client/jobs" className="hover:text-primary transition-colors">
          Job RFPs
        </Link>
        <ChevronRight className="w-3 h-3 text-outline-variant shrink-0" />
        <span className="text-on-surface font-semibold">Create New Job Posting</span>
      </nav>

      {/* Main Title Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight">
            Post a Web3 Project RFP
          </h1>
          <p className="text-sm text-on-surface-variant max-w-2xl mt-1">
            Define project requirements, set autonomous milestone escrow, and tap into pre-vetted on-chain builders.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="px-3 py-1 rounded-full bg-surface-container-low text-xs font-mono text-on-surface-variant flex items-center gap-1.5 border border-outline-variant/30">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Draft Autosaved
          </span>
          <span className="hidden sm:flex items-center gap-1 text-xs font-mono text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20">
            <Sparkles className="w-3 h-3" />
            Escrow Protected
          </span>
        </div>
      </div>
    </div>
  );
}
