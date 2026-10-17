'use client';

import React, { useState, useEffect } from 'react';
import { adminSkillsApi } from '@/lib/api/adminApi';
import { Skill } from '@/types/adminTypes';
import { Tag, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  skill?: Skill | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SkillModal({ isOpen, skill, onClose, onSuccess }: Props) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (skill) {
      setName(skill.name);
      setSlug(skill.slug);
      setCategory(skill.category || '');
      setIsActive(skill.isActive);
    } else {
      setName('');
      setSlug('');
      setCategory('');
      setIsActive(true);
    }
  }, [skill, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Skill name is required.');

    setIsLoading(true);
    try {
      if (skill) {
        await adminSkillsApi.update(skill.id, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          category: category.trim() || undefined,
          isActive,
        });
        toast.success(`Skill "${name}" updated.`);
      } else {
        await adminSkillsApi.create({
          name: name.trim(),
          slug: slug.trim() || undefined,
          category: category.trim() || undefined,
          isActive,
        });
        toast.success(`Skill "${name}" registered.`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save skill.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-md rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <Tag className="h-5 w-5" />
            <h3 className="text-base font-bold text-on-surface">
              {skill ? 'Edit Skill Tag' : 'Add New Skill'}
            </h3>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Skill Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!skill) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }
              }}
              placeholder="e.g. Next.js, Figma, Rust, DevOps"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Slug Identifier (Optional)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. next-js"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Skill Group / Domain (Optional)
            </label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Frontend Development, AI & ML, UI/UX"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="skill-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
            />
            <label htmlFor="skill-active" className="text-xs font-semibold text-on-surface cursor-pointer">
              Active Skill Tag (Selectable by freelancers &amp; job posters)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-xs font-bold rounded-xl border border-outline-variant hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-primary hover:bg-[#108a00] text-white transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              {skill ? 'Save Changes' : 'Register Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
