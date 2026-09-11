'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { Flag, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { jobsApi } from '../api/jobsApi';

interface ReportJobModalProps {
  jobId: string;
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_REASONS = [
  'Fraud, scam or phising attempt',
  'Requesting off-platform payment (crypto, bKash outside escrow)',
  'Misleading scope or deceptive budget',
  'Inappropriate, offensive, or infringing content',
  'Other violation',
];

export function ReportJobModal({ jobId, isOpen, onClose }: ReportJobModalProps) {
  const [reasonCategory, setReasonCategory] = useState(COMMON_REASONS[0]);
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalReason = details.trim()
      ? `${reasonCategory}: ${details.trim()}`
      : reasonCategory;

    if (finalReason.length < 5) {
      toast.error('Please provide a reason with at least 5 characters.');
      return;
    }

    try {
      setIsSubmitting(true);
      await jobsApi.reportJob(jobId, finalReason);
      toast.success('Thank you. The report has been flagged for trust & safety review.');
      setDetails('');
      onClose();
    } catch {
      toast.error('Unable to submit report. Please ensure you are logged in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Report Job Posting"
      description="Help us keep Banglance safe, compliant, and escrow-verified."
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1.5">
            Violation Reason
          </label>
          <select
            value={reasonCategory}
            onChange={(e) => setReasonCategory(e.target.value)}
            className="w-full bg-surface-container border border-outline-variant/40 rounded-xl px-3 py-2 text-sm text-on-surface focus:outline-none focus:border-primary"
          >
            {COMMON_REASONS.map((r) => (
              <option key={r} value={r} className="bg-surface-container text-on-surface">
                {r}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1.5">
            Additional Details (Optional)
          </label>
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            rows={3}
            maxLength={400}
            placeholder="Provide context or evidence to assist our moderators..."
            className="w-full bg-surface-container border border-outline-variant/40 rounded-xl p-3 text-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                Submitting...
              </>
            ) : (
              <>
                <Flag className="w-3.5 h-3.5 mr-1.5" />
                Submit Report
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
