import React from 'react';
import { Layers, CheckCircle2, ExternalLink } from 'lucide-react';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentPortfolioSectionProps {
  profile: FreelancerProfile;
}

export function TalentPortfolioSection({ profile }: TalentPortfolioSectionProps) {
  const items = profile.portfolioItems || [];

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div>
          <h2 className="text-xl font-bold text-on-surface">Verified Work &amp; Projects</h2>
        </div>
        <span className="text-xs text-primary bg-surface-container-high px-2.5 py-1 rounded-full border border-primary/20">
          {items.length} Projects
        </span>
      </div>

      {items.length === 0 ? (
        <div className="p-8 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col items-center justify-center text-center gap-2">
          <Layers className="w-8 h-8 text-on-surface-variant/40" />
          <h3 className="text-sm font-bold text-on-surface">No Portfolio Projects Added Yet</h3>
          <p className="text-xs text-on-surface-variant max-w-sm">
            This freelancer has not published portfolio deliverables yet. You can message them directly to discuss previous experience.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <article
              key={item.id}
              className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 hover:border-primary/40 transition-colors flex flex-col gap-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-surface-container-high text-primary">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-on-surface">{item.title}</h3>
                    <span className="text-xs text-on-surface-variant">Verified Project</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <span className="text-xs text-primary flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-on-surface-variant leading-relaxed">{item.description}</p>
              )}

              {item.projectUrl && (
                <div className="pt-2 border-t border-outline-variant/10 text-xs">
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-primary hover:underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View Project</span>
                  </a>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
