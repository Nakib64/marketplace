'use client';

import React, { useState, useEffect } from 'react';
import { adminJobsApi } from '@/lib/api/adminApi';
import { AdminJob } from '@/types/adminTypes';
import { Briefcase, X, Loader2, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  job: AdminJob | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function JobEditModal({ isOpen, job, onClose, onSuccess }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number>(0);
  const [status, setStatus] = useState<string>('OPEN');
  const [categoryName, setCategoryName] = useState('');
  const [subCategoryName, setSubCategoryName] = useState('');
  const [skillsString, setSkillsString] = useState('');
  const [adminReason, setAdminReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setTitle(job.title || '');
      setDescription(job.description || '');
      setBudget(Number(job.budget) || 0);
      setStatus(job.status || 'OPEN');
      setCategoryName(job.categoryName || job.category?.name || '');
      setSubCategoryName(job.subCategoryName || job.subCategory?.name || '');
      setSkillsString(job.skills ? job.skills.join(', ') : '');
      setAdminReason('');
    }
  }, [job, isOpen]);

  if (!isOpen || !job) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Job title cannot be empty.');

    const skillsArray = skillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    setIsLoading(true);
    try {
      await adminJobsApi.update(job.id, {
        title: title.trim(),
        description: description.trim(),
        budget: Number(budget),
        status: status as any,
        category: categoryName.trim() || undefined,
        subCategory: subCategoryName.trim() || undefined,
        skills: skillsArray,
        adminReason: adminReason.trim() || 'Job modified via Admin Gateway',
      });

      toast.success('Job details and status updated successfully.');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update job.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelJob = async () => {
    const reason = prompt('Please enter the administrative reason for force-canceling this job:');
    if (!reason) return;

    setIsLoading(true);
    try {
      await adminJobsApi.cancel(job.id, reason);
      toast.success('Job canceled and proposals updated.');
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel job.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Briefcase className="h-5 w-5" />
            <div>
              <h3 className="text-base font-bold text-on-surface">Edit &amp; Moderate Job Post</h3>
              <p className="text-xs text-on-surface-variant">Client: {job.client?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors cursor-pointer"
              >
                <option value="OPEN">OPEN (Accepting Proposals)</option>
                <option value="IN_PROGRESS">IN_PROGRESS (Contract Active)</option>
                <option value="COMPLETED">COMPLETED (Finished)</option>
                <option value="CANCELED">CANCELED (Closed / Void)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Escrow Budget (৳ BDT)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2 text-outline font-bold text-xs">৳</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full rounded-xl border border-outline-variant bg-white pl-8 pr-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Category Domain
              </label>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="e.g. Development, Design"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1.5">
                Subcategory
              </label>
              <input
                type="text"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                placeholder="e.g. Next.js, UI/UX"
                className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Required Skills (Comma separated)
            </label>
            <input
              type="text"
              value={skillsString}
              onChange={(e) => setSkillsString(e.target.value)}
              placeholder="e.g. React, NestJS, TypeScript, Tailwind"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Job Description
            </label>
            <textarea
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Audit Note / Reason for Moderation
            </label>
            <input
              type="text"
              value={adminReason}
              onChange={(e) => setAdminReason(e.target.value)}
              placeholder="e.g. Adjusted budget per client verification request"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-xs text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={handleCancelJob}
              disabled={isLoading || job.status === 'CANCELED'}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 transition-colors cursor-pointer disabled:opacity-40"
            >
              Force Cancel Job
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-[#108a00] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Job Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
