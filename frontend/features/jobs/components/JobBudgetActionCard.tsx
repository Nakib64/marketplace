import React from 'react';
import Link from 'next/link';
import { ArrowRight, Bookmark, BookmarkCheck, Zap, Settings, Users } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { Job } from '../types/jobsTypes';

interface JobBudgetActionCardProps {
  job: Job;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
}

export function JobBudgetActionCard({
  job,
  isBookmarked,
  onToggleBookmark,
}: JobBudgetActionCardProps) {
  const { user } = useAuthStore();
  const budgetNum = Number(job.budget) || 0;
  const isOwner = user?.id === job.clientId;
  const isClient = user?.role === 'CLIENT';

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-on-surface-variant uppercase tracking-wider">
          Fixed Price Budget
        </span>
        <span className="px-2 py-0.5 rounded bg-surface-container-high text-xs text-primary font-medium">
          Payment Protected
        </span>
      </div>

      {/* Budget Display */}
      <div className="mt-3 mb-1">
        <span className="text-3xl sm:text-4xl font-bold text-on-surface  tracking-tight">
          {formatCurrency(budgetNum)}
        </span>
      </div>
      <p className="text-xs text-on-surface-variant mb-6">
        Protected by Banglance. Released upon client milestone approval.
      </p>

      {/* Action Buttons */}
      <div className="flex flex-col gap-3">
        {isOwner ? (
          <Link href={`/client/jobs/${job.id}/proposals`} className="w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-lg shadow-primary-container/20 font-semibold"
            >
              <Users className="w-4 h-4 mr-1.5" />
              <span>Review Proposals ({job._count?.proposals || 0})</span>
            </Button>
          </Link>
        ) : isClient ? (
          <Link href="/client/jobs/new" className="w-full">
            <Button
              variant="secondary"
              size="lg"
              className="w-full justify-center font-semibold"
            >
              <span>Post a Similar Job</span>
            </Button>
          </Link>
        ) : (
          <Link href={`/jobs/${job.slug || job.id}/apply`} className="w-full">
            <Button
              variant="primary"
              size="lg"
              className="w-full justify-center shadow-lg shadow-primary-container/20 font-semibold"
            >
              <span>Submit a Proposal</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        )}

        <Button
          variant="secondary"
          size="lg"
          onClick={onToggleBookmark}
          className="w-full justify-center"
        >
          {isBookmarked ? (
            <>
              <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
              <span>Job Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 mr-2" />
              <span>Save Job</span>
            </>
          )}
        </Button>
      </div>

      {/* Bidding Credits Info */}
      <div className="mt-6 pt-4 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-primary" />
          Requires 2 Bidding Credits
        </span>
        <span className=" text-on-surface font-semibold">Available</span>
      </div>
    </section>
  );
}
