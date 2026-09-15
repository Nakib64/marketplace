'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { ClientDisplayJob } from '../types/clientTypes';

interface CancelJobModalProps {
  job: ClientDisplayJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CancelJobModal: React.FC<CancelJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const cancelMutation = useMutation({
    mutationFn: (jobId: string) => jobsApi.cancelJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.success('Job posting has been canceled successfully.');
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to cancel job posting. Please try again.';
      toast.error(errorMsg);
    },
  });

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-5 text-on-surface"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-full bg-error/15 text-error flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">warning</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-on-surface">Cancel Job Posting?</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to cancel <strong className="text-on-surface">&quot;{job.title}&quot;</strong>?
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-on-surface">
            <span className="material-symbols-outlined text-[16px] text-error">info</span>
            <span>What happens next:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            <li>Freelancers will no longer be able to submit new proposals.</li>
            <li>The job listing status will be set to Canceled.</li>
            <li>Existing proposals and interview records will remain accessible in your history.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={cancelMutation.isPending}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Keep Listing Active
          </button>
          <button
            type="button"
            onClick={() => cancelMutation.mutate(job.id)}
            disabled={cancelMutation.isPending}
            className="px-4 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {cancelMutation.isPending ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Cancelling...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">cancel</span>
                <span>Yes, Cancel Job</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
