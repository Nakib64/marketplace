'use client';

import React from 'react';

interface MilestoneArtifactsInspectionCardProps {
  githubPrUrl?: string;
  githubPrTitle?: string;
  ipfsCid?: string;
  onCopyCid?: (cid: string) => void;
}

export const MilestoneArtifactsInspectionCard: React.FC<MilestoneArtifactsInspectionCardProps> = ({
  githubPrUrl,
  githubPrTitle,
  ipfsCid,
  onCopyCid,
}) => {
  const hasArtifacts = !!(githubPrUrl || ipfsCid);

  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-[20px]">folder_zip</span>
          <h3 className="text-sm font-bold text-on-surface">Deliverable Artifacts &amp; Evidence</h3>
        </div>
        <span className="text-xs text-on-surface-variant">
          {hasArtifacts ? 'Artifacts Attached' : 'Pending Submission'}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {githubPrUrl && (
          <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-on-surface text-[18px]">alt_route</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-on-surface truncate block">
                  {githubPrTitle || 'Repository Deliverable'}
                </span>
                <span className="text-[11px] text-on-surface-variant truncate block mt-0.5">
                  {githubPrUrl}
                </span>
              </div>
            </div>
            <a
              href={githubPrUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2.5 py-1 rounded bg-surface-container-highest text-on-surface text-xs hover:bg-surface-bright transition-colors flex items-center gap-1 font-medium self-start sm:self-center"
            >
              <span>Inspect Link</span>
              <span className="material-symbols-outlined text-[13px]">open_in_new</span>
            </a>
          </div>
        )}

        {ipfsCid && (
          <div className="p-3.5 rounded-lg bg-surface-container-low border border-outline-variant/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3 min-w-0">
              <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-on-surface text-[18px]">cloud_done</span>
              </div>
              <div className="min-w-0">
                <span className="text-xs font-bold text-on-surface truncate">Build Package Reference</span>
                <span className="text-[11px] text-on-surface-variant truncate block mt-0.5 font-mono">
                  {ipfsCid}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onCopyCid?.(ipfsCid)}
              className="px-2.5 py-1 rounded bg-surface-container-highest text-on-surface text-xs hover:bg-surface-bright transition-colors flex items-center gap-1 font-medium self-start sm:self-center cursor-pointer"
            >
              <span>Copy Reference</span>
              <span className="material-symbols-outlined text-[13px]">content_copy</span>
            </button>
          </div>
        )}

        {!hasArtifacts && (
          <div className="p-4 rounded-lg bg-surface-container-low border border-outline-variant/20 text-center text-xs text-on-surface-variant">
            No external repository links or files attached to this deliverable.
          </div>
        )}
      </div>
    </div>
  );
};
