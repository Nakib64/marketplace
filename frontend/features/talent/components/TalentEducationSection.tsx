'use client';

import React from 'react';
import { GraduationCap, Calendar } from 'lucide-react';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentEducationSectionProps {
  profile: FreelancerProfile;
}

export function TalentEducationSection({ profile }: TalentEducationSectionProps) {
  const educations = profile.educations || [];

  if (educations.length === 0) return null;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <GraduationCap className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">Education &amp; Academic Degrees</h2>
        </div>
        <span className="text-xs text-primary bg-surface-container-high px-2.5 py-1 rounded-full border border-primary/20">
          {educations.length} Degrees
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {educations.map((edu) => {
          const startYear = edu.startDate ? new Date(edu.startDate).getFullYear() : '';
          const endYear = edu.isCurrent
            ? 'Present'
            : edu.endDate
              ? new Date(edu.endDate).getFullYear()
              : 'Present';

          return (
            <article
              key={edu.id}
              className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 flex flex-col justify-between gap-2"
            >
              <div>
                <h3 className="text-sm font-bold text-on-surface">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5">{edu.institution}</p>
              </div>

              <div className="pt-2 border-t border-outline-variant/10 flex items-center justify-between text-xs text-outline font-medium">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {startYear} – {endYear}
                </span>
                {edu.isCurrent && (
                  <span className="text-[10px] text-primary font-sans font-semibold">Active Student</span>
                )}
              </div>

              {edu.description && (
                <p className="text-xs text-on-surface-variant leading-relaxed mt-1">
                  {edu.description}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
