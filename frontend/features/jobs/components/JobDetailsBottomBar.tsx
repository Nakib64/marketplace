import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Job } from '../types/jobsTypes';

interface JobDetailsBottomBarProps {
  job: Job;
}

export function JobDetailsBottomBar({ job }: JobDetailsBottomBarProps) {
  const budgetNum = Number(job.budget) || 0;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-4">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold text-on-surface font-mono">
              {formatCurrency(budgetNum)}
            </span>
          </div>
          <span className="text-[11px] text-on-surface-variant leading-tight">
            Fixed Price • Escrow Protected
          </span>
        </div>

        <Link href={`/jobs/${job.id}/apply`} className="shrink-0">
          <Button
            variant="primary"
            size="md"
            className="px-5 shadow-lg shadow-primary-container/25 font-semibold"
          >
            <span>Submit Proposal</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
