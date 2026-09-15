'use client';

import React from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/useAuthStore';

interface ProfileDecentralizedIdentitySectionProps {
  title: string;
  onTitleChange: (val: string) => void;
  bio: string;
  onBioChange: (val: string) => void;
  ensDomain: string;
  onEnsChange: (val: string) => void;
}

export const ProfileDecentralizedIdentitySection: React.FC<ProfileDecentralizedIdentitySectionProps> = ({
  title,
  onTitleChange,
  bio,
  onBioChange,
  ensDomain,
  onEnsChange,
}) => {
  const user = useAuthStore((s) => s.user);
  const displayName = user?.name || user?.email?.split('@')[0] || 'Freelancer';
  const isVerified = user?.isEmailVerified;
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <section className="p-5 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">account_box</span>
          </div>
          <h2 className="text-base font-bold text-on-surface">Basic Information</h2>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-2xl text-primary shrink-0">
          {initial}
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-base font-bold text-on-surface capitalize">{displayName}</span>
            <span className="text-xs text-on-surface-variant">• {user?.email || 'freelancer@marketplace.com'}</span>
            {isVerified ? (
              <span className="text-xs text-primary font-medium flex items-center gap-1 bg-primary/10 px-2 py-0.5 rounded-full">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Verified Email
              </span>
            ) : (
              <Link
                href="/verify-email"
                className="text-[11px] font-bold text-on-primary bg-primary hover:bg-primary-container px-2.5 py-0.5 rounded-lg transition-colors shadow-sm"
              >
                Verify Email
              </Link>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => toast.info('Profile picture upload will be enabled soon.')}
              className="px-3 py-1 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface text-xs font-semibold flex items-center gap-1 transition-colors border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-[14px]">upload</span>
              <span>Change Photo</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-on-surface">
            Portfolio / Personal Website
          </label>
          <input
            type="text"
            value={ensDomain}
            onChange={(e) => onEnsChange(e.target.value)}
            placeholder="https://yourportfolio.com"
            className="w-full bg-surface-container-low border border-outline-variant/30 px-3.5 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-on-surface">Professional Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Senior Full Stack Engineer"
            className="w-full bg-surface-container-low border border-outline-variant/30 px-3.5 py-2 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-on-surface">Professional Bio</label>
        <textarea
          value={bio}
          onChange={(e) => onBioChange(e.target.value)}
          rows={3}
          placeholder="Brief summary of your experience, skills, and background..."
          className="w-full p-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-xs text-on-surface focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
        />
      </div>
    </section>
  );
};
