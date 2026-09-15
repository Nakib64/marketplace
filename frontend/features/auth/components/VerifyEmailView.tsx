'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  MailCheck,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  RotateCw,
  KeyRound,
  Lock,
  Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthActions } from '../hooks/useAuthActions';
import { useAuthStore } from '@/stores/useAuthStore';

export function VerifyEmailView() {
  const searchParams = useSearchParams();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { verifyEmail, isVerifying, resendVerification, isResending } = useAuthActions();

  const isVerified = user?.isEmailVerified;

  const urlEmail = searchParams?.get('email') || '';
  const urlCode = searchParams?.get('code') || '';

  const [email, setEmail] = useState<string>(urlEmail || user?.email || '');
  const [code, setCode] = useState<string>(urlCode.toUpperCase());
  const [cooldown, setCooldown] = useState<number>(0);

  // Sync state if search params or user loads later
  useEffect(() => {
    if (urlEmail && !email) {
      setEmail(urlEmail);
    } else if (user?.email && !email) {
      setEmail(user.email);
    }
    if (urlCode && !code) {
      setCode(urlCode.toUpperCase());
    }
  }, [urlEmail, urlCode, user?.email]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleVerify = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) return;

    verifyEmail({
      email: email.trim().toLowerCase() || undefined,
      code: cleanCode,
    });
  };

  const handleResend = () => {
    if (cooldown > 0 || isResending) return;
    const targetEmail = email.trim().toLowerCase() || user?.email;
    resendVerification(targetEmail ? { email: targetEmail } : undefined);
    setCooldown(60); // 60s cooldown
  };

  return (
    <div className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/50 p-6 md:p-8 shadow-xl text-center space-y-6">
      {/* Status Icon */}
      <div
        className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center border ${
          isVerified
            ? 'bg-primary/10 border-primary/30 text-primary'
            : 'bg-primary-container/20 border-primary-container/40 text-primary'
        }`}
      >
        {isVerified ? <CheckCircle2 className="w-7 h-7" /> : <MailCheck className="w-7 h-7" />}
      </div>

      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-on-surface">
          {isVerified ? 'Email Verified' : 'Verify Your Email Address'}
        </h1>
        <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
          {isVerified
            ? 'Your account is fully verified for projects, payments, and proposals.'
            : (email || user?.email)
            ? `We sent a 6-character verification code to ${email || user?.email}.`
            : 'Enter your email and the 6-character code to verify your account.'}
        </p>
      </div>

      {isVerified ? (
        <div className="p-4 rounded-xl bg-surface-container-low border border-primary/30 flex items-center gap-3 text-left">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0" />
          <div>
            <div className="text-xs font-semibold text-on-surface">Account Verified</div>
            <div className="text-[11px] text-on-surface-variant">
              Escrow protection, bidding, and payouts are fully active.
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4 text-left">
          {/* Email input (editable if user not authenticated or overriding) */}
          {!isAuthenticated && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-primary" />
                <span>Account Email</span>
              </label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-10 text-xs"
              />
            </div>
          )}

          {/* 6-Character Alphanumeric Code Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-on-surface flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-primary" />
                <span>Verification Code</span>
              </label>
              <span className="text-[11px] text-on-surface-variant font-mono">6 characters</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. X8K2N9"
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                autoFocus
                required
                className="w-full h-12 text-center text-lg font-mono font-bold tracking-[0.35em] uppercase bg-surface-container-high border border-outline-variant rounded-xl text-on-surface placeholder:tracking-normal placeholder:font-normal placeholder:text-sm placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            isLoading={isVerifying}
            disabled={code.trim().length < 4 || isVerifying}
            className="w-full bg-primary hover:bg-primary-container text-surface font-semibold text-xs h-10 mt-2 cursor-pointer shadow-md"
          >
            Verify &amp; Activate Account
          </Button>

          {/* Resend Action with Cooldown Timer */}
          <div className="pt-1 flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={handleResend}
              disabled={cooldown > 0 || isResending}
              className="flex items-center gap-1.5 text-primary hover:underline font-medium disabled:opacity-50 disabled:no-underline cursor-pointer disabled:cursor-not-allowed transition-opacity"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
              <span>
                {cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : isResending
                  ? 'Sending...'
                  : 'Resend Verification Code'}
              </span>
            </button>
            <span className="text-[11px] text-on-surface-variant/70 flex items-center gap-1">
              <Lock className="w-3 h-3" /> Max 5 attempts
            </span>
          </div>
        </form>
      )}

      {/* Navigation Footer */}
      <div className="pt-3 border-t border-outline-variant/30 flex flex-col gap-2.5">
        <Link href={user?.role === 'CLIENT' ? '/client/jobs' : '/jobs'}>
          <Button variant="outline" className="w-full text-xs h-9">
            {isVerified ? 'Go to Dashboard' : 'Skip to Marketplace'}
          </Button>
        </Link>
        {!isAuthenticated && (
          <Link
            href="/login"
            className="text-xs text-primary hover:underline flex items-center justify-center gap-1 mt-1"
          >
            <span>Sign into your account</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
