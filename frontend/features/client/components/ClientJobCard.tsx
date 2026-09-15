'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ClientDisplayJob } from '../types/clientTypes';
import { EditJobModal } from './EditJobModal';
import { CancelJobModal } from './CancelJobModal';
import { DeleteJobModal } from './DeleteJobModal';

interface ClientJobCardProps {
  job: ClientDisplayJob;
  onRefresh?: () => void;
}

export const ClientJobCard: React.FC<ClientJobCardProps> = ({ job, onRefresh }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const proposalCount = job._count?.proposals ?? job.proposalsCount ?? 0;
  const publicSlug = job.slug || job.id;
  const isOpen = job.status === 'OPEN';
  const isInProgress = job.status === 'IN_PROGRESS';
  const isCompleted = job.status === 'COMPLETED';
  const isCanceled = job.status === 'CANCELED' || job.status === 'CANCELLED';

  const handleCopyLink = () => {
    const url = `${window.location.origin}/jobs/${publicSlug}`;
    navigator.clipboard.writeText(url);
    toast.success('Job posting link copied to clipboard!');
  };

  const getStatusBadge = () => {
    if (isOpen) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Open · Hiring</span>
        </span>
      );
    }
    if (isInProgress) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
          <span>In Progress</span>
        </span>
      );
    }
    if (isCompleted) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          <span>Completed</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
        <span className="w-1.5 h-1.5 rounded-full bg-on-surface-variant/60"></span>
        <span>Canceled</span>
      </span>
    );
  };

  return (
    <>
      <div className="bg-surface-container-low border border-outline-variant/30 hover:border-outline-variant/60 rounded-2xl p-5 lg:p-6 shadow-sm flex flex-col gap-4 transition-all duration-200 group">
        {/* Moderation Warning if Flagged */}
        {job.isFlagged && (
          <div className="p-3 rounded-xl bg-error/10 border border-error/20 flex items-start gap-2.5 text-xs text-error">
            <span className="material-symbols-outlined text-[18px] shrink-0">flag</span>
            <div className="flex flex-col gap-0.5">
              <span className="font-semibold">Listing under moderation review</span>
              <span className="text-[11px] opacity-90">{job.flagReason || 'Content scanned by anti-circumvention filter.'}</span>
            </div>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              {getStatusBadge()}
              {job.category?.name && (
                <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface text-xs font-medium border border-outline-variant/20">
                  {job.category.name}
                </span>
              )}
              {job.subCategory?.name && (
                <span className="px-2.5 py-0.5 rounded-md bg-surface-container text-on-surface-variant text-xs font-medium border border-outline-variant/20">
                  {job.subCategory.name}
                </span>
              )}
              <span className="text-on-surface-variant text-xs">
                Posted {new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
            </div>

            <Link href={`/jobs/${publicSlug}`} className="hover:text-primary transition-colors">
              <h3 className="text-lg font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">
                {job.title}
              </h3>
            </Link>
          </div>

          <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-0.5 shrink-0">
            <span className="text-xl font-extrabold text-on-surface">
              ৳{job.budget?.toLocaleString()} <span className="text-xs font-normal text-on-surface-variant">BDT</span>
            </span>
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px]">lock</span>
              Fixed Escrow
            </span>
          </div>
        </div>

        {/* Description Excerpt */}
        {job.description && (
          <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
            {job.description}
          </p>
        )}

        {/* Skills Tag Cloud */}
        {job.skills && job.skills.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 rounded-lg bg-surface-container text-on-surface-variant text-[11px] font-medium border border-outline-variant/20"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Proposals & Metrics Matrix Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-surface-container rounded-xl border border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">assignment_ind</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">{proposalCount} Proposals</span>
              <span className="text-[11px] text-on-surface-variant">
                {proposalCount > 0 ? 'Bids submitted' : 'Awaiting applicants'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">forum</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Client Workspace</span>
              <span className="text-[11px] text-on-surface-variant">Arbitrum Multi-sig</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px]">verified_user</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-on-surface">Protected Escrow</span>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">100% Guaranteed</span>
            </div>
          </div>
        </div>

        {/* Action Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-outline-variant/20">
          {/* Left Actions: Link & Share */}
          <div className="flex items-center gap-2">
            <Link
              href={`/jobs/${publicSlug}`}
              target="_blank"
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors flex items-center gap-1.5"
              title="View Public Listing"
            >
              <span className="material-symbols-outlined text-[15px]">open_in_new</span>
              <span>Public View</span>
            </Link>
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface-variant hover:text-on-surface text-xs font-medium transition-colors flex items-center gap-1.5"
              title="Copy link to clipboard"
            >
              <span className="material-symbols-outlined text-[15px]">content_copy</span>
              <span>Copy Link</span>
            </button>
          </div>

          {/* Right Actions: Edit, Cancel, Delete, Proposals */}
          <div className="flex items-center gap-2 flex-wrap">
            {isOpen && (
              <>
                <button
                  type="button"
                  onClick={() => setIsEditOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">edit</span>
                  <span>Edit</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsCancelOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-warning/10 hover:bg-warning/20 text-amber-600 dark:text-amber-400 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[15px]">cancel</span>
                  <span>Cancel</span>
                </button>
              </>
            )}

            {(isOpen || isCanceled) && (
              <button
                type="button"
                onClick={() => setIsDeleteOpen(true)}
                className="px-3 py-1.5 rounded-lg bg-error/10 hover:bg-error/20 text-error text-xs font-medium transition-colors flex items-center gap-1.5"
                title="Permanently delete job"
              >
                <span className="material-symbols-outlined text-[15px]">delete</span>
                <span>Delete</span>
              </button>
            )}

            <Link
              href={`/client/jobs/${job.id}/proposals`}
              className="px-4 py-1.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Review Proposals ({proposalCount})</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      <EditJobModal
        job={job}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={onRefresh}
      />

      {/* Cancel Job Modal */}
      <CancelJobModal
        job={job}
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        onSuccess={onRefresh}
      />

      {/* Delete Job Modal */}
      <DeleteJobModal
        job={job}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={onRefresh}
      />
    </>
  );
};
