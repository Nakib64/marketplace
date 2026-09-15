'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ShieldCheck, CheckCircle2, DollarSign } from 'lucide-react';
import { CreateJobFormData } from '../schemas/createJobSchema';

interface PostJobBudgetStepProps {
  form: UseFormReturn<CreateJobFormData>;
}

export function PostJobBudgetStep({ form }: PostJobBudgetStepProps) {
  const { register, formState: { errors } } = form;
  const [escrowType, setEscrowType] = useState<'milestone' | 'fixed'>('milestone');
  const [currency, setCurrency] = useState('USD');

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-on-surface">3. Budget &amp; Payment Setup</h2>
        </div>
        <span className="text-xs  text-on-surface-variant">Step 03 / 03</span>
      </div>

      {/* Payment Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setEscrowType('milestone')}
          className={`p-4 rounded-xl text-left flex flex-col gap-1.5 transition-all cursor-pointer ${escrowType === 'milestone'
              ? 'bg-surface-container-high border-2 border-primary shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container-high/60 border border-outline-variant/30'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Milestone Payments</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <span className="text-[11px] text-primary font-medium">
            Recommended
          </span>
          <p className="text-[11px] text-on-surface-variant leading-normal">
            Release funds in stages as project deliverables and milestones are reviewed and approved.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setEscrowType('fixed')}
          className={`p-4 rounded-xl text-left flex flex-col gap-1.5 transition-all cursor-pointer ${escrowType === 'fixed'
              ? 'bg-surface-container-high border-2 border-primary shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container-high/60 border border-outline-variant/30'
            }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Single Fixed Price</span>
            <span className="w-2 h-2 rounded-full bg-surface-container-highest" />
          </div>
          <span className="text-[11px] text-on-surface-variant">One-off Projects</span>
          <p className="text-[11px] text-on-surface-variant leading-normal">
            Funds are held safely and released upon complete final sign-off.
          </p>
        </button>
      </div>

      {/* Network & Budget Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/20">
        {/* Settlement Currency */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Payment Currency
          </label>
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full appearance-none bg-surface-container-low border border-outline-variant/30 px-3.5 py-2.5 rounded-xl text-xs font-medium text-on-surface outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="USD">USD ($ - US Dollars)</option>
              <option value="BDT">BDT (৳ - Bangladeshi Taka)</option>
            </select>
          </div>
        </div>

        {/* Total Budget */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Total Project Budget
          </label>
          <div className="flex items-center bg-surface-container-low border border-outline-variant/30 px-3.5 py-2 rounded-xl focus-within:border-primary transition-colors">
            <DollarSign className="w-4 h-4 text-primary mr-1 shrink-0" />
            <input
              type="number"
              {...register('budget', { valueAsNumber: true })}
              placeholder="e.g. 5000"
              className="w-full bg-transparent  text-lg font-bold text-on-surface outline-none"
            />
            <span className="text-xs text-primary bg-surface-container-high px-2 py-0.5 rounded ml-2">
              USDC
            </span>
          </div>
          {errors.budget && (
            <p className="text-xs text-error mt-0.5">{errors.budget.message}</p>
          )}
        </div>
      </div>

      {/* Platform Fee Assurance Note */}
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
        <span className="flex items-center gap-1.5 text-on-surface font-semibold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Client Protection Fee:
        </span>
        <span className="text-primary font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          0% Zero Fee Guarantee
        </span>
      </div>
    </div>
  );
}
