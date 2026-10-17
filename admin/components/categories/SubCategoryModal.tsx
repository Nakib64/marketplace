'use client';

import React, { useState, useEffect } from 'react';
import { adminCategoriesApi } from '@/lib/api/adminApi';
import { SubCategory } from '@/types/adminTypes';
import { FolderTree, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  isOpen: boolean;
  categoryId: string;
  categoryName: string;
  subCategory?: SubCategory | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function SubCategoryModal({
  isOpen,
  categoryId,
  categoryName,
  subCategory,
  onClose,
  onSuccess,
}: Props) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (subCategory) {
      setName(subCategory.name);
      setSlug(subCategory.slug);
      setDescription(subCategory.description || '');
      setIsActive(subCategory.isActive);
    } else {
      setName('');
      setSlug('');
      setDescription('');
      setIsActive(true);
    }
  }, [subCategory, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error('Subcategory name is required.');

    setIsLoading(true);
    try {
      if (subCategory) {
        await adminCategoriesApi.updateSubCategory(subCategory.id, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          isActive,
        });
        toast.success(`Subcategory "${name}" updated successfully.`);
      } else {
        await adminCategoriesApi.addSubCategory(categoryId, {
          name: name.trim(),
          slug: slug.trim() || undefined,
          description: description.trim() || undefined,
          isActive,
        });
        toast.success(`Subcategory "${name}" added to ${categoryName}.`);
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to save subcategory.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg rounded-2xl border border-outline-variant bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
          <div className="flex items-center gap-2 text-primary">
            <FolderTree className="h-5 w-5" />
            <div>
              <h3 className="text-base font-bold text-on-surface">
                {subCategory ? 'Edit Subcategory' : 'Add Subcategory'}
              </h3>
              <p className="text-xs text-on-surface-variant">Under: {categoryName}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-outline hover:text-on-surface cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Subcategory Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!subCategory) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                }
              }}
              placeholder="e.g. Next.js Architecture"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              URL Slug (Optional)
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="e.g. nextjs-architecture"
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Specialized focus or tech stack details..."
              className="w-full rounded-xl border border-outline-variant bg-white px-3.5 py-2 text-sm text-on-surface focus:border-primary focus:outline-none transition-colors resize-none"
            />
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="sub-active"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-outline-variant text-primary focus:ring-primary h-4 w-4 cursor-pointer"
            />
            <label htmlFor="sub-active" className="text-xs font-semibold text-on-surface cursor-pointer">
              Active Subcategory
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
              {subCategory ? 'Save Changes' : 'Add Subcategory'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
