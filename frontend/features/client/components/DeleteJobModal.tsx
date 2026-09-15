'use client';

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { ClientDisplayJob } from '../types/clientTypes';

interface DeleteJobModalProps {
  job: ClientDisplayJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DeleteJobModal: React.FC<DeleteJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (jobId: string) => jobsApi.deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.success('Job posting permanently deleted.');
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to delete job posting. Please ensure there are no active contracts.';
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
            <span className="material-symbols-outlined text-[22px]">delete_forever</span>
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold text-on-surface">Permanently Delete Job?</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Are you sure you want to permanently delete <strong className="text-on-surface">&quot;{job.title}&quot;</strong>?
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="p-3.5 rounded-xl bg-surface-container border border-outline-variant/30 text-xs text-on-surface-variant flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-error">
            <span className="material-symbols-outlined text-[16px]">warning</span>
            <span>Permanent Action:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 pl-1 text-[11px]">
            <li>This listing and all unaccepted proposals will be deleted permanently.</li>
            <li>This action cannot be undone.</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => deleteMutation.mutate(job.id)}
            disabled={deleteMutation.isPending}
            className="px-4 py-2 rounded-lg bg-error hover:bg-error/90 text-on-error text-xs font-semibold transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
          >
            {deleteMutation.isPending ? (
              <>
                <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[16px]">delete</span>
                <span>Yes, Delete Job</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
