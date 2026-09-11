'use client';

import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CreateJobFormData } from '../schemas/createJobSchema';

interface PostJobBudgetStepProps {
  form: UseFormReturn<CreateJobFormData>;
}

export function PostJobBudgetStep({ form }: PostJobBudgetStepProps) {
  const { register, formState: { errors } } = form;
  const [escrowType, setEscrowType] = useState<'milestone' | 'fixed'>('milestone');
  const [network, setNetwork] = useState('Arbitrum One');

  return (
    <div className="bg-surface-container rounded-2xl p-6 sm:p-8 flex flex-col gap-6 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <h2 className="text-lg font-bold text-on-surface">3. Budget &amp; Escrow Setup</h2>
        </div>
        <span className="text-xs font-mono text-on-surface-variant">Step 03 / 03</span>
      </div>

      {/* Escrow Type Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setEscrowType('milestone')}
          className={`p-4 rounded-xl text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
            escrowType === 'milestone'
              ? 'bg-surface-container-high border-2 border-primary shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container-high/60 border border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Milestone-Based Escrow</span>
            <span className="w-2 h-2 rounded-full bg-primary" />
          </div>
          <span className="text-[11px] font-mono text-primary font-medium">
            Recommended for Protocols
          </span>
          <p className="text-[11px] text-on-surface-variant leading-normal">
            Release funds in staged multi-sig releases as code builds, invariant tests, and PRs are verified.
          </p>
        </button>

        <button
          type="button"
          onClick={() => setEscrowType('fixed')}
          className={`p-4 rounded-xl text-left flex flex-col gap-1.5 transition-all cursor-pointer ${
            escrowType === 'fixed'
              ? 'bg-surface-container-high border-2 border-primary shadow-sm'
              : 'bg-surface-container-low hover:bg-surface-container-high/60 border border-outline-variant/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-on-surface">Single Fixed Price</span>
            <span className="w-2 h-2 rounded-full bg-surface-container-highest" />
          </div>
          <span className="text-[11px] font-mono text-on-surface-variant">One-off Deliverables</span>
          <p className="text-[11px] text-on-surface-variant leading-normal">
            Funds are locked once in escrow and released upon complete final sign-off and repository merge.
          </p>
        </button>
      </div>

      {/* Network & Budget Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/20">
        {/* Settlement Network */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Settlement Network Vault
          </label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full bg-surface-container-lowest text-on-surface rounded-xl px-4 py-3 text-sm border border-outline-variant/40 focus:outline-none focus:border-primary cursor-pointer"
          >
            <option value="Arbitrum One">Arbitrum One (Ultra Low Gas • &lt;$0.05)</option>
            <option value="Ethereum Mainnet">Ethereum Mainnet</option>
            <option value="Optimism Mainnet">Optimism Mainnet</option>
            <option value="Base L2">Base L2</option>
          </select>
        </div>

        {/* Target Budget Input */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-on-surface uppercase tracking-wider">
            Target Budget (USD / USDC) <span className="text-primary">*</span>
          </label>
          <div className="flex items-center bg-surface-container-lowest rounded-xl px-4 py-2 border border-outline-variant/40 focus-within:border-primary">
            <span className="font-mono text-base font-bold text-on-surface mr-1">$</span>
            <input
              type="number"
              step="1"
              min="1"
              {...register('budget', { valueAsNumber: true })}
              placeholder="e.g. 5000"
              className="w-full bg-transparent font-mono text-lg font-bold text-on-surface outline-none"
            />
            <span className="text-xs font-mono text-primary bg-surface-container-high px-2 py-0.5 rounded ml-2">
              USDC
            </span>
          </div>
          {errors.budget && (
            <p className="text-xs text-error mt-0.5">{errors.budget.message}</p>
          )}
        </div>
      </div>

      {/* Escrow Fee Assurance Note */}
      <div className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 flex items-center justify-between text-xs font-mono text-on-surface-variant">
        <span className="flex items-center gap-1.5 text-on-surface font-semibold">
          <ShieldCheck className="w-4 h-4 text-primary" />
          Hirer Protocol Escrow Fee:
        </span>
        <span className="text-primary font-bold flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5" />
          0.00% Zero Fee Guarantee
        </span>
      </div>
    </div>
  );
}
