'use client';

import React from 'react';
import { toast } from 'sonner';
import { WorkroomMessage } from '../types/messageTypes';

interface WorkroomMessageBubbleProps {
  message: WorkroomMessage;
}

export const WorkroomMessageBubble: React.FC<WorkroomMessageBubbleProps> = ({ message }) => {
  if (message.isMilestoneDeliverable) {
    return (
      <div className="flex items-start gap-3 max-w-xl">
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary shrink-0 border border-outline-variant/30">
          {message.senderAvatar}
        </div>
        <div className="flex flex-col gap-1 flex-1">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-on-surface">{message.senderName}</span>
            <span className="text-[11px] text-on-surface-variant">{message.timestamp}</span>
          </div>

          <div className="p-4 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex flex-col gap-2.5">
            <div className="flex items-center gap-2 text-primary font-semibold text-xs">
              <span className="material-symbols-outlined text-[18px]">task_alt</span>
              <span>Work Deliverable Submitted</span>
            </div>
            <h4 className="text-sm font-bold text-on-surface">
              {message.deliverableTitle}
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              {message.deliverableNote || 'Deliverable files have been submitted for your review.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isMe = message.isMe;

  return (
    <div className={`flex items-start gap-2.5 max-w-lg ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
      {!isMe && (
        <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-xs text-primary shrink-0 border border-outline-variant/30">
          {message.senderAvatar}
        </div>
      )}

      <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-1.5 text-xs text-on-surface-variant">
          {!isMe && <span className="font-semibold text-on-surface">{message.senderName}</span>}
          <span className="text-[11px]">{message.timestamp}</span>
          {isMe && <span className="material-symbols-outlined text-primary text-[14px]">done_all</span>}
        </div>

        <div
          className={`px-4 py-2.5 rounded-2xl text-xs leading-relaxed max-w-md break-words ${
            isMe
              ? 'bg-primary text-on-primary rounded-tr-sm shadow-sm'
              : 'bg-surface-container text-on-surface rounded-tl-sm border border-outline-variant/20'
          }`}
        >
          {message.text}
        </div>
      </div>
    </div>
  );
};
