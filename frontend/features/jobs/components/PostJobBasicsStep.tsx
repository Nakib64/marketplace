import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { CreateJobFormData } from '../schemas/createJobSchema';

interface PostJobBasicsStepProps {
  form: UseFormReturn<CreateJobFormData>;
}

const DOMAIN_CATEGORIES = [
  'DeFi Protocol',
  'Infrastructure / L2',
  'Smart Contract Audit',
  'Zero-Knowledge & Cryptography',
  'Fullstack Web3 DApp',
  'UI/UX & Product Design',
];

export function PostJobBasicsStep({ form }: PostJobBasicsStepProps) {
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const currentCategory = watch('category');
  const titleValue = watch('title') || '';

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-on-surface">1. Scope &amp; Description</h2>
        </div>
        <span className="text-xs font-mono text-on-surface-variant">Step 01 / 03</span>
      </div>

      {/* Job Title */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-baseline">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Job Title / Architecture Spec <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] font-mono text-on-surface-variant">
            {titleValue.length}/150 chars
          </span>
        </div>
        <input
          {...register('title')}
          placeholder="e.g. Arbitrum Stylus Rust Smart Contract Engineer - AMM DEX V2"
          className="w-full bg-surface-container-lowest text-on-surface rounded-xl px-4 py-3 text-sm border border-outline-variant/40 focus:outline-none focus:border-primary"
        />
        {errors.title && (
          <p className="text-xs text-error mt-0.5">{errors.title.message}</p>
        )}
      </div>

      {/* Domain Category Selector Pills */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
          Primary Domain Category <span className="text-primary">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {DOMAIN_CATEGORIES.map((cat) => {
            const isSelected = currentCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setValue('category', cat, { shouldValidate: true })}
                className={`px-3.5 py-2 rounded-full text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-primary-container text-on-primary-container font-semibold shadow-sm'
                    : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface border border-outline-variant/30'
                }`}
              >
                {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block mr-1.5" />}
                {cat}
              </button>
            );
          })}
        </div>
        {errors.category && (
          <p className="text-xs text-error mt-0.5">{errors.category.message}</p>
        )}
      </div>

      {/* Project Scope & Deliverables */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Project Scope &amp; Deliverables <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] font-mono text-on-surface-variant">
            Markdown Supported
          </span>
        </div>
        <textarea
          {...register('description')}
          rows={6}
          placeholder="Detail the technical milestones, EVM architecture, testing thresholds, and deliverables required for escrow verification..."
          className="w-full bg-surface-container-lowest text-on-surface rounded-xl p-4 text-sm font-mono border border-outline-variant/40 focus:outline-none focus:border-primary resize-y leading-relaxed"
        />
        {errors.description && (
          <p className="text-xs text-error mt-0.5">{errors.description.message}</p>
        )}
      </div>
    </div>
  );
}
