'use client';

import React, { useState } from 'react';
import { Layers, CheckCircle2, ExternalLink, ChevronLeft, ChevronRight, ImageIcon } from 'lucide-react';
import { FreelancerProfile, PortfolioItem } from '../types/talentTypes';

interface TalentPortfolioCardProps {
  item: PortfolioItem;
}

const TalentPortfolioCard: React.FC<TalentPortfolioCardProps> = ({ item }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const images = item.images || [];
  const currentImage = images[activeImageIndex]?.imageUrl || images[0]?.imageUrl;
  const currentSubtitle = images[activeImageIndex]?.subtitle;
  const projectDesc = item.details || item.description;
  const projectUrl = item.liveLink || item.projectUrl;

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  return (
    <article className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/20 hover:border-primary/40 transition-all flex flex-col justify-between gap-3 group shadow-xs">
      <div>
        {currentImage ? (
          <div className="relative w-full h-48 sm:h-52 rounded-lg bg-surface-container-high overflow-hidden mb-3 border border-outline-variant/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Image Subtitle / Caption overlay if provided */}
            {currentSubtitle && (
              <div className="absolute bottom-0 inset-x-0 bg-black/75 backdrop-blur-xs px-3 py-1.5 text-[11px] text-on-surface font-medium truncate">
                {currentSubtitle}
              </div>
            )}

            {/* Multiple images controls & dots */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer"
                  title="Previous screenshot"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/90 cursor-pointer"
                  title="Next screenshot"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dots indicator */}
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
                  <span className="text-[10px] text-white font-bold">
                    {activeImageIndex + 1}/{images.length}
                  </span>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="w-full h-24 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant/40 mb-3">
            <ImageIcon className="w-6 h-6" />
          </div>
        )}

        <div className="flex items-center justify-between gap-2">
          <h3 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
            {item.title}
          </h3>
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
};

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
          {items.map((item) => (
            <TalentPortfolioCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
