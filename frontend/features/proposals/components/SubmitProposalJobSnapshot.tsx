import React from 'react';
import { Job } from '@/features/jobs/types/jobsTypes';

interface SubmitProposalJobSnapshotProps {
  job?: Job | null;
}

export const SubmitProposalJobSnapshot: React.FC<SubmitProposalJobSnapshotProps> = ({ job }) => {
  const title = job?.title || 'Full-Stack Web Application Development';
  const clientName = job?.client?.clientProfile?.companyName || job?.client?.email?.split('@')[0] || 'Kroma Labs';
  const budget = job?.budget ? Number(job.budget) : 8500;
  const description = job?.description || 'Build and deploy a responsive web application with clean API integrations, authentication, and automated testing.';
  const skills = job?.skills?.length ? job.skills : ['React', 'Next.js', 'TypeScript', 'Node.js', 'PostgreSQL'];

  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary font-bold text-lg border border-outline-variant/30 shadow-inner">
            {clientName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-base font-bold text-on-surface">{title}</span>
              <span className="material-symbols-outlined text-primary text-[16px]">verified</span>
            </div>
            <div className="flex items-center gap-2 text-on-surface-variant text-xs mt-0.5">
              <span>Client: <strong className="text-on-surface">{clientName}</strong></span>
              <span>•</span>
              <span>Posted recently</span>
              <span>•</span>
              <span className="text-primary font-medium">Payment Protected</span>
            </div>
          </div>
        </div>
        <div className="flex items-baseline gap-1.5 self-start sm:self-auto bg-surface-container px-3 py-1.5 rounded-lg border border-outline-variant/20">
          <span className="text-xs text-on-surface-variant">Target Budget:</span>
          <span className="text-base font-bold text-on-surface ">৳{budget.toLocaleString()}</span>
          <span className=" text-xs text-on-surface-variant">BDT</span>
        </div>
      </div>

      <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">{description}</p>

      <div className="flex flex-wrap items-center gap-1.5 mt-4 pt-3 border-t border-outline-variant/20">
        {skills.map((skill) => (
          <span key={skill} className="px-2.5 py-0.5 rounded-full bg-surface-container text-on-surface-variant  text-[11px] border border-outline-variant/20">
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};
