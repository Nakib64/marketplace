'use client';

import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { jobsApi } from '@/features/jobs/api/jobsApi';
import { ClientDisplayJob } from '../types/clientTypes';

interface EditJobModalProps {
  job: ClientDisplayJob | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditJobModal: React.FC<EditJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const queryClient = useQueryClient();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState<number | ''>('');
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  useEffect(() => {
    if (job) {
      setTitle(job.title || '');
      setDescription(job.description || '');
      setBudget(job.budget || '');
      setSkills(job.skills || []);
    }
  }, [job]);

  const updateMutation = useMutation({
    mutationFn: (payload: { title: string; description: string; budget: number; skills: string[] }) =>
      jobsApi.updateJob(job!.id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-jobs'] });
      toast.success('Job details updated successfully!');
      onSuccess?.();
      onClose();
    },
    onError: (err: unknown) => {
      const errorMsg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Failed to update job posting. Please check your inputs.';
      toast.error(errorMsg);
    },
  });

  if (!isOpen || !job) return null;

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter' && e.key !== ',') return;
    e.preventDefault();
    const trimmed = skillInput.trim().replace(/^,+|,+$/g, '');
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((s) => s !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Job title is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Job description is required');
      return;
    }
    if (!budget || Number(budget) <= 0) {
      toast.error('Please enter a valid budget in BDT (৳)');
      return;
    }

    updateMutation.mutate({
      title: title.trim(),
      description: description.trim(),
      budget: Number(budget),
      skills,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface-container-low border border-outline-variant/40 rounded-2xl p-6 shadow-2xl flex flex-col gap-6 text-on-surface"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[24px] text-primary">edit_note</span>
            <h3 className="text-lg font-bold text-on-surface">Edit Job Posting</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Job Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Senior Smart Contract Auditor"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Total Budget (৳ BDT)</label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm font-medium">৳</span>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value ? Number(e.target.value) : '')}
                placeholder="5000"
                min="10"
                step="1"
                className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-semibold">BDT</span>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-on-surface">Project Scope &amp; Deliverables</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              placeholder="Detailed description of deliverables, timeline, milestones, and requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors resize-y leading-relaxed"
              required
            />
          </div>

          {/* Skills Required */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-on-surface">Required Skills &amp; Tech Stack</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Type skill and press Enter..."
                className="flex-1 px-3.5 py-2 rounded-xl bg-surface-container border border-outline-variant/30 text-on-surface text-sm focus:outline-none focus:border-primary transition-colors"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-xs font-semibold transition-colors"
              >
                Add
              </button>
            </div>
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-container-high text-on-surface text-xs font-medium border border-outline-variant/30"
                  >
                    <span>{s}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(s)}
                      className="text-on-surface-variant hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={onClose}
              disabled={updateMutation.isPending}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold transition-colors shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {updateMutation.isPending ? (
                <>
                  <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[16px]">save</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
