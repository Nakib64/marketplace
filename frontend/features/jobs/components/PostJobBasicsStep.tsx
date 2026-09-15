'use client';

import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
import { Layers, FolderTree, ChevronDown } from 'lucide-react';
import { CreateJobFormData } from '../schemas/createJobSchema';
import { jobsApi } from '../api/jobsApi';

interface PostJobBasicsStepProps {
  form: UseFormReturn<CreateJobFormData>;
}

const DEFAULT_CATEGORIES = [
  {
    name: 'Software & Web Development',
    subCategories: [
      { name: 'Full-Stack Development' },
      { name: 'Frontend Development' },
      { name: 'Backend Development' },
      { name: 'Mobile App Development' },
      { name: 'Web3 & Blockchain' },
      { name: 'DevOps & Cloud Engineering' },
      { name: 'QA & Test Automation' },
      { name: 'Database & Systems Architecture' },
    ],
  },
  {
    name: 'AI & Data Engineering',
    subCategories: [
      { name: 'LLMs & Prompt Engineering' },
      { name: 'Machine Learning & Deep Learning' },
      { name: 'Data Engineering & ETL' },
      { name: 'Computer Vision & NLP' },
      { name: 'Data Analytics & BI Dashboards' },
    ],
  },
  {
    name: 'UI/UX & Product Design',
    subCategories: [
      { name: 'Web & Mobile UI/UX' },
      { name: 'Design Systems & Figma Kits' },
      { name: 'Brand & Visual Identity' },
      { name: 'Prototypes & User Research' },
      { name: 'Graphic Design & Illustrations' },
    ],
  },
  {
    name: 'Cybersecurity & Systems',
    subCategories: [
      { name: 'Penetration Testing & Audits' },
      { name: 'Smart Contract Auditing' },
      { name: 'Cloud & Network Security' },
      { name: 'Incident Response & Hardening' },
    ],
  },
  {
    name: 'Writing & Translation',
    subCategories: [
      { name: 'Technical Writing & Documentation' },
      { name: 'Copywriting & Content Strategy' },
      { name: 'SEO Content & Articles' },
      { name: 'Translation & Localization' },
    ],
  },
  {
    name: 'Marketing & Growth',
    subCategories: [
      { name: 'Search Engine Optimization (SEO)' },
      { name: 'Paid Advertising (PPC / Google / Meta)' },
      { name: 'Social Media & Community Management' },
      { name: 'Email Marketing & CRM Automation' },
    ],
  },
];

export function PostJobBasicsStep({ form }: PostJobBasicsStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentCategory = watch('category');
  const currentSubCategory = watch('subCategory');
  const titleValue = watch('title') || '';

  const { data: remoteCategories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: () => jobsApi.getCategories(),
    staleTime: 60000,
  });

  const categoriesList =
    remoteCategories && remoteCategories.length > 0
      ? remoteCategories
      : DEFAULT_CATEGORIES;

  // Find subcategories for the currently active category (with fallback to DEFAULT_CATEGORIES)
  const activeRemoteCat = categoriesList.find(
    (c) => c.name.toLowerCase() === currentCategory?.toLowerCase()
  );
  const fallbackCat = DEFAULT_CATEGORIES.find(
    (c) => c.name.toLowerCase() === currentCategory?.toLowerCase()
  );

  const availableSubCategories =
    activeRemoteCat?.subCategories && activeRemoteCat.subCategories.length > 0
      ? activeRemoteCat.subCategories
      : fallbackCat?.subCategories || [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCat = e.target.value;
    setValue('category', newCat, { shouldValidate: true });
    setValue('subCategory', '', { shouldValidate: true });
  };

  const handleSubCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue('subCategory', e.target.value, { shouldValidate: true });
  };

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-on-surface">1. Scope &amp; Description</h2>
        </div>
        <span className="text-xs text-on-surface-variant">Step 01 / 03</span>
      </div>

      {/* Job Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Job Title <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] text-on-surface-variant">
            {titleValue.length}/150 chars
          </span>
        </div>
        <input
          {...register('title')}
          placeholder="e.g. Senior Full-Stack Engineer for Next.js & NestJS Platform"
          className="w-full bg-surface-container-lowest text-on-surface rounded-xl px-4 py-3 text-sm border border-outline-variant/40 focus:outline-none focus:border-primary placeholder:text-on-surface-variant/40"
        />
        {errors.title && (
          <p className="text-xs text-error mt-0.5">{errors.title.message}</p>
        )}
      </div>

      {/* Grid for Category and Subcategory Dropdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* 1. Category Dropdown */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-primary" />
              <span>Category <span className="text-primary">*</span></span>
            </label>
            {isLoading && (
              <span className="text-[10px] text-on-surface-variant animate-pulse">
                Loading...
              </span>
            )}
          </div>

          <div className="relative">
            <select
              value={currentCategory || ''}
              onChange={handleCategoryChange}
              className="w-full bg-surface-container-lowest text-on-surface rounded-xl px-4 py-3 pr-10 text-sm border border-outline-variant/40 focus:outline-none focus:border-primary appearance-none cursor-pointer transition-colors"
            >
              <option value="" disabled className="bg-surface text-on-surface-variant">
                Select a category...
              </option>
              {categoriesList.map((cat) => (
                <option
                  key={cat.name}
                  value={cat.name}
                  className="bg-surface text-on-surface py-1"
                >
                  {cat.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {errors.category && (
            <p className="text-xs text-error mt-0.5">{errors.category.message}</p>
          )}
        </div>

        {/* 2. Subcategory Dropdown */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider flex items-center gap-1.5">
            <FolderTree className="w-3.5 h-3.5 text-primary" />
            <span>Subcategory</span>
            <span className="text-[10px] font-normal text-on-surface-variant lowercase">(optional)</span>
          </label>

          <div className="relative">
            <select
              value={currentSubCategory || ''}
              onChange={handleSubCategoryChange}
              disabled={!currentCategory}
              className="w-full bg-surface-container-lowest text-on-surface rounded-xl px-4 py-3 pr-10 text-sm border border-outline-variant/40 focus:outline-none focus:border-primary appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <option value="" className="bg-surface text-on-surface-variant">
                {currentCategory
                  ? availableSubCategories.length > 0
                    ? 'Select a subcategory...'
                    : 'No subcategories available'
                  : 'Select category first...'}
              </option>
              {availableSubCategories.map((sub) => (
                <option
                  key={sub.name}
                  value={sub.name}
                  className="bg-surface text-on-surface py-1"
                >
                  {sub.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-on-surface-variant absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Project Scope & Deliverables */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Project Scope &amp; Deliverables <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] text-on-surface-variant">
            Markdown Supported
          </span>
        </div>
        <textarea
          {...register('description')}
          rows={6}
          placeholder="Detail the project requirements, scope of work, timeline, and expected deliverables..."
          className="w-full bg-surface-container-lowest text-on-surface rounded-xl p-4 text-sm border border-outline-variant/40 focus:outline-none focus:border-primary resize-y leading-relaxed placeholder:text-on-surface-variant/40"
        />
        {errors.description && (
          <p className="text-xs text-error mt-0.5">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
