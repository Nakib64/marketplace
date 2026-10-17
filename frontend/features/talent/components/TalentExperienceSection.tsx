'use client';

import React from 'react';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentExperienceSectionProps {
  profile: FreelancerProfile;
}

export function TalentExperienceSection({ profile }: TalentExperienceSectionProps) {
  const workHistories = profile.user?.workHistories || [];

  if (workHistories.length === 0) return null;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Briefcase className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">Work Experience &amp; History</h2>
        </div>
        <span className="text-xs text-primary bg-surface-container-high px-2.5 py-1 rounded-full border border-primary/20">
          {workHistories.length} Roles
        </span>
      </div>

      <div className="space-y-4">
        {workHistories.map((work) => {
          const startStr = work.startDate
            ? new Date(work.startDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })
            : '';
          const endStr = work.isCurrent
            ? 'Present'
            : work.endDate
              ? new Date(work.endDate).toLocaleDateString('en-US', {
                  month: 'short',
                  year: 'numeric',
                })
              : 'Present';

          return (
            <article
              key={work.id}
              className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 flex flex-col gap-2.5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <h3 className="text-sm font-bold text-on-surface">
                    {work.title || work.position}
                  </h3>
                  <p className="text-xs text-primary font-medium">{work.company}</p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-on-surface-variant font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-outline" />
                    {startStr} – {endStr}
                  </span>
                  {work.location && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary" />
                      {work.location}
                    </span>
                  )}
                </div>
              </div>

              {work.description && (
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  {work.description}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
