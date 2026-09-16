'use client';

import React from 'react';
import Link from 'next/link';
import {
  CheckCircle2,
  CircleDashed,
  User,
  Wallet,
  Bell,
  Shield,
  MapPin,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
} from 'lucide-react';
import { FreelancerProfile } from '@/features/talent/types/talentTypes';

interface ProfileEditSidebarProps {
  profile?: FreelancerProfile | null;
  activeTab?: string;
  onSelectTab?: (tab: string) => void;
}

export const ProfileEditSidebar: React.FC<ProfileEditSidebarProps> = ({
  profile,
}) => {
  // Compute Completeness Breakdown
  const hasBasicInfo = Boolean(profile?.title?.trim() && profile?.description?.trim());
  const hasWorkParams = Boolean(
    (profile?.hourlyRate && Number(profile.hourlyRate) > 0) || (profile?.skills && profile.skills.length > 0)
  );
  const hasAddress = Boolean(profile?.city?.trim() || profile?.address?.trim());
  const hasPortfolio = Boolean(profile?.portfolioItems && profile.portfolioItems.length > 0);
  const hasWorkHistory = Boolean(
    (profile?.user?.workHistories && profile.user.workHistories.length > 0)
  );
  const hasEducation = Boolean(profile?.educations && profile.educations.length > 0);
  const hasCertificates = Boolean(profile?.certificates && profile.certificates.length > 0);

  let score = 0;
  if (hasBasicInfo) score += 20;
  if (hasWorkParams) score += 15;
  if (hasAddress) score += 10;
  if (hasPortfolio) score += 20;
  if (hasWorkHistory) score += 15;
  if (hasEducation) score += 10;
  if (hasCertificates) score += 10;

  const checklist = [
    { label: 'Basic Info & Bio', weight: 20, done: hasBasicInfo, icon: User },
    { label: 'Hourly Rate & Skills', weight: 15, done: hasWorkParams, icon: Sparkles },
    { label: 'Address & Location', weight: 10, done: hasAddress, icon: MapPin },
    { label: 'Portfolio Projects', weight: 20, done: hasPortfolio, icon: FolderGit2 },
    { label: 'Work Experience', weight: 15, done: hasWorkHistory, icon: Briefcase },
    { label: 'Education History', weight: 10, done: hasEducation, icon: GraduationCap },
    { label: 'Certificates & Badges', weight: 10, done: hasCertificates, icon: Award },
  ];

  return (
    <aside className="lg:col-span-3 flex flex-col gap-4 sticky top-24">
      {/* Navigation Links */}
      <div className="p-1 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-1 shadow-sm text-xs">
        <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-surface-container-high text-on-surface font-semibold">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-3.5 rounded-full bg-primary" />
            <User className="w-4 h-4 text-primary" />
            <span>Profile Settings</span>
          </div>
          <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
        </div>

        <Link
          href="/wallet"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium transition-colors"
        >
          <div className="flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            <span>Wallet &amp; Payouts</span>
          </div>
        </Link>

        <Link
          href="/messages"
          className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/50 font-medium transition-colors"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <span>Notifications &amp; Chat</span>
          </div>
        </Link>

        <div className="flex items-center justify-between px-3.5 py-2 rounded-lg text-on-surface-variant hover:text-on-surface font-medium transition-colors">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            <span>Account Security</span>
          </div>
        </div>
      </div>

      {/* Dynamic Profile Strength & Completeness Meter */}
      <div className="p-4 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-3 shadow-sm">
        <div className="flex items-center justify-between text-xs">
          <span className="text-on-surface font-bold">Profile Setup Progress</span>
          <span className="text-xs font-bold text-primary">{score}%</span>
        </div>

        <div className="w-full h-2 rounded-full bg-surface-container-highest overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 rounded-full"
            style={{ width: `${score}%` }}
          />
        </div>

        <p className="text-[11px] text-on-surface-variant leading-relaxed">
          {score === 100
            ? '🎉 Your profile is 100% complete! Clients can see your full credentials and history.'
            : 'Complete remaining sections to boost your ranking on client searches.'}
        </p>

        {/* Section Completion Breakdown */}
        <div className="flex flex-col gap-1.5 pt-2 border-t border-outline-variant/20 text-xs">
          {checklist.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-2 rounded-lg bg-surface-container-low border border-outline-variant/20"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Icon className="w-3.5 h-3.5 text-on-surface-variant shrink-0" />
                  <span className="text-on-surface text-[11px] font-medium truncate">{item.label}</span>
                </div>

                {item.done ? (
                  <span className="text-primary text-[10px] font-bold flex items-center gap-1 shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    +{item.weight}%
                  </span>
                ) : (
                  <span className="text-outline text-[10px] flex items-center gap-1 shrink-0">
                    <CircleDashed className="w-3 h-3" />
                    +{item.weight}%
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

