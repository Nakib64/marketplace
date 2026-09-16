'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit3, Eye, Trash2, Loader2 } from 'lucide-react';

interface PortfolioEditorHeaderProps {
  portfolioItemId?: string;
  activeTab: 'edit' | 'preview';
  onTabChange: (tab: 'edit' | 'preview') => void;
  onDelete: () => void;
  isDeleting: boolean;
  isSubmitting: boolean;
}

export const PortfolioEditorHeader: React.FC<PortfolioEditorHeaderProps> = ({
  portfolioItemId,
  activeTab,
  onTabChange,
  onDelete,
  isDeleting,
  isSubmitting,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
      <div className="flex items-center gap-3">
        <Link
          href="/freelancer/profile/edit"
          className="p-2 rounded-xl bg-surface-container hover:bg-surface-container-high border border-outline-variant/30 text-on-surface-variant hover:text-on-surface transition-colors"
          title="Back to Profile"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-primary font-bold tracking-wider uppercase">
              Freelancer Profile
            </span>
            <span className="text-outline-variant">•</span>
            <span className="text-xs text-on-surface-variant">
              {portfolioItemId ? 'Edit Project' : 'New Project'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-on-surface">
            {portfolioItemId ? 'Edit Portfolio Showcase' : 'Add New Portfolio Showcase'}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex items-center bg-surface-container-low p-1 rounded-xl border border-outline-variant/30">
          <button
            type="button"
            onClick={() => onTabChange('edit')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Editor</span>
          </button>
          <button
            type="button"
            onClick={() => onTabChange('preview')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-primary text-on-primary shadow-sm'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Client Preview</span>
          </button>
        </div>

        {portfolioItemId && (
          <button
            type="button"
            disabled={isDeleting || isSubmitting}
            onClick={onDelete}
            className="p-2 rounded-xl text-error hover:bg-error/10 border border-error/20 transition-colors cursor-pointer"
            title="Delete project"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
};
