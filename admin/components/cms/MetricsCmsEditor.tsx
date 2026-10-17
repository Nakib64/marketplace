'use client';

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminCmsApi } from '@/lib/api/adminApi';
import { HomepageCmsConfig } from '@/types/adminTypes';
import { BarChart3, Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { CmsSubNav } from './CmsSubNav';
import { toast } from 'sonner';

export function MetricsCmsEditor() {
  const queryClient = useQueryClient();
  const [metrics, setMetrics] = useState<Array<{ value: string; label: string; sub: string; color?: string }>>([]);

  const { data: cmsData, isLoading } = useQuery<HomepageCmsConfig>({
    queryKey: ['admin-homepage-cms'],
    queryFn: () => adminCmsApi.getHomepage(),
  });

  useEffect(() => {
    if (cmsData) {
      setMetrics(Array.isArray(cmsData.metrics) ? cmsData.metrics : []);
    }
  }, [cmsData]);

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<HomepageCmsConfig>) => adminCmsApi.updateHomepage(payload),
    onSuccess: () => {
      toast.success('Platform metrics updated successfully.');
      queryClient.invalidateQueries({ queryKey: ['admin-homepage-cms'] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update metrics.');
    },
  });

  const handleMetricChange = (index: number, field: string, val: string) => {
    const updated = [...metrics];
    updated[index] = { ...updated[index], [field]: val };
    setMetrics(updated);
  };

  const handleAddMetric = () => {
    setMetrics([...metrics, { value: '100%', label: 'Metric Title', sub: 'Short supporting description' }]);
  };

  const handleRemoveMetric = (index: number) => {
    setMetrics(metrics.filter((_, i) => i !== index));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate({ metrics });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-outline-variant shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold text-on-surface">Platform Metrics Configuration</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Manage the primary live statistics displayed in the trust and metrics ribbon on the homepage.
          </p>
        </div>

        <button
          type="submit"
          disabled={updateMutation.isPending || isLoading}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-[#108a00] text-white font-bold text-xs transition-colors shadow-xs cursor-pointer shrink-0 disabled:opacity-50"
        >
          {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          <span>Publish Metrics</span>
        </button>
      </div>

      <CmsSubNav />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl border border-outline-variant">
          <Loader2 className="h-8 w-8 text-primary animate-spin mb-3" />
          <span className="text-xs text-outline font-medium">Loading platform metrics...</span>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-outline-variant pb-3">
            <div>
              <h3 className="text-sm font-bold text-on-surface">Live Platform Metrics Cards</h3>
              <p className="text-xs text-outline mt-0.5">Edit statistic numbers, primary titles, and descriptive subtitles.</p>
            </div>
            <button
              type="button"
              onClick={handleAddMetric}
              className="px-3 py-1.5 rounded-xl border border-outline-variant hover:bg-surface-container text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Metric</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.map((m, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-outline-variant bg-[#f9faf9] space-y-3 relative group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-outline">Metric Item #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="text-outline hover:text-red-600 cursor-pointer p-1"
                    title="Remove Metric"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Statistic Display</label>
                    <input
                      type="text"
                      value={m.value}
                      onChange={(e) => handleMetricChange(idx, 'value', e.target.value)}
                      placeholder="e.g. ৳50M+, 99.4%"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface font-black"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-outline mb-1">Title Label</label>
                    <input
                      type="text"
                      value={m.label}
                      onChange={(e) => handleMetricChange(idx, 'label', e.target.value)}
                      placeholder="e.g. Protected Payments"
                      className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-outline mb-1">Subtext Description</label>
                  <input
                    type="text"
                    value={m.sub}
                    onChange={(e) => handleMetricChange(idx, 'sub', e.target.value)}
                    placeholder="e.g. Completed projects"
                    className="w-full rounded-lg border border-outline-variant bg-white px-3 py-1.5 text-xs text-on-surface"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </form>
  );
}
