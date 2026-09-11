'use client';

import React, { useState } from 'react';
import { WorkroomChannel } from '../types/messageTypes';

interface WorkroomChannelSidebarProps {
  channels: WorkroomChannel[];
  activeChannelId: string;
  onSelectChannel: (id: string) => void;
}

export const WorkroomChannelSidebar: React.FC<WorkroomChannelSidebarProps> = ({
  channels,
  activeChannelId,
  onSelectChannel,
}) => {
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'all' | 'vaults' | 'archived'>('all');

  const filteredChannels = channels.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.contactName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-full md:w-[300px] lg:w-[320px] shrink-0 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="p-3.5 flex flex-col gap-2.5 border-b border-outline-variant/20">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-on-surface">Secure Channels</span>
            <span className="flex items-center gap-1 text-primary font-mono text-[10px] px-2 py-0.5 rounded bg-surface-container-low border border-outline-variant/20">
              <span className="material-symbols-outlined text-[13px]">lock</span> E2EE
            </span>
          </div>

          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-2.5 top-2 text-on-surface-variant text-[16px]">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contracts or identities..."
              className="w-full pl-8 pr-3 py-1.5 rounded bg-surface-container text-on-surface placeholder:text-on-surface-variant text-xs focus:outline-none border border-outline-variant/30"
            />
          </div>

          <div className="grid grid-cols-3 gap-1 p-0.5 bg-surface-container-low rounded text-[11px] font-medium">
            <button type="button" onClick={() => setTab('all')} className={`py-1 rounded ${tab === 'all' ? 'bg-surface-container-high text-primary font-semibold' : 'text-on-surface-variant'}`}>All ({channels.length})</button>
            <button type="button" onClick={() => setTab('vaults')} className={`py-1 rounded ${tab === 'vaults' ? 'bg-surface-container-high text-primary font-semibold' : 'text-on-surface-variant'}`}>Vaults</button>
            <button type="button" onClick={() => setTab('archived')} className={`py-1 rounded ${tab === 'archived' ? 'bg-surface-container-high text-primary font-semibold' : 'text-on-surface-variant'}`}>Archived</button>
          </div>
        </div>

        <div className="flex flex-col">
          {filteredChannels.map((channel) => {
            const isActive = channel.id === activeChannelId;
            return (
              <div
                key={channel.id}
                onClick={() => onSelectChannel(channel.id)}
                className={`p-3 flex flex-col gap-1 cursor-pointer relative border-b border-outline-variant/10 transition-colors ${
                  isActive ? 'bg-surface-container' : 'hover:bg-surface-container-low'
                }`}
              >
                {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="relative w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 font-bold text-xs text-primary">
                      {channel.avatarText}
                      {channel.isOnline && <span className="w-2 h-2 rounded-full bg-primary absolute -bottom-0.5 -right-0.5" />}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-semibold text-on-surface truncate">{channel.contactName}</span>
                        <span className="material-symbols-outlined text-primary text-[13px]">verified</span>
                      </div>
                      <span className="text-[10px] text-on-surface-variant font-mono truncate block">{channel.contactEns}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end shrink-0">
                    <span className="font-mono text-[10px] text-on-surface-variant">{channel.timestamp}</span>
                    {channel.unreadCount && <span className="w-2 h-2 rounded-full bg-primary mt-1" />}
                  </div>
                </div>

                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container-low w-fit mt-0.5">
                  <span className="material-symbols-outlined text-primary text-[11px]">token</span>
                  <span className="font-mono text-[10px] text-on-surface-variant">{channel.contractAddress}</span>
                </div>
                <p className="text-xs text-on-surface-variant line-clamp-1 mt-0.5">{channel.lastMessage}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-3 bg-surface-container-low border-t border-outline-variant/20 flex items-center justify-between text-on-surface-variant font-mono text-[11px]">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span>XMTP Gateway v3</span>
        </div>
        <span className="text-on-surface">32.4ms</span>
      </div>
    </aside>
  );
};
