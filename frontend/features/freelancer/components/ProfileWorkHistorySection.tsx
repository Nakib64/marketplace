'use client';

import React, { useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Calendar,
  MapPin,
  Loader2,
  X,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { freelancerApi } from '../api/freelancerApi';
import { WorkHistory } from '@/features/talent/types/talentTypes';

interface ProfileWorkHistorySectionProps {
  workHistories: WorkHistory[];
  onRefresh: () => void;
}

export const ProfileWorkHistorySection: React.FC<ProfileWorkHistorySectionProps> = ({
  workHistories = [],
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WorkHistory | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setCompany('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: WorkHistory) => {
    setEditingItem(item);
    setTitle(item.title || item.position || '');
    setCompany(item.company);
    setLocation(item.location || '');
    setStartDate(item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '');
    setEndDate(item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '');
    setIsCurrent(item.isCurrent || false);
    setDescription(item.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !company.trim() || !startDate) {
      toast.error('Please provide job title, company name, and start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await freelancerApi.updateWorkHistory(editingItem.id, {
          title,
          company,
          location: location.trim() || undefined,
          startDate: new Date(startDate).toISOString(),
          endDate: !isCurrent && endDate ? new Date(endDate).toISOString() : undefined,
          isCurrent,
          description: description.trim() || undefined,
        });
        toast.success('Work history updated successfully!');
      } else {
        await freelancerApi.addWorkHistory({
          title,
          company,
          location: location.trim() || undefined,
          startDate: new Date(startDate).toISOString(),
          endDate: !isCurrent && endDate ? new Date(endDate).toISOString() : undefined,
          isCurrent,
          description: description.trim() || undefined,
        });
        toast.success('Work history added successfully!');
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Failed to save work history.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this work history entry?')) return;
    try {
      await freelancerApi.deleteWorkHistory(id);
      toast.success('Work history deleted.');
      onRefresh();
    } catch {
      toast.error('Failed to delete work history.');
    }
  };

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Previous Work History</h3>
            <p className="text-xs text-on-surface-variant">Detail your past employment, freelancing roles, and project leadership</p>
          </div>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" className="font-semibold">
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Experience</span>
        </Button>
      </div>

      {workHistories.length === 0 ? (
        <div className="py-8 px-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-2">
          <Briefcase className="w-8 h-8 text-on-surface-variant/40" />
          <h4 className="text-xs font-bold text-on-surface">No Work History Added</h4>
          <p className="text-[11px] text-on-surface-variant max-w-sm">
            Adding previous employment and consulting roles contributes 15% toward your profile completeness score.
          </p>
          <Button onClick={openAddModal} variant="secondary" size="sm" className="mt-2">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add First Role</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {workHistories.map((work) => {
            const startStr = work.startDate
              ? new Date(work.startDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })
              : '';
            const endStr = work.isCurrent
              ? 'Present'
              : work.endDate
                ? new Date(work.endDate).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                : 'Present';

            return (
              <div
                key={work.id}
                className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex items-start justify-between gap-4 group hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">
                      {work.title || work.position}
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">
                      {work.company}
                    </p>

                    <div className="flex flex-wrap items-center gap-3 mt-1.5 text-[11px] text-outline">
                      <span className="flex items-center gap-1 font-mono">
                        <Calendar className="w-3 h-3" />
                        {startStr} – {endStr}
                      </span>
                      {work.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-primary" />
                          {work.location}
                        </span>
                      )}
                    </div>

                    {work.description && (
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                        {work.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(work)}
                    aria-label="Edit work history"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(work.id)}
                    aria-label="Delete work history"
                    className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container rounded-2xl p-6 border border-outline-variant/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface">
                {editingItem ? 'Edit Work History' : 'Add Work History'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Job Title / Position *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Lead Frontend Architect"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Company / Client Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Brain Station 23 / Remote Agency"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Location (Optional)
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Dhaka, Bangladesh (Remote)"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    disabled={isCurrent}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary disabled:opacity-40"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCurrentWork"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isCurrentWork" className="text-xs text-on-surface cursor-pointer select-none font-medium">
                  I currently work in this role
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Description &amp; Key Deliverables (Optional)
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summarize core tech stack, team size, key metrics delivered..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Update Role' : 'Add Role'}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
