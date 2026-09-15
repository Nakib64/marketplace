import React from 'react';
import { DisputeCaseDetail } from '../types/disputesTypes';

interface DisputeCaseDossierCardProps {
  caseDetail: DisputeCaseDetail;
}

export const DisputeCaseDossierCard: React.FC<DisputeCaseDossierCardProps> = ({ caseDetail }) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-surface-container-low rounded-xl border border-outline-variant/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 border border-outline-variant/30">
            <span className="material-symbols-outlined text-primary text-[22px]">balance</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider font-semibold">Case Reference</span>
            <span className=" text-xs text-on-surface font-semibold">{caseDetail.docketId} • Case {caseDetail.caseNumber}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span className="px-3 py-0.5 rounded-full bg-surface-container-high text-on-surface text-xs font-medium border border-outline-variant/30">
            {caseDetail.roundText}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-bold text-on-surface tracking-tight">{caseDetail.title}</h2>
        <p className="text-xs text-on-surface-variant leading-relaxed">{caseDetail.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
        <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1 border border-outline-variant/20">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Contract Title</span>
          <span className="text-xs font-semibold text-on-surface truncate">{caseDetail.contractTitle}</span>
          <span className="text-[11px] text-on-surface-variant">{caseDetail.auditPhase}</span>
        </div>

        <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1 border border-outline-variant/20">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Parties Involved</span>
          <div className="flex items-center gap-1.5 text-xs truncate">
            <span className="text-on-surface font-medium truncate">{caseDetail.hirerName}</span>
            <span className="text-on-surface-variant text-[10px]">and</span>
            <span className="text-primary truncate font-semibold">{caseDetail.contractorName}</span>
          </div>
        </div>

        <div className="bg-surface-container-low rounded-lg p-3 flex flex-col gap-1 border border-outline-variant/20">
          <span className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">Disputed Amount</span>
          <span className="text-base font-bold  text-on-surface">${caseDetail.claimedValue.toLocaleString()} {caseDetail.currency}</span>
          <span className="text-[11px] text-primary flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-[13px]">lock</span> Held in Protection
          </span>
        </div>
      </div>
    </div>
  );
};
