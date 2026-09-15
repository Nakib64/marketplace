import React from 'react';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentDossierStatsProps {
  profile: FreelancerProfile;
}

export function TalentDossierStats({ profile }: TalentDossierStatsProps) {
  const earned = profile.earnings ? Number(profile.earnings) : 0;
  const success = profile.successRate || 100;
  const projects = profile.totalProjects || 0;

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Total Earned */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
          Total Earned
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-on-surface">
            {formatCurrency(earned)}
          </span>
        </div>
        <span className="text-[11px] text-primary flex items-center gap-1 mt-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified Escrow
        </span>
      </div>

      {/* 2. Job Success */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
          Job Success
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-primary">
            {success}%
          </span>
        </div>
        <span className="text-[11px] text-on-surface-variant flex items-center gap-1 mt-1.5">
          <Award className="w-3.5 h-3.5 text-secondary" />
          Top Rated
        </span>
      </div>

      {/* 3. Completed Projects */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
          Completed Projects
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-on-surface">
            {projects}
          </span>
          <span className="text-xs text-on-surface-variant">contracts</span>
        </div>
        <span className="text-[11px] text-on-surface-variant mt-1.5">
          100% Escrow Settled
        </span>
      </div>

      {/* 4. Dispute Rate */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
          Dispute Rate
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold text-on-surface">
            0.00%
          </span>
        </div>
        <span className="text-[11px] text-primary flex items-center gap-1 mt-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Flawless Record
        </span>
      </div>
    </section>
  );
}
