import React from 'react';
import { GitFork, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Job } from '../types/jobsTypes';

interface JobMilestonesCardProps {
  job: Job;
}

export function JobMilestonesCard({ job }: JobMilestonesCardProps) {
  const totalBudget = Number(job.budget) || 1000;
  const m1 = Math.round(totalBudget * 0.35);
  const m2 = Math.round(totalBudget * 0.40);
  const m3 = totalBudget - m1 - m2;

  const milestones = [
    {
      num: '01',
      title: 'Phase 1: Architecture & Foundations',
      desc: 'System design, requirements alignment, and baseline technical scaffold.',
      amount: m1,
      duration: 'Est. 7–10 days',
    },
    {
      num: '02',
      title: 'Phase 2: Core Feature Implementation',
      desc: 'Execution of main requirements, business logic, and test coverage.',
      amount: m2,
      duration: 'Est. 14–21 days',
    },
    {
      num: '03',
      title: 'Phase 3: Quality Assurance & Final Handoff',
      desc: 'Verification, documentation sign-off, and production deployment transfer.',
      amount: m3,
      duration: 'Est. 5–7 days',
    },
  ];

  return (
    <section className="bg-surface-container-low rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-on-surface flex items-center gap-2">
          <GitFork className="w-5 h-5 text-primary" />
          Escrow Milestones Roadmap
        </h2>
        <span className="text-xs font-mono text-on-surface-variant flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          3 Milestones Protected
        </span>
      </div>

      <div className="space-y-3">
        {milestones.map((m) => (
          <div
            key={m.num}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-surface-container border border-outline-variant/20 gap-3"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center font-mono text-xs text-on-surface font-semibold shrink-0">
                {m.num}
              </div>
              <div>
                <h4 className="text-sm font-semibold text-on-surface">{m.title}</h4>
                <p className="text-xs text-on-surface-variant mt-0.5">{m.desc}</p>
              </div>
            </div>
            <div className="flex items-center sm:flex-col sm:items-end justify-between shrink-0 pl-11 sm:pl-0">
              <span className="text-sm font-bold text-on-surface font-mono">
                {formatCurrency(m.amount)}
              </span>
              <span className="text-xs text-on-surface-variant">{m.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
