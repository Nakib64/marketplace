import React from 'react';

interface MilestoneHandoverNotesCardProps {
  notes?: string;
}

export const MilestoneHandoverNotesCard: React.FC<MilestoneHandoverNotesCardProps> = ({
  notes,
}) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-on-surface-variant">notes</span>
          <h3 className="text-sm font-bold text-on-surface">Engineer Technical Handover Note</h3>
        </div>
        <span className="text-[11px] text-on-surface-variant">Verified</span>
      </div>

      <div className="bg-surface-container-low rounded-lg p-3.5 text-xs text-on-surface-variant flex flex-col gap-2.5 leading-relaxed border border-outline-variant/20">
        <p>
          {notes || 'No handover notes provided for this deliverable.'}
        </p>
      </div>
    </div>
  );
};
