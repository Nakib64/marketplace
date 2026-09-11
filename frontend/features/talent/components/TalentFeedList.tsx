import React from 'react';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { Button } from '@/components/ui/Button';
import { FreelancerProfile } from '../types/talentTypes';
import { TalentCard } from './TalentCard';

interface TalentFeedListProps {
  freelancers: FreelancerProfile[];
  total: number;
  page: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (newPage: number) => void;
  onResetFilters: () => void;
}

export function TalentFeedList({
  freelancers,
  total,
  page,
  totalPages,
  isLoading,
  onPageChange,
  onResetFilters,
}: TalentFeedListProps) {
  return (
    <div className="flex-1 flex flex-col gap-6 w-full">
      {/* Feed Control Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-surface-container border border-outline-variant/30">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-on-surface">
            Explore {total} Verified Freelancers
          </h2>
          <span className="text-xs font-mono text-primary flex items-center gap-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Live
          </span>
        </div>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-surface-container border border-outline-variant/20 animate-pulse h-48"
            />
          ))}
        </div>
      ) : freelancers.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No Freelancers Found"
          description="Try adjusting your specialization, rate range, or search keywords."
          actionLabel="Reset All Filters"
          onAction={onResetFilters}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {freelancers.map((profile) => (
            <TalentCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <span className="text-xs font-mono text-on-surface-variant font-medium">
            Page {page} of {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
