import React from 'react';
import { Terminal, CheckCircle2, Award } from 'lucide-react';
import { Job } from '../types/jobsTypes';

interface JobScopeCardProps {
  job: Job;
}

export function JobScopeCard({ job }: JobScopeCardProps) {
  // Split description paragraphs
  const paragraphs = job.description
    ? job.description.split('\n\n').filter(Boolean)
    : ['No detailed description provided.'];

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6">
      {/* Project Overview */}
      <div>
        <h2 className="text-xl font-bold text-on-surface mb-3 flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          Project Overview
        </h2>
        <div className="text-on-surface-variant text-base leading-relaxed space-y-4">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </div>

      {/* Required Skills & Stack */}
      {job.skills && job.skills.length > 0 && (
        <div className="pt-2">
          <h3 className="text-sm font-semibold text-on-surface mb-3">
            Required Technical Skills
          </h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1.5 rounded-lg bg-surface-container-high text-on-surface text-xs font-mono border border-outline-variant/30 hover:border-primary/50 transition-colors"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Quality & Deliverable Expectations */}
      <div className="pt-2 border-t border-outline-variant/20">
        <h3 className="text-sm font-semibold text-on-surface mb-3 flex items-center gap-2">
          <Award className="w-4 h-4 text-primary" />
          Core Deliverable Expectations
        </h3>
        <ul className="space-y-2.5 text-sm text-on-surface-variant">
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>Adhere strictly to agreed milestones and progress communication cadence.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>Provide high quality, documented, and tested production-ready deliverables.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>All code repositories, digital assets, and IP transfer upon escrow milestone release.</span>
          </li>
        </ul>
      </div>
    </section>
  );
}
