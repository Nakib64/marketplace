'use client';

import React from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';

interface ProfileEditHeaderProps {
  onSave: () => void;
  isSaving?: boolean;
}

export const ProfileEditHeader: React.FC<ProfileEditHeaderProps> = ({ onSave, isSaving }) => {
  const { user } = useAuthStore();
  const profileHref = user?.id ? `/freelancers/${user.id}` : '/freelancers';

  return (
    <div className="flex flex-col gap-4 mb-6 pb-4 border-b border-outline-variant/30">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-on-surface">
            Profile Settings
          </h1>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href={profileHref}
            className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface text-xs font-semibold flex items-center gap-1.5 transition-colors border border-outline-variant/30 shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px] text-on-surface-variant">visibility</span>
            <span>Preview Profile</span>
          </Link>
          <button
            type="button"
            disabled={isSaving}
            onClick={onSave}
            className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-md transition-all"
          >
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>{isSaving ? 'Saving...' : 'Save Profile'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

