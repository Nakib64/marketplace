'use client';

import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  Image as ImageIcon,
  Loader2,
  X,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [liveLink, setLiveLink] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const openAddModal = () => {
    setEditingItem(null);
    setTitle('');
    setDetails('');
    setLiveLink('');
    setImageUrl('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem(item);
    setTitle(item.title);
    setDetails(item.details || item.description || '');
    setLiveLink(item.liveLink || item.projectUrl || '');
    setImageUrl(item.images?.[0]?.imageUrl || '');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const res = await freelancerApi.uploadImage(file, 'portfolio');
      const fullUrl = res.url.startsWith('http')
        ? res.url
        : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'}${res.url}`;
      setImageUrl(fullUrl);
      toast.success('Project image uploaded successfully!');
    } catch {
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !details.trim()) {
      toast.error('Please provide project title and description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const imagesPayload = imageUrl.trim() ? [{ imageUrl: imageUrl.trim() }] : [];

      if (editingItem) {
        await freelancerApi.updatePortfolioItem(editingItem.id, {
          title,
          details,
          liveLink: liveLink.trim() || undefined,
          images: imagesPayload,
        });
        toast.success('Portfolio project updated successfully!');
      } else {
        await freelancerApi.addPortfolioItem({
          title,
          details,
          liveLink: liveLink.trim() || undefined,
          images: imagesPayload,
        });
        toast.success('Portfolio project added successfully!');
      }

      setIsModalOpen(false);
      onRefresh();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      toast.error(errorObj.response?.data?.message || 'Failed to save portfolio project.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      await freelancerApi.deletePortfolioItem(id);
      toast.success('Portfolio project deleted.');
      onRefresh();
    } catch {
      toast.error('Failed to delete portfolio project.');
    }
  };

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-7 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <FolderGit2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-on-surface">Portfolio Projects</h3>
            <p className="text-xs text-on-surface-variant">Showcase completed apps, designs, and case studies with images and links</p>
          </div>
        </div>

        <Button onClick={openAddModal} variant="primary" size="sm" className="font-semibold">
          <Plus className="w-3.5 h-3.5 mr-1" />
          <span>Add Project</span>
        </Button>
      </div>

      {/* Projects List */}
      {portfolioItems.length === 0 ? (
        <div className="py-8 px-4 rounded-xl bg-surface-container-low border border-dashed border-outline-variant/40 flex flex-col items-center justify-center text-center gap-2">
          <ImageIcon className="w-8 h-8 text-on-surface-variant/40" />
          <h4 className="text-xs font-bold text-on-surface">No Portfolio Projects Yet</h4>
          <p className="text-[11px] text-on-surface-variant max-w-sm">
            Adding projects increases your profile strength by 20% and helps clients evaluate your technical expertise.
          </p>
          <Button onClick={openAddModal} variant="secondary" size="sm" className="mt-2">
            <Plus className="w-3.5 h-3.5 mr-1" />
            <span>Add First Project</span>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {portfolioItems.map((item) => {
            const projectImg = item.images?.[0]?.imageUrl;
            const projectDesc = item.details || item.description || '';
            const projectLink = item.liveLink || item.projectUrl;

            return (
              <div
                key={item.id}
                className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/30 flex flex-col justify-between gap-3 group hover:border-primary/40 transition-colors"
              >
                <div>
                  {projectImg ? (
                    <div className="w-full h-36 rounded-lg bg-surface-container-high overflow-hidden mb-3 border border-outline-variant/20">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={projectImg}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-24 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant/40 mb-3">
                      <ImageIcon className="w-6 h-6" />
                    </div>
                  )}

                  <h4 className="text-sm font-bold text-on-surface line-clamp-1">{item.title}</h4>
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
                      <span>Live Project</span>
                    </a>
                  ) : (
                    <span className="text-[11px] text-outline">No live URL</span>
                  )}

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      aria-label="Edit project"
                      className="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      aria-label="Delete project"
                      className="p-1.5 rounded-lg text-error/70 hover:text-error hover:bg-error/10 transition-colors"
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

      {/* Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-surface-container rounded-2xl p-6 border border-outline-variant/40 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
              <h3 className="text-base font-bold text-on-surface">
                {editingItem ? 'Edit Portfolio Project' : 'Add New Portfolio Project'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-on-surface-variant hover:text-on-surface"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 16 Marketplace & Escrow Platform"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Project Description &amp; Details *
                </label>
                <textarea
                  required
                  rows={3}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Describe your role, technologies used, and key accomplishments..."
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-on-surface-variant mb-1">
                  Live Project / Demo Link (Optional)
                </label>
                <input
                  type="url"
                  value={liveLink}
                  onChange={(e) => setLiveLink(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                />
              </div>

              {/* Image Upload & URL input */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-on-surface-variant">
                  Project Image / Screenshot
                </label>

                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://... or upload below"
                    className="flex-1 bg-surface-container-low border border-outline-variant/40 rounded-xl px-3.5 py-2 text-xs text-on-surface focus:outline-none focus:border-primary"
                  />
                  <label className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-surface-container-high border border-outline-variant/40 text-xs font-medium text-on-surface hover:bg-surface-container-highest cursor-pointer">
                    {isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    ) : (
                      <Upload className="w-4 h-4 text-primary" />
                    )}
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {imageUrl && (
                  <div className="w-full h-32 rounded-xl bg-surface-container-low border border-outline-variant/30 overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:bg-black"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-outline-variant/20">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>{editingItem ? 'Update Project' : 'Add Project'}</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
