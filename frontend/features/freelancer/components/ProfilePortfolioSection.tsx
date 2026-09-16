'use client';

import React from 'react';
import Link from 'next/link';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Image as ImageIcon,
  Edit2,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';
import { freelancerApi } from '../api/freelancerApi';
import { PortfolioItem } from '@/features/talent/types/talentTypes';

interface ProfilePortfolioSectionProps {
  portfolioItems: PortfolioItem[];
  onRefresh: () => void;
}

export const ProfilePortfolioSection: React.FC<ProfilePortfolioSectionProps> = ({
  portfolioItems = [],
  onRefresh,
}) => {
  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await freelancerApi.deletePortfolioItem(id);
      toast.success('Portfolio project deleted.');
      onRefresh();
    } catch {
      toast.error('Failed to delete portfolio project.');
    }
  };

  return (
    <section id="portfolio" className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Portfolio Projects</h3>
            <p className="text-xs text-on-surface-variant">
              Showcase completed apps, designs, and case studies with ordered screenshots and links
            </p>
          </div>
        </div>

        <Link
          href="/freelancer/profile/portfolio/new"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-container text-on-primary text-xs font-bold shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Project</span>
        </Link>
      </div>

      {/* Projects List */}
      {portfolioItems.length === 0 ? (
        <div className="py-10 px-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant/40 mb-1">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-on-surface">No Portfolio Projects Yet</h4>
          <p className="text-[11px] text-on-surface-variant max-w-sm">
            Adding projects increases your profile strength and helps clients evaluate your engineering and design expertise.
          </p>
          <Link
            href="/freelancer/profile/portfolio/new"
            className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1.5 rounded-lg bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant/40 text-xs font-semibold text-primary transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add First Project</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolioItems.map((item) => {
            const projectImg = item.images?.[0]?.imageUrl;
            const projectDesc = item.details || item.description || '';
            const projectLink = item.liveLink || item.projectUrl;
            const imageCount = item.images?.length || 0;

            return (
              <div
                key={item.id}
                className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between gap-3 group hover:border-primary/40 transition-colors"
              >
                <div>
                  {projectImg ? (
                    <div className="relative w-full h-40 rounded-lg bg-surface-container-high overflow-hidden mb-3 border border-outline-variant/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={projectImg}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {imageCount > 1 && (
                        <span className="absolute bottom-2 right-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Layers className="w-3 h-3 text-primary" />
                          <span>{imageCount} screenshots</span>
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant/40 mb-3">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-sm font-bold text-on-surface line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-on-surface-variant line-clamp-2 mt-1 leading-relaxed">
                    {projectDesc}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-outline-variant/20">
                  {projectLink ? (
                    <a
                      href={projectLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Live Demo</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-on-surface-variant/50">Internal project</span>
                  )}

                  <div className="flex items-center gap-1">
                    <Link
                      href={`/freelancer/profile/portfolio/${item.id}`}
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors cursor-pointer"
                      title="Edit project & rearrange screenshots"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id, item.title)}
                      aria-label="Delete project"
                      className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                      title="Delete project"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
