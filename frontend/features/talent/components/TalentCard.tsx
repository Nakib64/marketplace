import React from 'react';
import Link from 'next/link';
import { Star, ShieldCheck, Zap } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentCardProps {
  profile: FreelancerProfile;
}

export function TalentCard({ profile }: TalentCardProps) {
  const displayName = profile.title
    ? profile.user.email.split('@')[0]
    : 'Web3 Specialist';
  const hourlyRate = profile.hourlyRate ? Number(profile.hourlyRate) : 75;
  const rating = profile.rating || 5.0;
  const totalReviews = profile.totalReviews || 18;
  const earned = profile.earnings ? Number(profile.earnings) : 85000;
  const success = profile.successRate || 100;
  const projects = profile.totalProjects || 12;

  return (
    <article className="p-6 sm:p-7 rounded-2xl bg-surface-container border border-outline-variant/30 hover:border-primary/50 transition-all duration-200 flex flex-col gap-5 shadow-sm">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="relative w-14 h-14 rounded-2xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0 text-xl font-bold text-primary">
            {displayName.charAt(0).toUpperCase()}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-primary ring-2 ring-surface-container flex items-center justify-center">
              <ShieldCheck className="w-2.5 h-2.5 text-on-primary" />
            </span>
          </div>

          <div className="flex flex-col min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href={`/freelancers/${profile.id}`}
                className="text-base font-bold text-on-surface hover:text-primary transition-colors capitalize truncate"
              >
                {displayName.replace('.', ' ')}
              </Link>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-[11px] font-mono text-primary border border-outline-variant/30">
                <ShieldCheck className="w-3 h-3" />
                KYC Verified
              </span>
            </div>

            <h4 className="text-sm font-semibold text-on-surface-variant mt-0.5">
              {profile.title || 'Fullstack Software Engineer'}
            </h4>

            <div className="flex items-center gap-2 text-xs text-on-surface-variant mt-1.5">
              <span className="flex items-center gap-0.5 text-primary font-bold">
                <Star className="w-3.5 h-3.5 fill-primary text-primary" />
                {rating.toFixed(1)}
              </span>
              <span>({totalReviews} reviews)</span>
              <span>•</span>
              <span className="text-secondary font-medium">Top Rated</span>
            </div>
          </div>
        </div>

        {/* Rate & Availability */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto shrink-0">
          <div className="text-xl font-bold text-on-surface font-mono">
            {formatCurrency(hourlyRate)}{' '}
            <span className="text-xs text-on-surface-variant font-normal">/hr</span>
          </div>
          <span className="text-xs font-mono text-primary flex items-center gap-1 mt-1 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Available Now
          </span>
        </div>
      </div>

      {/* Bio Snippet */}
      <p className="text-sm text-on-surface-variant leading-relaxed line-clamp-2">
        {profile.description || 'Experienced developer specialized in building performant, production-ready solutions.'}
      </p>

      {/* Metrics Tray */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 p-3 rounded-xl bg-surface-container-lowest border border-outline-variant/20">
        <div className="flex flex-col">
          <span className="text-[11px] text-on-surface-variant font-mono">Total Earned</span>
          <span className="text-sm font-bold text-on-surface font-mono">{formatCurrency(earned)}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-on-surface-variant font-mono">Job Success</span>
          <span className="text-sm font-bold text-primary font-mono">{success}%</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[11px] text-on-surface-variant font-mono">Completed</span>
          <span className="text-sm font-bold text-on-surface font-mono">{projects} Contracts</span>
        </div>
      </div>

      {/* Skills & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap gap-1.5">
          {profile.skills.slice(0, 5).map((s) => (
            <span
              key={s}
              className="px-2.5 py-1 rounded-lg bg-surface-container-high text-xs font-mono text-on-surface-variant border border-outline-variant/20"
            >
              {s}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/freelancers/${profile.id}`}>
            <Button variant="ghost" size="sm">
              View Profile
            </Button>
          </Link>
          <Link href={`/freelancers/${profile.id}`}>
            <Button variant="primary" size="sm" className="shadow-sm">
              <Zap className="w-3.5 h-3.5 mr-1" />
              <span>Hire Talent</span>
            </Button>
          </Link>
        </div>
      </div>
    </article>
  );
}
