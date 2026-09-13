'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { connectSocket } from '@/lib/socket/socketClient';
import {
  WorkroomChannel,
  WorkroomMessage,
  BackendMessageItem,
  mapBackendMessage,
} from '../types/messageTypes';
import { messagesApi } from '../api/messagesApi';
import { INITIAL_CHANNELS, INITIAL_MESSAGES, ACTIVE_ESCROW_CONTEXT } from '../data/mockMessagesData';
import { WorkroomTopNav } from './WorkroomTopNav';
import { WorkroomChannelSidebar } from './WorkroomChannelSidebar';
import { WorkroomChatHeader } from './WorkroomChatHeader';
import { WorkroomMessageBubble } from './WorkroomMessageBubble';
import { WorkroomMessageComposer } from './WorkroomMessageComposer';
import { WorkroomTelemetrySidebar } from './WorkroomTelemetrySidebar';

export const WorkroomsView: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const currentUserId = user?.id;

  const [channels, setChannels] = useState<WorkroomChannel[]>(INITIAL_CHANNELS);
  const [activeChannelId, setActiveChannelId] = useState<string>(INITIAL_CHANNELS[0].id);
  const [messages, setMessages] = useState<WorkroomMessage[]>(INITIAL_MESSAGES);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesApi.getConversations().then((data) => {
      if (data && data.length > 0) {
        setChannels(data);
        if (!data.some((c) => c.id === activeChannelId)) {
          setActiveChannelId(data[0].id);
        }
      }
    });
  }, [activeChannelId]);

  useEffect(() => {
    messagesApi.getMessages(activeChannelId, currentUserId).then(setMessages);
    messagesApi.markAsRead(activeChannelId);

    const socket = connectSocket();
    socket.emit('join_conversation', { conversationId: activeChannelId });

    const handleNewMessage = (rawMsg: BackendMessageItem) => {
      if (rawMsg.conversationId === activeChannelId) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === rawMsg.id)) return prev;
          return [...prev, mapBackendMessage(rawMsg, currentUserId)];
        });
      }
      setChannels((prev) =>
        prev.map((c) =>
          c.id === rawMsg.conversationId
            ? { ...c, lastMessage: rawMsg.content, timestamp: 'Just now' }
            : c
        )
      );
    };

    socket.on('new_message', handleNewMessage);

    return () => {
      socket.emit('leave_conversation', { conversationId: activeChannelId });
      socket.off('new_message', handleNewMessage);
    };
  }, [activeChannelId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];

  const handleSendMessage = async (text: string) => {
    const newMsg = await messagesApi.sendMessage(activeChannelId, text, currentUserId);
    setMessages((prev) => {
      if (prev.some((m) => m.id === newMsg.id)) return prev;
      return [...prev, newMsg];
    });
    setChannels((prev) =>
      prev.map((c) =>
        c.id === activeChannelId
          ? { ...c, lastMessage: text, timestamp: 'Just now' }
          : c
      )
    );
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
            <div ref={messagesEndRef} />
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
