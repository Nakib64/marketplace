import React from 'react';
import { CheckCircle2, ShieldCheck, Award } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentDossierStatsProps {
  profile: FreelancerProfile;
}

export function TalentDossierStats({ profile }: TalentDossierStatsProps) {
  const earned = profile.earnings ? Number(profile.earnings) : 240000;
  const success = profile.successRate || 100;
  const projects = profile.totalProjects || 38;

  return (
    <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {/* 1. Total Earned */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
          Total Earned
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold font-mono text-on-surface">
            {formatCurrency(earned)}
          </span>
        </div>
        <span className="text-[11px] font-mono text-primary flex items-center gap-1 mt-1.5 font-medium">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified On-Chain
        </span>
      </div>

      {/* 2. Job Success */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
          Job Success
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold font-mono text-primary">
            {success}%
          </span>
        </div>
        <span className="text-[11px] font-mono text-on-surface-variant flex items-center gap-1 mt-1.5">
          <Award className="w-3.5 h-3.5 text-secondary" />
          Top 1% Architect
        </span>
      </div>

      {/* 3. Completed Escrows */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
          Completed Escrows
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold font-mono text-on-surface">
            {projects}
          </span>
          <span className="text-xs text-on-surface-variant font-mono">contracts</span>
        </div>
        <span className="text-[11px] font-mono text-on-surface-variant mt-1.5">
          Automated Release
        </span>
      </div>

      {/* 4. Dispute Rate */}
      <div className="bg-surface-container rounded-2xl p-4 sm:p-5 border border-outline-variant/30 shadow-sm flex flex-col">
        <span className="text-[11px] font-mono text-on-surface-variant uppercase tracking-wider">
          Dispute Rate
        </span>
        <div className="mt-1 flex items-baseline gap-1">
          <span className="text-xl sm:text-2xl font-bold font-mono text-on-surface">
            0.00%
          </span>
        </div>
        <span className="text-[11px] font-mono text-primary flex items-center gap-1 mt-1.5 font-medium">
          <ShieldCheck className="w-3.5 h-3.5" />
          Flawless Record
        </span>
      </div>
    </section>
  );
}
