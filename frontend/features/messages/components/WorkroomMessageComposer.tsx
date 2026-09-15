'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';

interface WorkroomMessageComposerProps {
  onSendMessage: (text: string) => Promise<void>;
}

export const WorkroomMessageComposer: React.FC<WorkroomMessageComposerProps> = ({
  onSendMessage,
}) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() || isSending) return;
    setIsSending(true);
    try {
      await onSendMessage(text);
      setText('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-surface-container-lowest border-t border-outline-variant/30 shrink-0">
      <form
        onSubmit={handleSend}
        className="flex items-end gap-2 p-2 rounded-2xl bg-surface-container border border-outline-variant/30 focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20 transition-all"
      >
        <button
          type="button"
          onClick={() => toast.info('File attachment dialog opened')}
          className="p-2 rounded-xl text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors shrink-0"
          title="Attach file"
        >
          <span className="material-symbols-outlined text-[20px]">attach_file</span>
        </button>

        <textarea
          rows={1}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message... (Press Enter to send)"
          className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant text-xs sm:text-sm resize-none focus:outline-none py-2 px-1 max-h-32 min-h-[38px] leading-relaxed"
        />

        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="p-2.5 rounded-xl bg-primary hover:bg-primary-container disabled:opacity-40 text-on-primary font-bold transition-all shrink-0 flex items-center justify-center shadow-sm"
          title="Send"
        >
          <span className="material-symbols-outlined text-[18px]">send</span>
        </button>
      </form>
    </div>
  );
};
