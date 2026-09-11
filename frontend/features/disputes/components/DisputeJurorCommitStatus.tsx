import React from 'react';
import { DisputeJurorCommit } from '../types/disputesTypes';

interface DisputeJurorCommitStatusProps {
  jurors: DisputeJurorCommit[];
}

export const DisputeJurorCommitStatus: React.FC<DisputeJurorCommitStatusProps> = ({ jurors }) => {
  return (
    <div className="bg-surface-container rounded-xl p-5 border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
        <div>
          <h3 className="text-sm font-bold text-on-surface">Juror Commit-Reveal Protocol Status</h3>
          <p className="text-[11px] text-on-surface-variant">Non-collusive Schelling point voting prevents pre-vote coordination</p>
        </div>
        <span className="font-mono text-xs text-primary">Round 1 (3 Jurors Drawn)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {jurors.map((juror) => (
          <div
            key={juror.jurorNumber}
            className="bg-surface-container-low rounded-xl p-3 flex flex-col gap-2 border border-outline-variant/20 text-xs"
          >
            <div className="flex items-center justify-between">
              <span className="font-semibold text-on-surface font-mono">Juror #{juror.jurorNumber}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono flex items-center gap-1 ${
                juror.status === 'COMMITTED'
                  ? 'bg-surface-container-high text-primary'
                  : 'bg-surface-container-high text-outline'
              }`}>
                <span className="material-symbols-outlined text-[12px]">
                  {juror.status === 'COMMITTED' ? 'lock' : 'hourglass_empty'}
                </span>
                {juror.status === 'COMMITTED' ? 'Hash Committed' : 'Awaiting Hash'}
              </span>
            </div>

            <div className={`p-2 rounded bg-surface-container-lowest font-mono text-[11px] truncate ${
              juror.status === 'COMMITTED' ? 'text-on-surface-variant' : 'text-outline italic'
            }`}>
              {juror.hash || 'Pending commit window'}
            </div>

            <div className="flex items-center justify-between font-mono text-[11px] text-outline pt-0.5">
              <span>Stake: {juror.stakePnk} PNK</span>
              {juror.status === 'COMMITTED' ? (
                <span className="text-primary flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">check</span> Verified
                </span>
              ) : (
                <span className="text-on-surface-variant">{juror.timeRemaining}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
