'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { MessageSquare, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { connectSocket } from '@/lib/socket/socketClient';
import {
  WorkroomChannel,
  WorkroomMessage,
  BackendMessageItem,
  mapBackendMessage,
} from '../types/messageTypes';
import { messagesApi } from '../api/messagesApi';
import { WorkroomChannelSidebar } from './WorkroomChannelSidebar';
import { WorkroomChatHeader } from './WorkroomChatHeader';
import { WorkroomMessageBubble } from './WorkroomMessageBubble';
import { WorkroomMessageComposer } from './WorkroomMessageComposer';
import { Button } from '@/components/ui/Button';

export const WorkroomsView: React.FC = () => {
  const user = useAuthStore((s) => s.user);
  const currentUserId = user?.id;

  const [channels, setChannels] = useState<WorkroomChannel[]>([]);
  const [activeChannelId, setActiveChannelId] = useState<string>('');
  const [messages, setMessages] = useState<WorkroomMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesApi.getConversations().then((data) => {
      setChannels(data);
      if (data && data.length > 0) {
        setActiveChannelId((prev) => (prev && data.some((c) => c.id === prev) ? prev : data[0].id));
      }
      setIsLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!activeChannelId) {
      setMessages([]);
      return;
    }

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

  const activeChannel = channels.find((c) => c.id === activeChannelId);

  const handleSendMessage = async (text: string) => {
    if (!activeChannelId) return;
    try {
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
    } catch {
      // Message sending handled gracefully
    }
  };

  if (!isLoading && channels.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center mb-4 text-primary">
          <MessageSquare className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-on-surface mb-2">No Active Conversations</h2>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          Conversations are initiated automatically when a proposal is submitted or accepted on a job.
        </p>
        <Link href={user?.role === 'CLIENT' ? '/client/jobs' : '/jobs'}>
          <Button variant="primary" className="flex items-center gap-2">
            <span>{user?.role === 'CLIENT' ? 'View Posted Jobs' : 'Browse Open Jobs'}</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex w-full h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* Left Pane: Conversation List */}
      <WorkroomChannelSidebar
        channels={channels}
        activeChannelId={activeChannelId}
        onSelectChannel={setActiveChannelId}
      />

      {/* Main Chat Pane */}
      <section className="flex-1 bg-surface flex flex-col justify-between overflow-hidden">
        {activeChannel ? (
          <>
            <WorkroomChatHeader channel={activeChannel} />

            {/* Message Thread */}
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto flex flex-col gap-4">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center text-xs text-on-surface-variant">
                  No messages yet. Send a message to start the conversation.
                </div>
              ) : (
                messages.map((msg) => (
                  <WorkroomMessageBubble key={msg.id} message={msg} />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <WorkroomMessageComposer onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-on-surface-variant">
            Select a conversation to start chatting.
          </div>
        )}
      </section>
    </div>
  );
};
