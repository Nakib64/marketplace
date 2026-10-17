'use client';

import React, { useState } from 'react';
import {
  GraduationCap,
  Plus,
  Trash2,
  Calendar,
  Loader2,
  X,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { freelancerApi } from '../api/freelancerApi';
import { Education } from '@/features/talent/types/talentTypes';

interface ProfileEducationSectionProps {
  educations: Education[];
  onRefresh: () => void;
}

export const ProfileEducationSection: React.FC<ProfileEducationSectionProps> = ({
  educations = [],
  onRefresh,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Education | null>(null);

  // Form states
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('');
  const [fieldOfStudy, setFieldOfStudy] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isCurrent, setIsCurrent] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setInstitution('');
    setDegree('');
    setFieldOfStudy('');
    setStartDate('');
    setEndDate('');
    setIsCurrent(false);
    setDescription('');
    setIsModalOpen(true);
  };

  const openEditModal = (edu: Education) => {
    setEditingItem(edu);
    setInstitution(edu.institution);
    setDegree(edu.degree);
    setFieldOfStudy(edu.fieldOfStudy || '');
    setStartDate(edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : '');
    setEndDate(edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : '');
    setIsCurrent(edu.isCurrent || false);
    setDescription(edu.description || '');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !degree.trim() || !startDate) {
      toast.error('Please provide institution name, degree, and start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingItem) {
        await freelancerApi.updateEducation(editingItem.id, {
          institution,
          degree,
          fieldOfStudy: fieldOfStudy.trim() || undefined,
          startDate: new Date(startDate).toISOString(),
          endDate: !isCurrent && endDate ? new Date(endDate).toISOString() : undefined,
          isCurrent,
          description: description.trim() || undefined,
        });
        toast.success('Education updated successfully!');
      } else {
        await freelancerApi.addEducation({
          institution,
          degree,
          fieldOfStudy: fieldOfStudy.trim() || undefined,
          startDate: new Date(startDate).toISOString(),
          endDate: !isCurrent && endDate ? new Date(endDate).toISOString() : undefined,
          isCurrent,
          description: description.trim() || undefined,
        });
        toast.success('Education added successfully!');
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Failed to save education.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this education entry?')) return;
    try {
      await freelancerApi.deleteEducation(id);
      toast.success('Education entry deleted.');
      onRefresh();
    } catch {
      toast.error('Failed to delete education entry.');
    }
  };

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Education &amp; Academic Degrees</h3>
            <p className="text-xs text-on-surface-variant">List your university degrees, diplomas, and academic background</p>
          </div>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" className="font-semibold">
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Education</span>
        </Button>
      </div>

      {educations.length === 0 ? (
        <div className="py-8 px-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-2">
          <GraduationCap className="w-8 h-8 text-on-surface-variant/40" />
          <h4 className="text-xs font-bold text-on-surface">No Education Listed</h4>
          <p className="text-[11px] text-on-surface-variant max-w-sm">
            Adding your academic background contributes 10% toward your profile completeness score.
          </p>
          <Button onClick={openAddModal} variant="secondary" size="sm" className="mt-2">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add Education</span>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {educations.map((edu) => {
            const startYear = edu.startDate ? new Date(edu.startDate).getFullYear() : '';
            const endYear = edu.isCurrent
              ? 'Present'
              : edu.endDate
                ? new Date(edu.endDate).getFullYear()
                : 'Present';

            return (
              <div
                key={edu.id}
                className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex items-start justify-between gap-4 group hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-on-surface">
                      {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                    </h4>
                    <p className="text-xs text-on-surface-variant font-medium mt-0.5">{edu.institution}</p>
                    <span className="inline-flex items-center gap-1 text-[11px] text-outline mt-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {startYear} – {endYear}
                    </span>
                    {edu.description && (
                      <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                        {edu.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => openEditModal(edu)}
                    aria-label="Edit education"
                    className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(edu.id)}
                    aria-label="Delete education"
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
                {editingItem ? 'Edit Education' : 'Add Education'}
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
                  School / University / Institution *
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. Bangladesh University of Engineering and Technology (BUET)"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Degree / Qualification *
                  </label>
                  <input
                    type="text"
                    required
                    value={degree}
                    onChange={(e) => setDegree(e.target.value)}
                    placeholder="e.g. Bachelor of Science (B.Sc.)"
                    className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                    Field of Study (Optional)
                  </label>
                  <input
                    type="text"
                    value={fieldOfStudy}
                    onChange={(e) => setFieldOfStudy(e.target.value)}
                    placeholder="e.g. Computer Science & Engineering"
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
                    End Date (or Expected)
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
                  id="isCurrentEdu"
                  checked={isCurrent}
                  onChange={(e) => setIsCurrent(e.target.checked)}
                  className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer"
                />
                <label htmlFor="isCurrentEdu" className="text-xs text-on-surface cursor-pointer select-none font-medium">
                  I am currently studying here
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Description / Achievements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Honors, thesis topic, relevant coursework..."
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
                    <span>{editingItem ? 'Update Education' : 'Add Education'}</span>
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
