import React from 'react';

interface MilestoneSecurityReportCardProps {
  status?: string;
  securityNotes?: string;
}

export const MilestoneSecurityReportCard: React.FC<MilestoneSecurityReportCardProps> = ({
  status = 'VERIFIED',
  securityNotes,
}) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">verified_user</span>
          <h3 className="text-sm font-bold text-on-surface">Escrow Deliverable Verification</h3>
        </div>
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-primary/10 text-primary">
          {status}
        </span>
      </div>

      <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 text-xs text-on-surface-variant leading-relaxed">
        {securityNotes || 'Deliverables are protected under the Banglance Escrow Agreement. Review deliverables carefully before authorizing payment release.'}
      </div>
    </div>
  );
};
