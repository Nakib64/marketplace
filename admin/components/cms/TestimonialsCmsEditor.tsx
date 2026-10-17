'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCmsApi } from '@/lib/api/adminApi';
import { HomepageCmsConfig } from '@/types/adminTypes';
import { MessageSquare, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { CmsSubNav } from './CmsSubNav';
import { toast } from 'sonner';

export function TestimonialsCmsEditor() {
  const queryClient = useQueryClient();
  const [testimonials, setTestimonials] = useState<
    Array<{ author: string; role: string; badge: string; quote: string; stat: string; statLabel: string; avatar: string }>
  >([]);

  const { data: cmsData, isLoading } = useQuery<HomepageCmsConfig>({
    queryKey: ['admin-homepage-cms'],
    queryFn: () => adminCmsApi.getHomepage(),
  });

  useEffect(() => {
    if (cmsData) {
      setTestimonials(Array.isArray(cmsData.testimonials) ? cmsData.testimonials : []);
    }
  }, [cmsData]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<HomepageCmsConfig>) => adminCmsApi.updateHomepage(payload),
    onSuccess: () => {
      toast.success('Customer stories & testimonials published.');
      queryClient.invalidateQueries({ queryKey: ['admin-homepage-cms'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update customer stories.');
    },
  });

  const handleTestimonialChange = (index: number, field: string, val: string) => {
    const updated = [...testimonials];
    updated[index] = { ...updated[index], [field]: val };
    setTestimonials(updated);
  };

  const handleAddStory = () => {
    setTestimonials([
      ...testimonials,
      {
        author: 'Verified User',
        role: 'Tech Lead / Consultant',
        badge: 'Verified Client',
        quote: 'Working with talent on Banglance has accelerated our product delivery without escrow friction.',
        stat: '৳1.2M',
        statLabel: 'Protected',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
      },
    ]);
  };

  const handleRemoveStory = (index: number) => {
    setTestimonials(testimonials.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ testimonials });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Customer Stories &amp; Testimonials</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage feedback quotes, author roles, badges, verification status, and highlighted payout statistics.
          </p>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Publish Stories</span>
        </button>
      </div>

      <CmsSubNav />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading customer stories...</span>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Verified Customer Feedback</h3>
              <p className="text-xs text-outline mt-0.5">Edit customer details and their featured statements.</p>
            </div>
            <button
              type="button"
              onClick={handleAddStory}
              className="px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Story</span>
            </button>
          </div>

          <div className="space-y-4">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-outline-variant bg-[#f9faf9] space-y-3 relative"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-outline">Customer Story #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveStory(idx)}
                    className="text-outline hover:text-red-600 cursor-pointer p-1"
                    title="Remove Story"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Author Name</label>
                    <input
                      type="text"
                      value={t.author}
                      onChange={(e) => handleTestimonialChange(idx, 'author', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Role &amp; Company</label>
                    <input
                      type="text"
                      value={t.role}
                      onChange={(e) => handleTestimonialChange(idx, 'role', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Badge Tag</label>
                    <input
                      type="text"
                      value={t.badge}
                      onChange={(e) => handleTestimonialChange(idx, 'badge', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Quote</label>
                  <textarea
                    rows={3}
                    value={t.quote}
                    onChange={(e) => handleTestimonialChange(idx, 'quote', e.target.value)}
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface resize-none leading-relaxed"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Highlight Stat (৳)</label>
                    <input
                      type="text"
                      value={t.stat}
                      onChange={(e) => handleTestimonialChange(idx, 'stat', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-primary font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Stat Label</label>
                    <input
                      type="text"
                      value={t.statLabel}
                      onChange={(e) => handleTestimonialChange(idx, 'statLabel', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Avatar Image URL</label>
                    <input
                      type="text"
                      value={t.avatar}
                      onChange={(e) => handleTestimonialChange(idx, 'avatar', e.target.value)}
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
