'use client';

import React from 'react';
import Link from 'next/link';
import { Send, MessageSquare, ShieldCheck, Edit3 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { useAuthStore } from '@/stores/useAuthStore';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentSidebarOfferProps {
  profile: FreelancerProfile;
}

export function TalentSidebarOffer({ profile }: TalentSidebarOfferProps) {
  const { user, isAuthenticated } = useAuthStore();
  const isFreelancer = user?.role === 'FREELANCER';
  const isSelf = user?.id === profile.userId;
  const hourlyRate = profile.hourlyRate ? Number(profile.hourlyRate) : 500;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      {/* Rate Header */}
      <div className="flex items-baseline justify-between">
        <span className="text-xs  text-on-surface-variant uppercase tracking-wider">
          Hourly Rate
        </span>
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold text-on-surface  tracking-tight">
            {formatCurrency(hourlyRate)}
          </span>
          <span className="text-xs  text-on-surface-variant">/ hr</span>
        </div>
      </div>

      {/* Availability Metrics */}
      <div className="space-y-2.5 py-1 text-xs border-y border-outline-variant/20">
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Availability:</span>
          <span className="text-on-surface font-semibold">Full-time (&gt;30 hrs/wk)</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Start Date:</span>
          <span className="text-primary font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Immediate
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-on-surface-variant">Avg Turnaround:</span>
          <span className="text-on-surface font-semibold">&lt; 48 hrs per milestone</span>
        </div>
      </div>

      {/* Payment Protection Banner */}
      <div className="bg-surface-container-low rounded-xl p-3.5 border border-outline-variant/20 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
        <p className="text-xs text-on-surface-variant leading-relaxed">
          <strong className="text-on-surface font-semibold">Payment Protection:</strong> Funds are held securely in escrow holding vaults and released upon milestone sign-off.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        {isSelf ? (
          <Link href="/freelancer/profile/edit" className="w-full">
            <Button variant="primary" size="lg" className="w-full justify-center shadow-md font-semibold">
              <Edit3 className="w-4 h-4 mr-2" />
              <span>Edit My Profile &amp; Settings</span>
            </Button>
          </Link>
        ) : isFreelancer ? (
          <>
            <Link href={`/messages?user=${profile.userId}`} className="w-full">
              <Button variant="primary" size="lg" className="w-full justify-center shadow-md font-semibold">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Collaborate / Direct Message</span>
              </Button>
            </Link>
            <p className="text-[11px] text-center text-on-surface-variant/80">
              Only Client accounts can send contracts and hire talent.
            </p>
          </>
        ) : (
          <>
            <Link href={`/client/jobs/new?hire=${profile.id}`} className="w-full">
              <Button variant="primary" size="lg" className="w-full justify-center shadow-md font-semibold">
                <Send className="w-4 h-4 mr-2" />
                <span>Send Job Offer / Hire</span>
              </Button>
            </Link>

            <Link href={isAuthenticated ? `/messages?user=${profile.userId}` : '/login'} className="w-full">
              <Button variant="secondary" size="lg" className="w-full justify-center">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span>Direct Message</span>
              </Button>
            </Link>
          </>
        )}
      </div>
    </section>
  );
}
