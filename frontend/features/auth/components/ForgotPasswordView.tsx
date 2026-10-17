'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/authApi';
import { BrandThemeLogo } from '@/components/ui/BrandThemeLogo';

export function ForgotPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    const urlEmail = searchParams.get('email');
    const urlCode = searchParams.get('code');
    if (urlEmail) setEmail(urlEmail);
    if (urlCode) {
      setCode(urlCode.toUpperCase());
      setStep(2);
    }
  }, [searchParams]);

  const handleRequestCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      return toast.error('Please enter a valid email address');
    }

    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword({ email });
      toast.success(res.message || 'Password reset code sent. Check your inbox.');
      setStep(2);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to request reset code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code || code.length < 6) {
      return toast.error('Enter valid 6-character reset code');
    }
    if (!newPassword || newPassword.length < 8) {
      return toast.error('Password must be at least 8 characters long');
    }
    if (newPassword !== confirmPassword) {
      return toast.error('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({
        email,
        code: code.toUpperCase().trim(),
        newPassword,
      });
      toast.success(res.message || 'Password reset successfully!');
      setIsDone(true);
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to reset password. Check your code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header Banner */}
      <div className="relative bg-gradient-to-r from-[#14a800] to-[#108a00] text-white pt-8 pb-12 px-6 sm:px-8 text-center rounded-t-3xl md:rounded-tr-none">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {isDone ? 'Password Updated !' : step === 1 ? 'Reset Password' : 'Create New Password'}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-50/90 mt-1 font-normal">
          {isDone
            ? 'Your password has been changed successfully'
            : step === 1
            ? 'Enter your email to receive a 6-character reset code'
            : 'Enter the 6-character code and your new password'}
        </p>

        {/* Overlapping Floating Brand Circular Emblem */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 translate-y-1/2 z-10">
          <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white shadow-md border-2 border-emerald-100 flex items-center justify-center p-2.5 transition-transform hover:scale-105">
            <BrandThemeLogo className="w-9 h-9 sm:w-10 sm:h-10" />
          </div>
        </div>
      </div>

      {/* Form Body */}
      <div className="pt-12 pb-8 px-6 sm:px-10 flex-1 flex flex-col justify-between">
        {isDone ? (
          <div className="text-center py-8 space-y-4">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-50 text-[#14a800] flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">Password Changed Successfully</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Redirecting you to the sign in page in a moment...
            </p>
            <Link
              href="/login"
              className="inline-block mt-2 px-6 py-2.5 rounded-lg bg-[#14a800] hover:bg-[#108a00] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              Sign In Now
            </Link>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleRequestCode} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="reset-email">
                Account Email Address
              </label>
              <input
                id="reset-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
                autoFocus
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading || !email}
                className="w-full h-11 rounded-lg bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Sending Code...</span>
                  </>
                ) : (
                  <span>Send Reset Code</span>
                )}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-700">Verification Code</label>
                <span className="text-[11px] text-slate-400">6 characters</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. X8K2N9"
                  autoFocus
                  required
                  className="w-full h-11 px-3.5 text-center text-base font-bold tracking-[0.25em] uppercase rounded-lg border border-slate-200 text-slate-900 placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min. 8 characters"
                  required
                  className="w-full h-11 pl-3.5 pr-10 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isLoading || code.length < 6 || newPassword.length < 8}
                className="w-full h-11 rounded-lg bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Save New Password</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors pt-1 cursor-pointer font-medium"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Request another code</span>
              </button>
            </div>
          </form>
        )}

        {/* Bottom Prompts & Copyright */}
        <div className="pt-8">
          <div className="text-center text-xs text-slate-600">
            Remember your password ?{' '}
            <Link href="/login" className="font-semibold text-[#14a800] hover:underline">
              Sign in
            </Link>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-3">
            © 2026 Banglance
          </p>
        </div>
      </div>
    </div>
  );
}
