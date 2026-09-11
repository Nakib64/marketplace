'use client';

import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Share2, Flag, Check } from 'lucide-react';
import { toast } from 'sonner';

interface JobMetaActionsProps {
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onOpenReport: () => void;
}

export function JobMetaActions({
  isBookmarked,
  onToggleBookmark,
  onOpenReport,
}: JobMetaActionsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    if (typeof window !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Job link copied to clipboard!');
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 px-1">
      {/* Bookmark and Share */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleBookmark}
          className="h-10 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          {isBookmarked ? (
            <>
              <BookmarkCheck className="w-4 h-4 text-primary" />
              <span>Saved</span>
            </>
          ) : (
            <>
              <Bookmark className="w-4 h-4 text-on-surface-variant" />
              <span>Bookmark Job</span>
            </>
          )}
        </button>

        <button
          onClick={handleShare}
          className="h-10 px-4 rounded-xl bg-surface-container-high hover:bg-surface-bright text-on-surface transition-colors flex items-center gap-2 text-xs font-semibold"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-primary" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4 text-on-surface-variant" />
              <span>Share</span>
            </>
          )}
        </button>
      </div>

      {/* Flag / Report Job */}
      <button
        onClick={onOpenReport}
        className="text-xs font-semibold text-on-surface-variant hover:text-error transition-colors flex items-center gap-1.5 py-2 px-1"
      >
        <Flag className="w-3.5 h-3.5" />
        <span>Report Job</span>
      </button>
    </div>
  );
}
