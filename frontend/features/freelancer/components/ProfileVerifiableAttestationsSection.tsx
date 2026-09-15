'use client';

import React from 'react';
import { toast } from 'sonner';

const CERTIFICATIONS = [
  {
    id: 'cert-1',
    title: 'Full Stack & Security Assessment',
    organization: 'Banglance Certified',
    metricLabel: 'Score:',
    metricValue: '96 / 100',
    status: 'Verified',
    icon: 'verified_user',
  },
  {
    id: 'cert-2',
    title: 'Identity Verification',
    organization: 'Government ID & Phone',
    metricLabel: 'Status:',
    metricValue: 'Passed Level 2',
    status: 'Verified',
    icon: 'shield',
  },
  {
    id: 'cert-3',
    title: 'Cloud Architecture & DevOps',
    organization: 'Industry Assessment',
    metricLabel: 'Issued:',
    metricValue: 'Active',
    status: 'Verified',
    icon: 'military_tech',
  },
  {
    id: 'cert-4',
    title: 'Code Quality & Testing',
    organization: 'Automated CI/CD Review',
    metricLabel: 'Compliance:',
    metricValue: 'Top 5%',
    status: 'Verified',
    icon: 'task_alt',
  },
];

export const ProfileVerifiableAttestationsSection: React.FC = () => {
  return (
    <section className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">workspace_premium</span>
          </div>
          <h2 className="text-base font-bold text-on-surface">Certifications &amp; Credentials</h2>
        </div>
        <button
          type="button"
          onClick={() => toast.info('Add new skill credential or certification.')}
          className="px-3 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1 self-start transition-colors border border-outline-variant/30"
        >
          <span className="material-symbols-outlined text-[15px] text-primary">add</span>
          <span>Add Credential</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {CERTIFICATIONS.map((cert) => (
          <div key={cert.id} className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3 hover:bg-surface-container-high/30 transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-[20px]">{cert.icon}</span>
                </div>
                <div>
                  <span className="text-xs font-bold text-on-surface block">{cert.title}</span>
                  <span className="text-[11px] text-on-surface-variant">{cert.organization}</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] text-primary font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> {cert.status}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs pt-1 border-t border-outline-variant/10">
              <div className="flex items-center gap-1 text-[11px] text-on-surface-variant">
                <span>{cert.metricLabel}</span>
                <span className="text-on-surface font-semibold">{cert.metricValue}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

