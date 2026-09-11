'use client';

import React from 'react';
import { WorkroomMessage } from '../types/messageTypes';

interface WorkroomMessageBubbleProps {
  message: WorkroomMessage;
}

export const WorkroomMessageBubble: React.FC<WorkroomMessageBubbleProps> = ({ message }) => {
  if (message.isMilestoneDeliverable) {
    return (
      <div className="flex items-start gap-3 max-w-2xl">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary shrink-0 border border-outline-variant/30">
          {message.senderAvatar}
        </div>
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-on-surface">{message.senderName}</span>
            <span className="font-mono text-[10px] text-on-surface-variant">{message.timestamp}</span>
            <span className="flex items-center gap-0.5 text-[10px] font-mono text-primary px-1.5 py-0.2 rounded bg-surface-container-low">
              <span className="material-symbols-outlined text-[11px]">verified_user</span> EIP-712 Signed
            </span>
          </div>

          <div className="p-4 rounded-xl bg-surface-container flex flex-col gap-3 border border-outline-variant/30 shadow-md">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-on-surface">{message.deliverableTitle}</h4>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">
                {message.coveragePct}
              </span>
            </div>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Completed the Arbitrum Orbit custom sequencer state transition engine along with Echidna property-based invariant test harness.
            </p>

            <div className="p-2.5 rounded-lg bg-surface-container-low flex flex-col gap-1 font-mono text-xs border border-outline-variant/20">
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant text-[11px]">Commit:</span>
                <span className="text-primary font-semibold">{message.commitRef}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-on-surface-variant text-[11px]">IPFS CID:</span>
                <span className="text-on-surface truncate max-w-[200px] text-[11px]">{message.ipfsCid}</span>
              </div>
            </div>

            {message.codeSnippet && (
              <pre className="p-2.5 rounded-lg bg-surface-container-lowest font-mono text-[11px] text-secondary overflow-x-auto border border-outline-variant/20">
                <code>{message.codeSnippet}</code>
              </pre>
            )}

            <div className="flex items-center gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => alert(`Copied artifact CID: ${message.ipfsCid}`)}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors font-medium flex items-center gap-1 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-[14px]">content_copy</span>
                <span>Copy Hash</span>
              </button>
              <button
                type="button"
                onClick={() => alert('Verifying cryptographic proofs on Arbitrum One...')}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface hover:bg-surface-bright transition-colors font-medium flex items-center gap-1 border border-outline-variant/30"
              >
                <span className="material-symbols-outlined text-primary text-[14px]">verified</span>
                <span>Verify On-Chain</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start gap-3 max-w-xl ${message.isHirer ? 'ml-auto flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
        message.isHirer ? 'bg-primary text-on-primary' : 'bg-surface-container-high text-on-surface'
      }`}>
        {message.senderAvatar}
      </div>
      <div className={`flex flex-col gap-1 ${message.isHirer ? 'items-end' : ''}`}>
        <div className="flex items-center gap-1.5 text-xs">
          <span className="font-semibold text-on-surface">{message.senderName}</span>
          <span className="font-mono text-[10px] text-on-surface-variant">{message.timestamp}</span>
          {message.isHirer && <span className="material-symbols-outlined text-primary text-[14px]">done_all</span>}
        </div>
        <div className={`p-3 rounded-xl text-xs leading-relaxed ${
          message.isHirer ? 'bg-surface-container-high text-on-surface shadow-sm' : 'bg-surface-container text-on-surface'
        }`}>
          {message.text}
        </div>
        {message.signerAddress && (
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-on-surface-variant">
            <span>Signer: {message.signerAddress}</span>
            <span>•</span>
            <span className="text-primary">{message.multisigStatus}</span>
          </div>
        )}
      </div>
    </div>
  );
};
