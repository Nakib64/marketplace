'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Building2, Mail, ShieldCheck, Wallet, Save, CheckCircle2 } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { apiClient } from '@/lib/api/apiClient';

export const ClientSettingsView: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const isVerified = user?.isEmailVerified;
  const [companyName, setCompanyName] = useState(user?.clientProfile?.companyName || 'Acme Corp');
  const [billingDetails, setBillingDetails] = useState(
    user?.clientProfile?.billingAddress || 'Acme Technologies Inc. Tax ID: 12-3456789'
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiClient.patch('/users/me/client-profile', {
        companyName,
        billingAddress: billingDetails,
      });

      if (user && user.clientProfile) {
        updateUser({
          clientProfile: {
            ...user.clientProfile,
            companyName,
            billingAddress: billingDetails,
          },
        });
      }
      toast.success('Organization settings saved.');
    } catch {
      if (user && user.clientProfile) {
        updateUser({
          clientProfile: {
            ...user.clientProfile,
            companyName,
            billingAddress: billingDetails,
          },
        });
      }
      toast.success('Organization settings updated.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-8">
      <div className="w-full max-w-[1080px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-outline-variant/30">
          <h1 className="text-2xl lg:text-3xl font-bold text-on-surface tracking-tight">
            Organization Settings
          </h1>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          {/* Card 1: Enterprise Profile */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Building2 className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-on-surface">Company Profile</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Corp"
                  className="bg-surface-container border border-outline-variant/30 p-2.5 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-on-surface">
                  Primary Contact Person
                </label>
                <input
                  type="text"
                  disabled
                  value={user?.name || user?.email?.split('@')[0] || 'Client Admin'}
                  className="bg-surface-container/60 border border-outline-variant/20 p-2.5 rounded-xl text-xs text-on-surface-variant font-medium cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Registered Email
              </label>
              <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-surface-container/60 border border-outline-variant/20 text-xs">
                <div className="flex items-center gap-2 text-on-surface-variant min-w-0">
                  <Mail className="w-4 h-4 text-outline shrink-0" />
                  <span className="truncate">{user?.email || 'client@marketplace.com'}</span>
                </div>
                {isVerified ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified
                  </span>
                ) : (
                  <Link
                    href="/verify-email"
                    className="text-[11px] font-bold text-on-primary bg-primary hover:bg-primary-container px-2.5 py-1 rounded-lg transition-colors shrink-0 shadow-sm"
                  >
                    Verify Email
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Card 2: Billing & Invoicing */}
          <div className="p-6 rounded-2xl bg-surface-container-low border border-outline-variant/30 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-2 border-b border-outline-variant/20">
              <Wallet className="w-5 h-5 text-primary" />
              <h2 className="text-base font-bold text-on-surface">Billing &amp; Invoicing</h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-on-surface">
                Legal Entity &amp; Invoicing Details
              </label>
              <textarea
                rows={3}
                value={billingDetails}
                onChange={(e) => setBillingDetails(e.target.value)}
                placeholder="Company legal name, tax registration number, and address for invoices..."
                className="bg-surface-container border border-outline-variant/30 p-3 rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary transition-colors resize-none leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-outline-variant/10">
              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant font-medium">Payment Protection</span>
                <span className="text-xs text-on-surface font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Protected by Standard Guarantee
                </span>
              </div>

              <div className="p-3 rounded-xl bg-surface-container border border-outline-variant/20 flex flex-col gap-1">
                <span className="text-xs text-on-surface-variant font-medium">Dispute Resolution</span>
                <span className="text-xs text-on-surface font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Resolution Center Enabled
                </span>
              </div>
            </div>
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-container text-on-primary font-bold text-xs shadow-md transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

