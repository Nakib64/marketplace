import React from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';

export function PostJobHeader() {
  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant ">
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
            Post a Job
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:flex items-center gap-1 text-xs text-primary bg-primary/10 px-2.5 py-1 rounded-full border border-primary/20 font-medium">
            <Sparkles className="w-3 h-3" />
            Payment Protected
          </span>
        </div>
      </div>
    </div>
  );
}
