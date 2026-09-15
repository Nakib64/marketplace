'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { WorkroomChannel } from '../types/messageTypes';

interface WorkroomChatHeaderProps {
  channel: WorkroomChannel;
}

export const WorkroomChatHeader: React.FC<WorkroomChatHeaderProps> = ({ channel }) => {
  return (
    <div className="px-5 py-3.5 bg-surface-container-lowest border-b border-outline-variant/30 flex items-center justify-between gap-4 shrink-0 shadow-sm">
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-sm text-primary shrink-0 border border-outline-variant/30">
          {channel.avatarText}
          {channel.isOnline && (
            <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest absolute bottom-0 right-0" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-on-surface truncate">
              {channel.contactName}
            </span>
            <span className="text-[11px] text-on-surface-variant font-medium">
              • {channel.contactRole || 'Freelancer'}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-primary font-medium truncate">
            <span className="truncate">{channel.title}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Link
          href={`/contracts/${channel.id}`}
          className="px-3.5 py-1.5 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold transition-colors flex items-center gap-1.5 border border-outline-variant/30 shadow-sm"
        >
          <span className="material-symbols-outlined text-[16px] text-primary">
            description
          </span>
          <span className="hidden sm:inline">View Contract</span>
        </Link>
      </div>
    </div>
  );
};
