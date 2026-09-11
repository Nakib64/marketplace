'use client';

import React, { useState, useEffect } from 'react';
import { WorkroomChannel, WorkroomMessage } from '../types/messageTypes';
import { messagesApi } from '../api/messagesApi';
import { INITIAL_CHANNELS, INITIAL_MESSAGES, ACTIVE_ESCROW_CONTEXT } from '../data/mockMessagesData';
import { WorkroomTopNav } from './WorkroomTopNav';
import { WorkroomChannelSidebar } from './WorkroomChannelSidebar';
import { WorkroomChatHeader } from './WorkroomChatHeader';
import { WorkroomMessageBubble } from './WorkroomMessageBubble';
import { WorkroomMessageComposer } from './WorkroomMessageComposer';
import { WorkroomTelemetrySidebar } from './WorkroomTelemetrySidebar';

export const WorkroomsView: React.FC = () => {
  const [channels, setChannels] = useState<WorkroomChannel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>(INITIAL_CHANNELS[0].id);
  const [messages, setMessages] = useState<WorkroomMessage[]>(INITIAL_MESSAGES);

  useEffect(() => {
    messagesApi.getConversations().then((data) => {
      if (data && data.length > 0) setChannels(data);
    });
  }, []);

  useEffect(() => {
    messagesApi.getMessages(activeChannelId).then(setMessages);
  }, [activeChannelId]);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleSendMessage = async (text: string) => {
    const newMsg = await messagesApi.sendMessage(activeChannelId, text);
    setMessages((prev) => [...prev, newMsg]);
  };

  return (
    <div className="flex flex-col w-full h-[calc(100vh-4rem)] min-h-[600px] bg-surface overflow-hidden">
      <WorkroomTopNav activeTitle={`${activeChannel.title} (${activeChannel.rfpNumber})`} />

      <div className="w-full flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Left Pane (320px) */}
        <WorkroomChannelSidebar
          channels={channels}
          activeChannelId={activeChannelId}
          onSelectChannel={setActiveChannelId}
        />

        {/* Middle Pane (Chat Canvas) */}
        <section className="flex-1 bg-surface flex flex-col justify-between overflow-hidden">
          <WorkroomChatHeader channel={activeChannel} />

          <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
            <div className="flex items-center justify-center">
              <span className="px-3 py-1 rounded-full bg-surface-container-low font-mono text-[10px] text-on-surface-variant border border-outline-variant/20">
                Today • Arbitrum Execution Block #19824050
              </span>
            </div>

            <div className="w-full py-2 px-3.5 rounded-xl bg-surface-container-low flex items-center justify-between text-xs border border-outline-variant/20">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[16px]">bolt</span>
                <span className="font-semibold text-on-surface">Milestone Deliverable Submitted</span>
                <span className="text-on-surface-variant hidden sm:inline">• 36h Grace Period Countdown Initiated</span>
              </div>
              <span className="font-mono text-primary text-[11px]">Tx: 0x4aa2...91bc</span>
            </div>

            {messages.map((msg) => (
              <WorkroomMessageBubble key={msg.id} message={msg} />
            ))}
          </div>

          <WorkroomMessageComposer onSendMessage={handleSendMessage} />
        </section>

        {/* Right Pane (Escrow Telemetry Drawer) */}
        <div className="hidden xl:flex">
          <WorkroomTelemetrySidebar
            context={ACTIVE_ESCROW_CONTEXT}
            contractId={activeChannel.id}
          />
        </div>
      </div>
    </div>
  );
};
