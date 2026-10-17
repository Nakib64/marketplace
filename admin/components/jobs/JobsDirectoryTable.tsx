'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminJobsApi } from '@/lib/api/adminApi';
import { AdminJob } from '@/types/adminTypes';
import {
  Briefcase,
  Search,
  Filter,
  FileText,
  Edit2,
  Loader2,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import { JobEditModal } from './JobEditModal';
import { JobProposalsDrawer } from './JobProposalsDrawer';

interface Props {
  initialCategory?: string;
  onlyFlagged?: boolean;
  nicheTitle?: string;
}

export function JobsDirectoryTable({ initialCategory, onlyFlagged, nicheTitle }: Props = {}) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<AdminJob | null>(null);
  const [selectedJobForProposals, setSelectedJobForProposals] = useState<AdminJob | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-jobs', page, search, statusFilter, initialCategory, onlyFlagged],
    queryFn: () =>
      adminJobsApi.getAll({
        page,
        limit: 15,
        q: search || undefined,
        status: statusFilter || undefined,
        category: initialCategory || undefined,
        isFlagged: onlyFlagged ? true : undefined,
      }),
  });

  const rawJobs = data?.jobs || [];
  const jobs: AdminJob[] = Array.isArray(rawJobs) ? rawJobs : [];
  const pagination = data?.pagination || { page: 1, totalPages: 1, total: 0 };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eaf5ea] text-[#14a800]">OPEN</span>;
      case 'IN_PROGRESS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600">IN PROGRESS</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-600">COMPLETED</span>;
      case 'CANCELED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-50 text-red-600">CANCELED</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-outline-variant shadow-xs">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-outline ml-1 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search job postings by title, keywords, or description..."
            className="w-full text-xs text-on-surface bg-transparent focus:outline-none placeholder:text-outline"
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Filter className="h-4 w-4 text-outline shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs font-semibold text-on-surface bg-[#f9faf9] border border-outline-variant rounded-xl px-3 py-1.5 focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="OPEN">Open Only</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-16">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
            <span className="text-xs text-outline font-medium">Loading marketplace jobs...</span>
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-red-600 bg-red-50 text-xs">
            Failed to load jobs. Please try refreshing.
          </div>
        ) : jobs.length === 0 ? (
          <div className="p-12 text-center">
            <Briefcase className="h-10 w-10 text-outline mx-auto mb-2 opacity-50" />
            <h3 className="text-xs font-bold text-on-surface mb-1">No job posts found</h3>
            <p className="text-[11px] text-outline">Try clearing filters or search keywords.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant bg-[#f9faf9] text-[11px] font-bold uppercase text-outline tracking-wider">
                  <th className="py-3 px-4">Job Title &amp; Client</th>
                  <th className="py-3 px-4">Domain Category</th>
                  <th className="py-3 px-4">Budget</th>
                  <th className="py-3 px-4">Proposals</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 text-xs">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="py-3 px-4">
                      <div className="max-w-md">
                        <div className="flex items-center gap-1.5 font-bold text-on-surface hover:text-primary transition-colors cursor-pointer"
                          onClick={() => setSelectedJobForEdit(job)}>
                          <span className="line-clamp-1">{job.title}</span>
                          {job.isFlagged && (
                            <span title="Job Flagged" className="text-amber-500">
                              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-outline mt-0.5">
                          by {job.client?.clientProfile?.companyName || job.client?.email}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] text-xs font-semibold text-on-surface">
                        {job.categoryName || job.category?.name || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-black text-primary text-xs">
                      ৳{Number(job.budget).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => setSelectedJobForProposals(job)}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-outline-variant hover:border-primary hover:bg-[#eaf5ea] text-xs font-semibold text-on-surface cursor-pointer transition-colors"
                      >
                        <FileText className="h-3 w-3 text-primary" />
                        <span>{job._count?.proposals || 0} bids</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      {getStatusBadge(job.status)}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedJobForProposals(job)}
                          className="px-2.5 py-1 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-semibold text-on-surface cursor-pointer transition-colors"
                        >
                          Proposals
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedJobForEdit(job)}
                          className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-primary cursor-pointer transition-colors"
                          title="Edit & Moderate"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="p-3 border-t border-outline-variant/60 bg-[#f9faf9] text-xs text-outline flex items-center justify-between">
          <span>
            Total: {pagination.total || 0} jobs (Page {pagination.page || 1} of {pagination.totalPages || 1})
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              disabled={page >= (pagination.totalPages || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Edit Job Modal */}
      <JobEditModal
        isOpen={!!selectedJobForEdit}
        job={selectedJobForEdit}
        onClose={() => setSelectedJobForEdit(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-jobs'] })}
      />

      {/* Proposals Drawer */}
      <JobProposalsDrawer
        isOpen={!!selectedJobForProposals}
        job={selectedJobForProposals}
        onClose={() => setSelectedJobForProposals(null)}
      />
    </div>
  );
}
