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

  const filteredChannels = channels.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.contactName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-full md:w-[320px] lg:w-[340px] shrink-0 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col justify-between overflow-hidden">
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-4 flex flex-col gap-3 border-b border-outline-variant/20">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-on-surface">Messages</h2>
            <span className="text-xs text-on-surface-variant font-medium">
              {channels.length} {channels.length === 1 ? 'chat' : 'chats'}
            </span>
          </div>

          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[18px]">
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-surface-container text-on-surface placeholder:text-on-surface-variant text-xs focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30 transition-all"
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-outline-variant/10">
          {filteredChannels.length === 0 ? (
            <div className="p-6 text-center text-xs text-on-surface-variant">
              No conversations found.
            </div>
          ) : (
            filteredChannels.map((channel) => {
              const isActive = channel.id === activeChannelId;
              return (
                <button
                  key={channel.id}
                  type="button"
                  onClick={() => onSelectChannel(channel.id)}
                  className={`w-full text-left p-3.5 flex items-start gap-3 transition-colors relative cursor-pointer ${
                    isActive
                      ? 'bg-surface-container-high/60'
                      : 'hover:bg-surface-container-low'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
                  )}

                  {/* Avatar */}
                  <div className="relative w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center shrink-0 font-bold text-xs text-primary border border-outline-variant/30">
                    {channel.avatarText}
                    {channel.isOnline && (
                      <span className="w-2.5 h-2.5 rounded-full bg-primary ring-2 ring-surface-container-lowest absolute bottom-0 right-0" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-1 mb-0.5">
                      <span className="text-xs font-bold text-on-surface truncate">
                        {channel.contactName}
                      </span>
                      <span className="text-[11px] text-on-surface-variant shrink-0">
                        {channel.timestamp}
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-primary truncate mb-1">
                      {channel.title}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs text-on-surface-variant truncate">
                        {channel.lastMessage}
                      </p>
                      {Boolean(channel.unreadCount && channel.unreadCount > 0) && (
                        <span className="min-w-4 h-4 px-1 rounded-full bg-primary text-[10px] font-bold text-on-primary flex items-center justify-center shrink-0">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </aside>
  );
};
