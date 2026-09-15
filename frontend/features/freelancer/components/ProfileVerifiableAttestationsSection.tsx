'use client';

import React from 'react';
import { toast } from 'sonner';

export const ProfileVerifiableAttestationsSection: React.FC = () => {
  return (
    <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          </div>
          <h2 className="text-base font-bold text-on-surface">Certifications &amp; Credentials</h2>
        </div>
        <button
          type="button"
          onClick={() => toast.info('Credential attestation will be available soon.')}
          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1 self-start transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[15px] text-primary">add</span>
          <span>Add Credential</span>
        </button>
      </div>

      <div className="p-6 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-2">
        <span className="material-symbols-outlined text-[28px] text-on-surface-variant/60">verified_user</span>
        <span className="text-xs font-bold text-on-surface">No Certifications Added Yet</span>
        <p className="text-[11px] text-on-surface-variant max-w-sm">
          Add verified credentials and skill badges to boost your credibility when submitting client proposals.
        </p>
      </div>
    </section>
  );
};
