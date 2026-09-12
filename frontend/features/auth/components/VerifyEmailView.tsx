'use client';

import React from 'react';
import Link from 'next/link';
import { MailCheck, ShieldCheck, ArrowRight, CheckCircle2, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useAuthActions } from '../hooks/useAuthActions';
import { useAuthStore } from '@/stores/useAuthStore';

export function VerifyEmailView() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { verifyEmail, isVerifying, resendVerification, isResending } = useAuthActions();

  const isVerified = user?.isEmailVerified;

  return (
    <div className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/50 p-6 md:p-8 shadow-xl text-center space-y-5">
      <div
        className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${
          isVerified
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-primary-container/20 border-primary-container/40 text-primary'
        }`}
      >
        {isVerified ? <CheckCircle2 className="w-7 h-7" /> : <MailCheck className="w-7 h-7" />}
      </div>

      <div>
        <h1 className="text-xl font-bold text-on-surface">
          {isVerified ? 'Email Verified' : 'Verify Your Email Address'}
        </h1>
        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
          {isVerified
            ? 'Your account is fully verified for escrow contracts, payouts, and job bidding.'
            : user?.email
            ? `Verification notice dispatched to ${user.email}. Confirm to activate full account capabilities.`
            : 'Verify your email to activate full escrow, bidding, and payout privileges.'}
        </p>
      </div>

      {isVerified ? (
        <div className="p-3.5 rounded-xl bg-surface-container-low border border-primary/30 flex items-center gap-2.5 text-left text-xs">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <span className="text-on-surface text-xs font-medium">
            Account verified &amp; ready for active work.
          </span>
        </div>
      ) : (
        <div className="space-y-3">
          <Button
            onClick={() => verifyEmail(user?.email ? { email: user.email } : undefined)}
            isLoading={isVerifying}
            className="w-full bg-primary hover:bg-primary-container text-surface font-semibold text-xs h-10"
          >
            Confirm &amp; Verify Account
          </Button>

          {isAuthenticated && (
            <button
              onClick={() => resendVerification(user?.email ? { email: user.email } : undefined)}
              disabled={isResending}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-primary hover:underline font-medium py-1 disabled:opacity-50 cursor-pointer"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>{isResending ? 'Resending...' : 'Resend Verification Link'}</span>
            </button>
          )}
        </div>
      )}

      <div className="pt-2 border-t border-outline-variant/30 flex flex-col gap-2">
        <Link href={user?.role === 'CLIENT' ? '/client/jobs' : '/jobs'}>
          <Button variant="outline" className="w-full text-xs h-9">
            {isVerified ? 'Go to Dashboard' : 'Skip to Marketplace'}
          </Button>
        </Link>
        {!isAuthenticated && (
          <Link
            href="/login"
            className="text-xs text-primary hover:underline flex items-center justify-center gap-1"
          >
            <span>Sign into your account</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
