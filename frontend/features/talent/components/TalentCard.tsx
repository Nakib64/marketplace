'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Heart } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentCardProps {
  profile: FreelancerProfile;
}

export function TalentCard({ profile }: TalentCardProps) {
  const user = useAuthStore((s) => s.user);
  const isFreelancer = user?.role === 'FREELANCER';

  const displayName = profile.title
    ? profile.user.email.split('@')[0]
    : 'Web3 Specialist';
  const hourlyRate = profile.hourlyRate ? Number(profile.hourlyRate) : 0;
  const rating = Number(profile.rating || 5.0);
  const totalReviews = profile.totalReviews || 0;
  const earned = profile.earnings ? Number(profile.earnings) : 0;
  const success = profile.successRate || 100;

  return (
    <article className="group p-6 sm:p-7 rounded-2xl bg-white border border-[#e4ebe4] hover:border-[#14a800] transition-all duration-150 flex flex-col gap-4 shadow-xs">
      {/* Top Header: Avatar, Name, Rate */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-full bg-[#f2f7f2] border border-[#e4ebe4] flex items-center justify-center shrink-0 text-xl font-bold text-[#14a800]">
            {displayName.charAt(0).toUpperCase()}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-[#14a800] ring-2 ring-white" />
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/freelancers/${profile.slug || profile.id}`}
                className="text-base sm:text-lg font-semibold text-[#001e00] hover:text-[#14a800] hover:underline capitalize truncate tracking-tight"
              >
                {displayName.replace('.', ' ')}
              </Link>
            </div>

            <p className="text-sm text-[#5e6d55] mt-0.5">
              {profile.title || 'Software & Web Developer'}
            </p>

            {/* Badges / Metrics Strip */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#5e6d55] mt-1.5">
              <span className="inline-flex items-center gap-1 font-semibold text-[#14a800]">
                <ShieldCheck className="w-3.5 h-3.5" />
                TOP RATED
              </span>
              <span>•</span>
              <span className="font-semibold text-[#001e00]">{success}% Job Success</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-[#001e00] font-medium">
                <Star className="w-3.5 h-3.5 fill-[#14a800] text-[#14a800]" />
                {rating.toFixed(1)} ({totalReviews})
              </span>
              <span>•</span>
              <span>{formatCurrency(earned)} earned</span>
            </div>
          </div>
        </div>

        {/* Rate & Bookmark */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto shrink-0 gap-2">
          <div className="text-right">
            {hourlyRate > 0 ? (
              <span className="text-lg font-bold text-[#001e00]">
                {formatCurrency(hourlyRate)} <span className="text-xs text-[#5e6d55] font-normal">/hr</span>
              </span>
            ) : (
              <span className="text-sm font-semibold text-[#14a800]">Fixed &amp; Hourly</span>
            )}
          </div>
          <button
            type="button"
            aria-label="Save talent"
            className="w-8 h-8 rounded-full border border-[#e4ebe4] hover:border-[#14a800] hover:text-[#14a800] flex items-center justify-center transition-colors text-[#5e6d55]"
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bio Overview */}
      <p className="text-sm text-[#001e00]/90 leading-relaxed line-clamp-2 font-normal">
        {profile.description || 'Experienced developer specialized in building performant, scalable, production-ready solutions.'}
      </p>

      {/* Skills & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 border-t border-[#e4ebe4]">
        <div className="flex flex-wrap gap-2">
          {profile.skills.slice(0, 5).map((s) => (
            <span
              key={s}
              className="px-3 py-1 rounded-full bg-[#f2f7f2] hover:bg-[#e4ebe4] text-xs font-medium text-[#001e00] transition-colors"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href={`/freelancers/${profile.slug || profile.id}`}
            className="px-4 py-2 rounded-full border border-[#14a800] text-[#14a800] hover:bg-[#f2f7f2] font-medium text-xs transition-colors cursor-pointer"
          >
            View Profile
          </Link>
          <Link
            href={`/freelancers/${profile.slug || profile.id}`}
            className="px-5 py-2 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white font-medium text-xs transition-colors cursor-pointer shadow-xs"
          >
            {isFreelancer ? 'View Dossier' : 'Invite to Job'}
          </Link>
        </div>
      </div>
    </article>
  );
}
