'use client';

import React from 'react';
import { UseFormReturn, useWatch } from 'react-hook-form';
import { ExternalLink } from 'lucide-react';
import { PortfolioFormData } from '../../schemas/portfolioSchema';

interface PortfolioDetailsFormProps {
  form: UseFormReturn<PortfolioFormData>;
}

export const PortfolioDetailsForm: React.FC<PortfolioDetailsFormProps> = ({ form }) => {
  const { register, control, formState: { errors } } = form;
  const titleValue = useWatch({ control, name: 'title' }) || '';
  const detailsValue = useWatch({ control, name: 'details' }) || '';
  const liveLinkValue = useWatch({ control, name: 'liveLink' }) || '';

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="pb-3 border-b border-outline-variant/20">
        <h2 className="text-base font-bold text-on-surface">Project Details &amp; Narrative</h2>
        <p className="text-xs text-on-surface-variant mt-0.5">
          Explain the problem you solved, tech stack, and deliverable highlights.
        </p>
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-on-surface">
            Project Title <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] text-on-surface-variant">{titleValue.length}/150</span>
        </div>
        <input
          type="text"
          {...register('title')}
          placeholder="e.g. Next.js 16 Web3 Escrow Marketplace Platform"
          className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
        />
        {errors.title && <p className="text-xs text-error">{errors.title.message}</p>}
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-on-surface">
            Case Study &amp; Technical Description <span className="text-primary">*</span>
          </label>
          <span className="text-[11px] text-on-surface-variant">{detailsValue.length} chars</span>
        </div>
        <textarea
          rows={6}
          {...register('details')}
          placeholder="Detail your engineering contributions:&#10;• Built real-time socket chat & escrow milestones.&#10;• Integrated PostgreSQL + Prisma with high performance indexes."
          className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-3 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary leading-relaxed font-sans"
        />
        {errors.details && <p className="text-xs text-error">{errors.details.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-on-surface">
          Live Demo / Deployment Link (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            {...register('liveLink')}
            placeholder="https://app.banglance.com or https://yourproject.vercel.app"
            className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-on-surface focus:outline-none focus:border-primary"
          />
          {liveLinkValue && (
            <a
              href={liveLinkValue}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/40 text-primary hover:underline text-xs font-semibold flex items-center gap-1 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Test Link</span>
            </a>
          )}
        </div>
        {errors.liveLink && <p className="text-xs text-error">{errors.liveLink.message}</p>}
      </div>
    </div>
  );
};
