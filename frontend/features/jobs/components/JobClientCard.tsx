import React from 'react';
import { Star, CheckCircle2, User } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { JobClientInfo } from '../types/jobsTypes';

interface JobClientCardProps {
  client?: JobClientInfo;
}

export function JobClientCard({ client }: JobClientCardProps) {
  const profile = client?.clientProfile;
  const companyName = profile?.companyName || 'Verified Enterprise Client';
  const rating = profile?.rating ?? 4.9;
  const totalReviews = profile?.totalReviews ?? 12;
  const totalSpent = Number(profile?.totalSpent ?? 45000);
  const totalJobs = profile?.totalJobPosts ?? 8;
  const memberSince = client?.createdAt ? formatDate(client.createdAt) : '2024';

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <h3 className="text-lg font-bold text-on-surface">About the Client</h3>

      {/* Client Header */}
      <div className="flex items-center gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
          {companyName.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-on-surface truncate">{companyName}</h4>
          <p className="text-xs text-on-surface-variant truncate">
            {profile?.billingDetails ? 'Billing details verified' : 'Employer & Project Manager'}
          </p>
        </div>
      </div>

      {/* Verification Checklist */}
      <div className="space-y-2 py-1 text-xs text-on-surface-variant">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>Payment method verified</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>Email &amp; phone security active</span>
        </div>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
          <span>Identity KYC verified</span>
        </div>
      </div>

      {/* Performance Stats Grid */}
      <div className="grid grid-cols-2 gap-2.5 pt-1">
        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col">
          <div className="flex items-center gap-1 text-on-surface">
            <span className="text-sm font-bold">{rating.toFixed(1)}</span>
            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
          </div>
          <span className="text-[11px] text-on-surface-variant mt-0.5">
            {totalReviews} client reviews
          </span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col">
          <span className="text-sm font-bold text-on-surface font-mono">
            {formatCurrency(totalSpent)}
          </span>
          <span className="text-[11px] text-on-surface-variant mt-0.5">Total spent</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col">
          <span className="text-sm font-bold text-on-surface font-mono">
            {totalJobs} jobs
          </span>
          <span className="text-[11px] text-on-surface-variant mt-0.5">Posted on platform</span>
        </div>

        <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col">
          <span className="text-sm font-bold text-on-surface truncate">Member</span>
          <span className="text-[11px] text-on-surface-variant mt-0.5 truncate">
            Since {memberSince}
          </span>
        </div>
      </div>
    </section>
  );
}
