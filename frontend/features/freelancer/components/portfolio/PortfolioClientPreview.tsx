'use client';

import React, { useState } from 'react';
import { Eye, CheckCircle2, ExternalLink, AlertCircle, Edit3, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PortfolioImageItem } from '../../schemas/portfolioSchema';

interface PortfolioClientPreviewProps {
  title: string;
  details: string;
  liveLink?: string;
  images: PortfolioImageItem[];
  onReturnToEditor: () => void;
}

export const PortfolioClientPreview: React.FC<PortfolioClientPreviewProps> = ({
  title,
  details,
  liveLink,
  images,
  onReturnToEditor,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentImage = images[activeIndex]?.imageUrl || images[0]?.imageUrl;
  const currentSubtitle = images[activeIndex]?.subtitle;

  return (
    <div className="flex flex-col gap-6">
      <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30 flex flex-col gap-4">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            <h2 className="text-base font-bold text-on-surface">Client View Simulation</h2>
          </div>
          <span className="text-xs text-on-surface-variant">How your showcase appears on public profiles</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-surface-container-low rounded-2xl p-6 border border-outline-variant/30">
          <div className="md:col-span-7 flex flex-col gap-3">
            {images.length > 0 ? (
              <>
                <div className="relative w-full h-72 sm:h-80 bg-surface-container-high rounded-xl overflow-hidden border border-outline-variant/30 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={currentImage} alt="Preview" className="w-full h-full object-cover" />
                  {currentSubtitle && (
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 backdrop-blur-xs p-2.5 text-xs text-on-surface text-center">
                      {currentSubtitle}
                    </div>
                  )}
                  <span className="absolute top-2.5 left-2.5 bg-black/70 text-white text-[11px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs">
                    {activeIndex + 1} / {images.length}
                  </span>
                </div>
                {images.length > 1 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1">
                    {images.map((img, idx) => (
                      <button key={img.id} type="button" onClick={() => setActiveIndex(idx)} className={`relative w-16 h-12 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${activeIndex === idx ? 'border-primary ring-2 ring-primary/40 scale-105' : 'border-outline-variant/40 opacity-60'}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.imageUrl} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-64 bg-surface-container-high rounded-xl flex flex-col items-center justify-center text-on-surface-variant/50 gap-2 border border-dashed border-outline-variant/30">
                <ImageIcon className="w-10 h-10" />
                <span className="text-xs">No project screenshots attached</span>
              </div>
            )}
          </div>

          <div className="md:col-span-5 flex flex-col justify-between gap-4">
            <div className="flex flex-col gap-3">
              <span className="inline-flex items-center gap-1 text-xs text-primary font-bold bg-primary/10 px-2.5 py-0.5 rounded-full w-fit">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Deliverable
              </span>
              <h3 className="text-lg font-bold text-on-surface">{title || 'Untitled Portfolio Project'}</h3>
              <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed whitespace-pre-line">{details || 'No project description provided yet.'}</p>
            </div>

            {liveLink ? (
              <a href={liveLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs hover:bg-primary-container transition-colors shadow-md">
                <ExternalLink className="w-4 h-4" />
                <span>Visit Live Application</span>
              </a>
            ) : (
              <div className="flex items-center gap-1.5 text-xs text-on-surface-variant/60">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Internal / Private deployment</span>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onReturnToEditor}>
            <Edit3 className="w-3.5 h-3.5 mr-1" />
            <span>Return to Editor</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
