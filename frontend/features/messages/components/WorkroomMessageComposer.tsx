'use client';

import React, { useState } from 'react';

interface WorkroomMessageComposerProps {
  onSendMessage: (text: string) => Promise<void>;
}

export const WorkroomMessageComposer: React.FC<WorkroomMessageComposerProps> = ({
  onSendMessage,
}) => {
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setIsSending(true);
    try {
      await onSendMessage(text);
      setText('');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="p-3.5 bg-surface-container-lowest border-t border-outline-variant/30 flex flex-col gap-2 shrink-0">
      {/* Markdown & IPFS Actions Bar */}
      <div className="flex items-center justify-between text-on-surface-variant text-xs">
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => setText(prev => prev + '**bold**')} className="p-1 rounded hover:bg-surface-container hover:text-on-surface" title="Bold">
            <span className="material-symbols-outlined text-[16px]">format_bold</span>
          </button>
          <button type="button" onClick={() => setText(prev => prev + '`code`')} className="p-1 rounded hover:bg-surface-container hover:text-on-surface" title="Code Block">
            <span className="material-symbols-outlined text-[16px]">code</span>
          </button>
          <div className="w-[1px] h-3.5 bg-surface-container-high mx-1" />
          <button type="button" onClick={() => alert('IPFS file uploader opened')} className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center gap-1 font-mono text-[11px]">
            <span className="material-symbols-outlined text-[14px] text-primary">cloud_upload</span>
            <span>Pin IPFS</span>
          </button>
          <button type="button" onClick={() => alert('GitHub PR attach modal')} className="px-2 py-0.5 rounded bg-surface-container hover:bg-surface-container-high text-on-surface flex items-center gap-1 font-mono text-[11px]">
            <span className="material-symbols-outlined text-[14px]">data_object</span>
            <span>Attach PR</span>
          </button>
        </div>
        <div className="flex items-center gap-1 text-on-surface-variant font-mono text-[10px]">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span>E2EE Active</span>
        </div>
      </div>

      {/* Textarea Form */}
      <form onSubmit={handleSend} className="flex flex-col rounded-xl bg-surface-container p-2 border border-outline-variant/30 focus-within:border-primary/50 transition-colors">
        <textarea
          rows={2}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Compose secure encrypted dispatch or paste contract payload hash..."
          className="w-full bg-transparent text-on-surface placeholder:text-on-surface-variant text-xs resize-none focus:outline-none p-1 font-mono"
        />

        <div className="flex items-center justify-between pt-2 border-t border-outline-variant/10 text-xs">
          <div className="flex items-center gap-1.5 text-on-surface-variant font-mono text-[11px]">
            <span className="material-symbols-outlined text-[14px]">fingerprint</span>
            <span>Signed: 0x3C49...81B7</span>
          </div>

          <button
            type="submit"
            disabled={isSending || !text.trim()}
            className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">enhanced_encryption</span>
            <span>{isSending ? 'Encrypting...' : 'Send Message'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
