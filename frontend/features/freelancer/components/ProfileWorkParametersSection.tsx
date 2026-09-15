'use client';

import React from 'react';
import { toast } from 'sonner';

interface ProfileWorkParametersSectionProps {
  hourlyRate: number;
  onHourlyRateChange: (val: number) => void;
  onSave: () => void;
  isSaving?: boolean;
}

export const ProfileWorkParametersSection: React.FC<ProfileWorkParametersSectionProps> = ({
  hourlyRate,
  onHourlyRateChange,
  onSave,
  isSaving,
}) => {
  return (
    <div className="flex flex-col gap-5">
      {/* Developer Verifications */}
      <section className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center gap-2.5 pb-2 border-b border-outline-variant/20">
          <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
            <span className="material-symbols-outlined text-[18px]">terminal</span>
          </div>
          <h2 className="text-base font-bold text-on-surface">Connected Accounts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">code</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface block">GitHub Account</span>
                  <span className="text-xs text-primary font-medium">@alexrivera</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] text-primary font-semibold">Connected</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-container flex items-center justify-between text-xs">
              <span className="text-on-surface-variant text-[11px]">Repository Sync</span>
              <span className="text-primary font-bold text-[11px]">Verified Active</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/20 flex flex-col justify-between gap-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <span className="text-xs font-semibold text-on-surface block">Email Notifications</span>
                  <span className="text-xs text-on-surface font-medium">alex@marketplace.com</span>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded bg-surface-container-high text-[10px] text-primary font-semibold">Active</span>
            </div>
            <div className="p-2 rounded-lg bg-surface-container flex items-center justify-between text-xs">
              <span className="text-on-surface-variant text-[11px]">Job &amp; Milestone Alerts</span>
              <span className="text-on-surface text-[11px]">Instant Notification</span>
            </div>
          </div>
        </div>
      </section>

      {/* Work Parameters & Rates */}
      <section className="p-5 rounded-xl bg-surface-container border border-outline-variant/30 flex flex-col gap-4 shadow-sm">
        <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[18px]">payments</span>
            </div>
            <h2 className="text-base font-bold text-on-surface">Rates &amp; Availability</h2>
          </div>
          <span className="text-xs text-primary bg-surface-container px-2.5 py-0.5 rounded font-semibold">Available for Hire</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Hourly Rate</label>
            <div className="flex items-center px-3 py-2 rounded-xl bg-surface-container-low border border-outline-variant/30">
              <span className=" text-primary font-bold text-sm mr-2">৳</span>
              <input
                type="number"
                value={hourlyRate || ''}
                onChange={(e) => onHourlyRateChange(Number(e.target.value))}
                className="w-full bg-transparent  text-xs text-on-surface font-bold focus:outline-none"
              />
              <span className="text-[11px] text-on-surface-variant">BDT / hr</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-on-surface">Preferred Payout Currencies</label>
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface flex items-center gap-1 border border-outline-variant/20 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" /> BDT (৳ - Bangladeshi Taka)
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-6 z-40 p-4 rounded-2xl bg-surface-container-high border border-outline-variant/40 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => toast.info('Changes discarded')} className="px-3.5 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface-variant hover:text-on-surface text-xs font-semibold transition-colors">
            Discard
          </button>
          <button type="button" disabled={isSaving} onClick={onSave} className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container text-on-primary text-xs font-bold flex items-center gap-1.5 shadow-md transition-all">
            <span className="material-symbols-outlined text-[16px]">save</span>
            <span>{isSaving ? 'Saving...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

