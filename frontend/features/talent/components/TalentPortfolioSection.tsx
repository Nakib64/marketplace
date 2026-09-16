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
        <div className="p-8 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-2">
          <Layers className="w-8 h-8 text-on-surface-variant/40" />
          <h3 className="text-sm font-bold text-on-surface">No Portfolio Projects Added Yet</h3>
          <p className="text-xs text-on-surface-variant max-w-sm">
            This freelancer has not published portfolio deliverables yet. You can message them directly to discuss previous experience.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item) => {
            const projectImg = item.images?.[0]?.imageUrl;
            const projectDesc = item.details || item.description;
            const projectUrl = item.liveLink || item.projectUrl;

            return (
              <article
                key={item.id}
                className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 hover:border-primary/40 transition-colors flex flex-col justify-between gap-3 group"
              >
                <div>
                  {projectImg && (
                    <div className="w-full h-44 rounded-lg bg-surface-container-high overflow-hidden mb-3 border border-outline-variant/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={projectImg}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}

                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-on-surface line-clamp-1">{item.title}</h3>
                    <span className="text-[10px] text-primary flex items-center gap-1 font-semibold shrink-0 bg-primary/10 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </span>
                  </div>

                  {projectDesc && (
                    <p className="text-xs text-on-surface-variant leading-relaxed mt-2 line-clamp-3">
                      {projectDesc}
                    </p>
                  )}
                </div>

                {projectUrl && (
                  <div className="pt-2 border-t border-outline-variant/10 text-xs">
                    <a
                      href={projectUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Visit Live Project</span>
                    </a>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
