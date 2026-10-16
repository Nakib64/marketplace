'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { proposalsApi } from '../api/proposalsApi';
import { ProposalItem } from '../types/proposalsTypes';

interface ProposalMessageModalProps {
  isOpen: boolean;
  proposal: ProposalItem;
  onClose: () => void;
}

export const ProposalMessageModal: React.FC<ProposalMessageModalProps> = ({
  isOpen,
  proposal,
  onClose,
}) => {
  const router = useRouter();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter a message for the candidate.');
      return;
    }

    setIsSending(true);
    try {
      const res = await proposalsApi.replyToProposal(proposal.id, message.trim());
      toast.success(`Message sent to ${proposal.freelancerName}! Opening conversation...`);
      onClose();
      if (res?.conversation?.id) {
        router.push(`/messages?conversationId=${res.conversation.id}`);
      } else {
        router.push('/messages');
      }
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to send message to candidate.';
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 text-xs">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">forum</span>
            <div>
              <h3 className="text-base font-bold text-on-surface">Message Candidate</h3>
              <p className="text-[11px] text-on-surface-variant">
                Interview and discuss project scope before hiring
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Candidate Summary */}
        <div className="bg-surface-container p-3 rounded-xl border border-outline-variant/20 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-sm border border-outline-variant/30">
            {proposal.freelancerName?.charAt(0).toUpperCase() || 'C'}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold text-on-surface truncate">{proposal.freelancerName}</span>
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-medium">
                Bid: ৳{proposal.bidAmount.toLocaleString()} BDT
              </span>
            </div>
            <span className="text-[11px] text-on-surface-variant truncate block">
              {proposal.freelancerRole}
            </span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface text-[11px]">
              Initial Message / Technical Questions *
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hi, thanks for your proposal! I have a few questions about your approach regarding..."
              className="w-full bg-surface-container border border-outline-variant/30 p-3 rounded-xl text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-y leading-relaxed"
            />
          </div>

          <div className="bg-surface-container/60 p-2.5 rounded-lg border border-outline-variant/20 flex items-start gap-2">
            <span className="material-symbols-outlined text-primary text-[15px] shrink-0 mt-0.5">lock</span>
            <span className="text-[10px] text-on-surface-variant leading-tight">
              A private workroom thread will be opened where you can chat in real-time, share files, and align on deliverables.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[15px]">send</span>
              <span>{isSending ? 'Sending...' : 'Send Message & Open Chat'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
