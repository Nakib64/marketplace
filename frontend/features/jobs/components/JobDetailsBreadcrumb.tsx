'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

interface JobDetailsBreadcrumbProps {
  categoryName?: string;
  categorySlug?: string;
  jobTitle: string;
}

export function JobDetailsBreadcrumb({
  categoryName = 'General',
  categorySlug,
  jobTitle,
}: JobDetailsBreadcrumbProps) {
  const user = useAuthStore((s) => s.user);
  const isClient = user?.role === 'CLIENT';

  const browseHref = isClient ? '/client/jobs' : '/jobs';
  const browseLabel = isClient ? 'My Job Posts' : 'Browse Jobs';
  const categoryHref = isClient
    ? `/freelancers?category=${categorySlug}`
    : categorySlug
      ? `/jobs?category=${categorySlug}`
      : '/jobs';

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-2 mb-6 overflow-x-auto whitespace-nowrap py-1 text-xs text-on-surface-variant"
    >
      <Link
        href="/"
        className="flex items-center gap-1.5 hover:text-on-surface transition-colors"
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-outline-variant shrink-0" />
      <Link
        href={browseHref}
        className="hover:text-on-surface transition-colors"
      >
        {browseLabel}
      </Link>
      {!isClient && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-outline-variant shrink-0" />
          <Link
            href={categoryHref}
            className="hover:text-on-surface transition-colors"
          >
            {categoryName}
          </Link>
        </>
      )}
      <ChevronRight className="w-3.5 h-3.5 text-outline-variant shrink-0" />
      <span className="text-on-surface font-semibold truncate max-w-[240px] sm:max-w-none">
        {jobTitle}
      </span>
    </nav>
  );
}
