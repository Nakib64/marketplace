'use client';

import React from 'react';
import Link from 'next/link';

interface WorkroomTopNavProps {
  activeTitle: string;
}

export const WorkroomTopNav: React.FC<WorkroomTopNavProps> = ({ activeTitle }) => {
  return (
    <section className="w-full px-4 sm:px-6 py-2.5 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between text-xs">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap text-on-surface-variant font-medium">
        <Link href="/client/jobs" className="hover:text-on-surface transition-colors">Client Workspace</Link>
        <span>/</span>
        <span className="hover:text-on-surface cursor-pointer">Secure Workrooms</span>
        <span>/</span>
        <span className="text-on-surface font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          {activeTitle}
        </span>
      </nav>

      <div className="hidden sm:flex items-center gap-3 font-mono text-[11px]">
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant border border-outline-variant/20">
          <span className="text-primary font-semibold">XMTP:</span> EIP-1271 Keybound
        </div>
        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-low text-on-surface-variant border border-outline-variant/20">
          <span className="text-secondary font-semibold">Lit Protocol:</span> Access Control v3
        </div>
      </div>
    </section>
  );
};
