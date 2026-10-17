'use client';

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminSettingsApi } from '@/lib/api/adminApi';
import { Percent, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function PlatformFeeSetting() {
  const [fee, setFee] = useState<number>(10);
  const [isSaving, setIsSaving] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-platform-fee'],
    queryFn: () => adminSettingsApi.getPlatformFee(),
  });

  useEffect(() => {
    if (data?.platformFeePercentage !== undefined) {
      setFee(data.platformFeePercentage);
    }
  }, [data]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fee < 0 || fee > 30) return toast.error('Fee must be between 0% and 30%');

    setIsSaving(true);
    try {
      await adminSettingsApi.updatePlatformFee(fee);
      toast.success(`Platform fee successfully updated to ${fee}%`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to update platform fee');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-2xs">
      <div className="flex items-center gap-2 border-b border-outline-variant pb-3 mb-5 text-primary">
        <Percent className="h-5 w-5" />
        <h2 className="text-base font-bold text-on-surface">Platform Commission Structure</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-4 max-w-xl">
        <p className="text-xs text-on-surface-variant leading-relaxed">
          The global commission percentage automatically deducted from the freelancer&apos;s escrow payment upon contract milestone release.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4 bg-surface-container-low p-4 rounded-xl border border-outline-variant/60">
          <div className="flex-1">
            <div className="flex justify-between text-xs font-semibold mb-2">
              <span className="text-on-surface-variant">Platform Fee:</span>
              <span className="text-primary font-bold text-sm">{fee.toFixed(1)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="25"
              step="0.5"
              value={fee}
              onChange={(e) => setFee(Number(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
          </div>
          <button
            type="submit"
            disabled={isSaving || isLoading}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-white text-xs font-bold shadow-2xs cursor-pointer disabled:opacity-50 transition-colors shrink-0"
          >
            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>Update Fee</span>
          </button>
        </div>
      </form>
    </div>
  );
}
