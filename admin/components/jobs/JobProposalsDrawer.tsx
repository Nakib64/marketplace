'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminJobsApi } from '@/lib/api/adminApi';
import { AdminJob, AdminProposal } from '@/types/adminTypes';
import {
  FileText,
  X,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  User,
} from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  job: AdminJob | null;
  onClose: () => void;
}

export function JobProposalsDrawer({ isOpen, job, onClose }: Props) {
  const queryClient = useQueryClient();
  const [updatingProposalId, setUpdatingProposalId] = useState<string | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-job-proposals', job?.id],
    queryFn: () => (job ? adminJobsApi.getProposals(job.id) : null),
    enabled: !!job && isOpen,
  });

  if (!isOpen || !job) return null;

  const proposals: AdminProposal[] = data?.proposals || [];

  const handleUpdateStatus = async (proposalId: string, newStatus: 'ACCEPTED' | 'REJECTED' | 'PENDING') => {
    setUpdatingProposalId(proposalId);
    try {
      await adminJobsApi.updateProposalStatus(proposalId, newStatus, 'Status changed by Admin Gateway');
      toast.success(`Proposal marked as ${newStatus}.`);
      queryClient.invalidateQueries({ queryKey: ['admin-job-proposals', job.id] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update proposal status.');
    } finally {
      setUpdatingProposalId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs">
      <div className="w-full max-w-xl h-full bg-white border-l border-outline-variant shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-5 border-b border-outline-variant flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#eaf5ea] text-primary flex items-center justify-center font-bold text-xs">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-on-surface line-clamp-1">Proposals: {job.title}</h3>
              <p className="text-[11px] text-on-surface-variant">
                Budget: ৳{Number(job.budget).toLocaleString()} • {proposals.length} submissions
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
              <span className="text-xs text-outline font-medium">Loading submitted proposals...</span>
            </div>
          ) : isError ? (
            <div className="p-4 rounded-xl bg-red-50 text-red-600 text-xs text-center border border-red-200">
              Failed to load proposals for this job post.
            </div>
          ) : proposals.length === 0 ? (
            <div className="text-center py-16">
              <FileText className="h-10 w-10 text-outline mx-auto mb-2 opacity-50" />
              <h4 className="text-xs font-bold text-on-surface">No proposals submitted yet</h4>
              <p className="text-[11px] text-outline mt-1">This job post has not received any freelancer bids.</p>
            </div>
          ) : (
            proposals.map((prop) => {
              const isUpdating = updatingProposalId === prop.id;
              const fProfile = prop.freelancer?.freelancerProfile;

              return (
                <div
                  key={prop.id}
                  className="p-4 rounded-2xl border border-outline-variant bg-white hover:border-primary/40 transition-colors shadow-2xs space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] flex items-center justify-center text-primary font-bold text-xs">
                        <User className="h-4 w-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-on-surface">{prop.freelancer?.email}</h4>
                        <p className="text-[10px] text-on-surface-variant">
                          {fProfile?.title || 'Freelancer'} • ★ {fProfile?.rating?.toFixed(1) || '0.0'}
                        </p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-black text-primary">
                        ৳{Number(prop.bidAmount).toLocaleString()}
                      </span>
                      <div className="mt-0.5">
                        {prop.status === 'ACCEPTED' ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-[#14a800] bg-[#eaf5ea] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-2.5 w-2.5" /> Accepted
                          </span>
                        ) : prop.status === 'REJECTED' ? (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            <XCircle className="h-2.5 w-2.5" /> Rejected
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                            <Clock className="h-2.5 w-2.5" /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cover letter */}
                  <div className="bg-[#f9faf9] p-3 rounded-xl border border-outline-variant/60 text-xs text-on-surface-variant leading-relaxed">
                    <span className="text-[10px] uppercase font-bold text-outline block mb-1">Cover Pitch</span>
                    <p className="whitespace-pre-wrap">{prop.coverLetter}</p>
                  </div>

                  {/* Moderate status */}
                  <div className="flex items-center justify-between pt-1 text-xs">
                    <span className="text-[10px] text-outline">
                      Submitted: {new Date(prop.createdAt).toLocaleDateString()}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {prop.status !== 'ACCEPTED' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(prop.id, 'ACCEPTED')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-[#eaf5ea] text-primary hover:bg-primary hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Accept
                        </button>
                      )}
                      {prop.status !== 'REJECTED' && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() => handleUpdateStatus(prop.id, 'REJECTED')}
                          className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                          Reject
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
