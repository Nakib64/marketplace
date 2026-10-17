'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCategoriesApi } from '@/lib/api/adminApi';
import { Category, SubCategory } from '@/types/adminTypes';
import { FolderTree, Search, Edit2, Trash2, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { SubCategoryModal } from './SubCategoryModal';
import { toast } from 'sonner';

export function SubCategoriesManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [parentCategoryForSub, setParentCategoryForSub] = useState<{ id: string; name: string } | null>(null);

  const { data: categories = [], isLoading, isError } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => adminCategoriesApi.getAll(true),
  });

  // Flatten all subcategories with parent information
  const allSubCategories = categories.flatMap((cat) =>
    (cat.subCategories || []).map((sub) => ({
      ...sub,
      parentCategoryName: cat.name,
      parentCategoryId: cat.id,
    }))
  );

  const handleOpenEdit = (sub: SubCategory, parent: { id: string; name: string }) => {
    setParentCategoryForSub(parent);
    setSelectedSubCategory(sub);
    setIsModalOpen(true);
  };

  const handleDelete = async (sub: SubCategory) => {
    if (!confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) return;
    try {
      await adminCategoriesApi.deleteSubCategory(sub.id);
      toast.success(`Subcategory "${sub.name}" deleted.`);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete subcategory.');
    }
  };

  const filtered = allSubCategories.filter((s) => {
    if (selectedParentId !== 'ALL' && s.parentCategoryId !== selectedParentId) {
      return false;
    }
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.slug.toLowerCase().includes(search.toLowerCase()) ||
      s.parentCategoryName.toLowerCase().includes(search.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Subcategories Directory</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Fine-grained niches mapped to primary parent categories across the marketplace.
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex items-center gap-2.5 flex-1 bg-white p-2.5 rounded-xl border border-outline-variant shadow-xs">
          <Search className="h-4 w-4 text-outline shrink-0 ml-2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search subcategories by name, slug, or parent..."
            className="w-full text-xs text-on-surface bg-transparent focus:outline-none placeholder:text-outline"
          />
        </div>

        <select
          value={selectedParentId}
          onChange={(e) => setSelectedParentId(e.target.value)}
          className="text-xs font-semibold text-on-surface bg-white border border-outline-variant rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
        >
          <option value="ALL">All Parent Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading subcategories...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs">
          Failed to load subcategories.
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-outline-variant">
          <FolderTree className="h-10 w-10 text-outline mx-auto mb-2 opacity-50" />
          <h3 className="text-xs font-bold text-on-surface">No subcategories match query</h3>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-outline-variant shadow-xs overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-outline-variant bg-[#f9faf9] text-[11px] font-bold uppercase text-outline tracking-wider">
                <th className="py-3 px-5">Subcategory Name</th>
                <th className="py-3 px-4">Parent Category</th>
                <th className="py-3 px-4">Slug Identifier</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/60 text-xs">
              {filtered.map((sub) => (
                <tr key={sub.id} className="hover:bg-surface-container-lowest transition-colors">
                  <td className="py-3.5 px-5 font-bold text-on-surface">
                    <div>{sub.name}</div>
                    {sub.description && (
                      <p className="text-[11px] text-outline mt-0.5 line-clamp-1">{sub.description}</p>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] text-xs font-semibold text-primary">
                      {sub.parentCategoryName}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-medium text-outline">/{sub.slug}</td>
                  <td className="py-3.5 px-4">
                    {sub.isActive ? (
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
                        onClick={() =>
                          handleOpenEdit(sub, { id: sub.parentCategoryId, name: sub.parentCategoryName })
                        }
                        className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface cursor-pointer transition-colors"
                        title="Edit Subcategory"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(sub)}
                        className="p-1.5 rounded-lg border border-outline-variant hover:bg-red-50 text-outline hover:text-red-600 cursor-pointer transition-colors"
                        title="Delete Subcategory"
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

      {parentCategoryForSub && (
        <SubCategoryModal
          isOpen={isModalOpen}
          categoryId={parentCategoryForSub.id}
          categoryName={parentCategoryForSub.name}
          subCategory={selectedSubCategory}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })}
        />
      )}
    </div>
  );
}
