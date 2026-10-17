'use client';

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { adminCategoriesApi } from '@/lib/api/adminApi';
import { Category, SubCategory } from '@/types/adminTypes';
import {
  FolderTree,
  Plus,
  Search,
  ChevronDown,
  ChevronRight,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Loader2,
} from 'lucide-react';
import { CategoryModal } from './CategoryModal';
import { SubCategoryModal } from './SubCategoryModal';
import { toast } from 'sonner';

export function CategoriesManager() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  // Modals state
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState<SubCategory | null>(null);
  const [parentCategoryForSub, setParentCategoryForSub] = useState<{ id: string; name: string } | null>(null);

  const { data: categories = [], isLoading, isError } = useQuery<Category[]>({
    queryKey: ['admin-categories'],
    queryFn: () => adminCategoriesApi.getAll(true),
  });

  const toggleExpand = (catId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  const handleOpenAddCategory = () => {
    setSelectedCategory(null);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to permanently delete category "${cat.name}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await adminCategoriesApi.delete(cat.id);
      toast.success(`Category "${cat.name}" deleted.`);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete category.');
    }
  };

  const handleOpenAddSubCategory = (cat: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setParentCategoryForSub({ id: cat.id, name: cat.name });
    setSelectedSubCategory(null);
    setIsSubCategoryModalOpen(true);
  };

  const handleOpenEditSubCategory = (cat: Category, sub: SubCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    setParentCategoryForSub({ id: cat.id, name: cat.name });
    setSelectedSubCategory(sub);
    setIsSubCategoryModalOpen(true);
  };

  const handleDeleteSubCategory = async (sub: SubCategory, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete subcategory "${sub.name}"?`)) {
      return;
    }
    try {
      await adminCategoriesApi.deleteSubCategory(sub.id);
      toast.success(`Subcategory "${sub.name}" deleted.`);
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete subcategory.');
    }
  };

  const filteredCategories = categories.filter((c) => {
    const matchesCat = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.slug.toLowerCase().includes(search.toLowerCase());
    const matchesSub = c.subCategories?.some((s) =>
      s.name.toLowerCase().includes(search.toLowerCase())
    );
    return matchesCat || matchesSub;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <h1 className="text-xl font-bold text-on-surface">Taxonomy & Categories</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Organize service offerings, categories, and subcategories across the marketplace.
          </p>
        </div>
        <button
          onClick={handleOpenAddCategory}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Category</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-xl border border-outline-variant shadow-xs">
        <Search className="h-4 w-4 text-outline shrink-0 ml-2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter categories or subcategories..."
          className="w-full text-xs text-on-surface bg-transparent focus:outline-none placeholder:text-outline"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-outline hover:text-on-surface mr-2 cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Categories Tree / List */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-on-surface-variant font-medium">Loading categories taxonomy...</span>
        </div>
      ) : isError ? (
        <div className="p-8 text-center bg-red-50 text-red-600 rounded-2xl border border-red-200 text-xs">
          Failed to load categories. Please check your network or try refreshing.
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-outline-variant">
          <FolderTree className="h-10 w-10 text-outline mx-auto mb-3" />
          <h3 className="text-sm font-bold text-on-surface mb-1">No categories found</h3>
          <p className="text-xs text-on-surface-variant mb-4">
            {search ? 'Try adjusting your search query.' : 'Get started by creating your first category.'}
          </p>
          <button
            onClick={handleOpenAddCategory}
            className="px-4 py-2 rounded-xl bg-primary hover:bg-[#108a00] text-white text-xs font-bold cursor-pointer"
          >
            Create Category
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredCategories.map((cat) => {
            const isExpanded = expandedCategories[cat.id] ?? true;
            const subCount = cat.subCategories?.length || 0;

            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-outline-variant overflow-hidden shadow-xs transition-shadow hover:shadow-sm"
              >
                {/* Category Header Bar */}
                <div
                  onClick={() => toggleExpand(cat.id)}
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-surface-container-lowest transition-colors select-none"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="text-outline hover:text-on-surface p-1 rounded-lg"
                      aria-label="Toggle"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <div className="w-8 h-8 rounded-xl bg-[#eaf5ea] text-primary flex items-center justify-center font-bold text-xs shrink-0">
                      <FolderTree className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-on-surface">{cat.name}</h3>
                        <span className="text-[11px] text-outline font-medium">/{cat.slug}</span>
                        {cat.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#14a800] bg-[#eaf5ea] px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                            <XCircle className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </div>
                      {cat.description && (
                        <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions for Category */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-outline font-medium mr-2">
                      {subCount} {subCount === 1 ? 'subcategory' : 'subcategories'}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => handleOpenAddSubCategory(cat, e)}
                      title="Add Subcategory"
                      className="px-2.5 py-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-xs font-semibold text-on-surface flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5 text-primary" />
                      <span className="hidden sm:inline">Add Sub</span>
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleOpenEditCategory(cat, e)}
                      title="Edit Category"
                      className="p-1.5 rounded-lg border border-outline-variant hover:bg-surface-container text-on-surface cursor-pointer transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDeleteCategory(cat, e)}
                      title="Delete Category"
                      className="p-1.5 rounded-lg border border-outline-variant hover:bg-red-50 text-outline hover:text-red-600 cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {/* Subcategories Child List */}
                {isExpanded && (
                  <div className="border-t border-outline-variant/60 bg-[#fbfdfb] p-3 space-y-2">
                    {cat.subCategories && cat.subCategories.length > 0 ? (
                      cat.subCategories.map((sub) => (
                        <div
                          key={sub.id}
                          className="flex items-center justify-between pl-8 pr-4 py-2 bg-white rounded-xl border border-outline-variant/60 hover:border-primary/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary/60" />
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-on-surface">{sub.name}</span>
                                <span className="text-[10px] text-outline font-medium">/{sub.slug}</span>
                                {!sub.isActive && (
                                  <span className="text-[9px] font-bold text-red-600 bg-red-50 px-1.5 py-0.2 rounded-full">
                                    Inactive
                                  </span>
                                )}
                              </div>
                              {sub.description && (
                                <p className="text-[11px] text-on-surface-variant line-clamp-1">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={(e) => handleOpenEditSubCategory(cat, sub, e)}
                              className="p-1.5 rounded-md hover:bg-surface-container text-outline hover:text-on-surface cursor-pointer"
                              title="Edit Subcategory"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDeleteSubCategory(sub, e)}
                              className="p-1.5 rounded-md hover:bg-red-50 text-outline hover:text-red-600 cursor-pointer"
                              title="Delete Subcategory"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-xs text-outline italic">
                        No subcategories registered yet. Click &quot;Add Sub&quot; above to create one.
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        category={selectedCategory}
        onClose={() => setIsCategoryModalOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })}
      />

      {/* SubCategory Modal */}
      {parentCategoryForSub && (
        <SubCategoryModal
          isOpen={isSubCategoryModalOpen}
          categoryId={parentCategoryForSub.id}
          categoryName={parentCategoryForSub.name}
          subCategory={selectedSubCategory}
          onClose={() => setIsSubCategoryModalOpen(false)}
          onSuccess={() => queryClient.invalidateQueries({ queryKey: ['admin-categories'] })}
        />
      )}
    </div>
  );
}
