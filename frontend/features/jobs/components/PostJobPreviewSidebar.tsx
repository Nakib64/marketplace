import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { CreateJobFormData } from '../schemas/createJobSchema';

interface PostJobPreviewSidebarProps {
  form: UseFormReturn<CreateJobFormData>;
}

export function PostJobPreviewSidebar({ form }: PostJobPreviewSidebarProps) {
  const { watch } = form;
  const title = watch('title') || 'Untitled Web3 Project RFP';
  const category = watch('category') || 'DeFi Protocol';
  const budget = watch('budget') || 0;
  const skills = watch('skills') || [];

  return (
    <aside className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col gap-6 lg:sticky lg:top-24">
      {/* 1. Live Feed Preview Card */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Marketplace Feed Preview
          </span>
          <span className="text-[11px] font-mono text-primary bg-surface-container-high px-2 py-0.5 rounded">
            Live Sync
          </span>
        </div>

        {/* Inner Simulated Card */}
        <div className="p-4 rounded-xl bg-surface-container-lowest border border-outline-variant/20 flex flex-col gap-2.5">
          <span className="text-[11px] font-mono text-secondary">{category}</span>
          <h3 className="text-sm font-bold text-on-surface line-clamp-2 leading-snug">
            {title}
          </h3>

          <div className="py-1 flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-primary">
              {budget > 0 ? formatCurrency(budget) : '$0'}
            </span>
            <span className="text-xs font-mono text-on-surface-variant">USDC</span>
          </div>

          <div className="flex flex-wrap gap-1 pt-1">
            {skills.length > 0 ? (
              skills.slice(0, 4).map((s) => (
                <span
                  key={s}
                  className="px-2 py-0.5 rounded-md bg-surface-container-high text-[11px] font-mono text-on-surface-variant"
                >
                  {s}
                </span>
              ))
            ) : (
              <span className="text-[11px] font-mono text-on-surface-variant italic">
                No skills added yet
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 2. Escrow Vault Specs */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
            <Lock className="w-4 h-4 text-primary" />
            Escrow Vault Specs
          </h3>
          <span className="text-xs font-mono text-on-surface-variant">Safe 2/3</span>
        </div>

        <div className="space-y-2 text-xs text-on-surface-variant">
          <div className="flex justify-between">
            <span>Total Allocation:</span>
            <span className="font-mono text-on-surface font-semibold">
              {budget > 0 ? formatCurrency(budget) : '$0.00'}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Platform Hirer Fee:</span>
            <span className="font-mono text-primary font-bold">0.00% ($0.00)</span>
          </div>
          <div className="flex justify-between">
            <span>Est. Vault Gas:</span>
            <span className="font-mono text-on-surface">~0.0004 ETH</span>
          </div>
        </div>
      </div>

      {/* 3. Hirer Guarantees */}
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 shadow-sm flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <h3 className="text-sm font-bold text-on-surface">Hirer Guarantees</h3>
        </div>
        <ul className="space-y-2 text-xs text-on-surface-variant">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>Funds remain securely locked until you cryptographically approve deliverables.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
            <span>Dispute grace period with juror mediation if commitments are unfulfilled.</span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
