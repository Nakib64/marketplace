'use client';

import React, { useState } from 'react';
import { toast } from 'sonner';
import { contractsApi } from '../api/contractsApi';

interface DoubleBlindReviewModalProps {
  isOpen: boolean;
  contractId: string;
  counterPartyName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const DoubleBlindReviewModal: React.FC<DoubleBlindReviewModalProps> = ({
  isOpen,
  contractId,
  counterPartyName = 'counterparty',
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (feedback.trim().length < 10) {
      toast.error('Feedback must be at least 10 characters long.');
      return;
    }

    setIsSubmitting(true);
    try {
      await contractsApi.submitReview({
        contractId,
        rating,
        feedback: feedback.trim(),
      });
      toast.success('Double-blind review submitted! It will be published once both parties complete review.');
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to submit review. It may already be submitted.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-low border border-outline-variant/40 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 text-xs">
        <div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">verified</span>
            <h3 className="text-base font-bold text-on-surface">Double-Blind Review</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-on-surface-variant hover:text-on-surface p-1 rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="bg-surface-container p-3 rounded-lg border border-primary/20 flex items-start gap-2.5">
          <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">lock</span>
          <p className="text-[11px] text-on-surface-variant leading-relaxed">
            <strong className="text-on-surface font-semibold">Zero Retaliation Protection:</strong> Ratings remain sealed until both you and <span className="text-primary font-medium">{counterPartyName}</span> submit reviews, or until the 14-day review window concludes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5 items-center py-2">
            <span className="text-on-surface-variant text-[11px] font-semibold uppercase tracking-wider">Overall Rating</span>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-primary transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={`material-symbols-outlined text-[28px] ${isFilled ? 'fill-current' : 'text-outline-variant'}`}>
                      star
                    </span>
                  </button>
                );
              })}
            </div>
            <span className="text-xs  font-bold text-on-surface mt-0.5">
              {rating === 5 ? '5.0 — Outstanding Work' : `${rating}.0 / 5.0`}
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-on-surface text-[11px]">
              Verifiable Feedback &amp; Collaboration Notes (min. 10 chars)
            </label>
            <textarea
              required
              rows={4}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Detail communication speed, quality of code/specifications, deliverable precision, and professional collaboration..."
              className="w-full bg-surface-container border border-outline-variant/30 p-3 rounded-lg  text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary resize-y"
            />
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-surface-container hover:bg-surface-container-high text-on-surface font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || feedback.trim().length < 10}
              className="px-4 py-2 rounded-lg bg-primary hover:bg-primary-container disabled:opacity-50 text-on-primary font-bold shadow-md transition-all flex items-center gap-1.5"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Sealed Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
