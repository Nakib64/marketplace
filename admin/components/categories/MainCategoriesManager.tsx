'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCategoriesApi } from '@/lib/api/adminApi';
import { Category } from '@/types/adminTypes';
import { FolderTree, Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Loader2, Layers } from 'lucide-react';
import { CategoryModal } from './CategoryModal';
import { toast } from 'sonner';

export function MainCategoriesManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const { data: categories = [], isLoading, isError } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => adminCategoriesApi.getAll(true),
  });

  const handleOpenAdd = () => {
    setSelectedCategory(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setIsModalOpen(true);
  };

  const handleDelete = async (cat: Category) => {
    if (!confirm(`Are you sure you want to permanently delete category "${cat.name}"?`)) return;
    try {
      await adminCategoriesApi.delete(cat.id);
      toast.success(`Category "${cat.name}" deleted.`);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Primary Categories Management</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Create, inspect, and configure high-level industry domains on the marketplace.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Primary Category</span>
        </button>
      </div>

      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-outline-variant shadow-xs">
        <Search className="h-4 w-4 text-outline shrink-0 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter primary categories by name or slug..."
          className="w-full text-xs text-on-surface bg-transparent focus:outline-none placeholder:text-outline"
        />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading primary categories...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs">
          Failed to load categories.
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-[#f9faf9] text-[11px] font-bold uppercase text-outline tracking-wider">
                <th className="py-3 px-5">Category Name</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4">Subcategories</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-xs">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2.5 font-bold text-on-surface">
                      <div className="w-7 h-7 rounded-lg bg-[#eaf5ea] text-primary flex items-center justify-center text-xs">
                        <FolderTree className="h-3.5 w-3.5" />
                      </div>
                      <span>{cat.name}</span>
                    </div>
                    {cat.description && (
                      <p className="text-[11px] text-outline mt-0.5 line-clamp-1">{cat.description}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-outline">/{cat.slug}</td>
                  <td className="py-3.5 px-4 font-bold text-primary">
                    {cat.subCategories?.length || 0} subcategories
                  </td>
                  <td className="py-3.5 px-4">
                    {cat.isActive ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#14a800] bg-[#eaf5ea] px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="h-3 w-3" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                        <XCircle className="h-3 w-3" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(cat)}
                        className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface cursor-pointer transition-colors"
                        title="Edit Category"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat)}
                        className="p-1.5 rounded-lg border border-outline-variant hover:bg-red-50 text-outline hover:text-red-600 cursor-pointer transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CategoryModal
        isOpen={isModalOpen}
        category={selectedCategory}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })}
      />
    </div>
  );
}
