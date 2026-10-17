'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminAuthApi } from '@/lib/api/adminApi';
import { useAdminAuthStore } from '@/stores/useAdminAuthStore';
import { Eye, EyeOff, Loader2, ArrowLeft, KeyRound, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { BrandThemeLogo } from '@/components/ui/BrandThemeLogo';

export function AdminLoginForm() {
  const router = useRouter();
  const { setAdminAuth, setPreAuthToken, preAuthToken } = useAdminAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [totpCode, setTotpCode] = useState('');
  const [is2FAStep, setIs2FAStep] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Email and password required');

    setIsLoading(true);
    try {
      const res = await adminAuthApi.login({ email, password });
      if (res.requires2FA && res.preAuthToken) {
        setPreAuthToken(res.preAuthToken);
        setIs2FAStep(true);
        toast.info('Two-Factor Authentication code required');
      } else if (res.admin) {
        setAdminAuth(res.admin, res.accessToken);
        toast.success(`Welcome back, ${res.admin.name}`);
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOneClickAdminLogin = async (
    demoEmail = 'admin@marketplace.com',
    demoPassword = 'Admin@12345678!'
  ) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setIsLoading(true);
    try {
      const res = await adminAuthApi.login({ email: demoEmail, password: demoPassword });
      if (res.requires2FA && res.preAuthToken) {
        setPreAuthToken(res.preAuthToken);
        setIs2FAStep(true);
        toast.info('Two-Factor Authentication code required');
      } else if (res.admin) {
        setAdminAuth(res.admin, res.accessToken);
        toast.success(`Welcome back, ${res.admin.name}`);
        router.push('/dashboard');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Authentication failed. Check credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!totpCode || totpCode.length < 6) return toast.error('Enter valid 6-digit code');
    if (!preAuthToken) return toast.error('Session expired. Please log in again.');

    setIsLoading(true);
    try {
      const res = await adminAuthApi.verify2FA({ preAuthToken, token: totpCode });
      setAdminAuth(res.admin, (res as any).accessToken);
      toast.success(`2FA Verified. Welcome back, ${res.admin.name}`);
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid 2FA authentication code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header Banner */}
      <div className="relative bg-gradient-to-r from-[#14a800] to-[#108a00] text-white pt-8 pb-12 px-6 sm:px-8 text-center rounded-t-3xl md:rounded-tr-none">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          {is2FAStep ? 'Two-Factor Auth' : 'Welcome Back !'}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-50/90 mt-1 font-normal">
          {is2FAStep ? 'Enter 6-digit authenticator code' : 'Sign in to continue to Banglance Admin'}
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
        {!is2FAStep ? (
          <form onSubmit={handleInitialLogin} className="space-y-4">
            {/* Username / Staff Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="admin-email">
                Username
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Username or email"
                required
                className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
              />
            </div>

            {/* Master Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="admin-password">
                Password
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full h-11 pl-3.5 pr-10 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Controls Row: Toggle on left, Submit on right */}
            <div className="pt-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* Remember Me Pill Toggle */}
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={rememberMe}
                    onClick={() => setRememberMe(!rememberMe)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      rememberMe ? 'bg-[#14a800]' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        rememberMe ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs text-slate-600 font-medium">keep me logged in</span>
                </label>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full sm:w-auto sm:min-w-[130px] h-10 px-6 rounded-lg bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </button>
              </div>
            </div>

            {/* Quick Demo Logins Section for Admin */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Demo Credentials (1-Click Login)
                </span>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/60">
                  Super Admin
                </span>
              </div>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleOneClickAdminLogin('admin@marketplace.com', 'Admin@12345678!')}
                className="w-full group relative flex flex-col items-start p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all duration-150 text-left cursor-pointer hover:shadow-sm disabled:opacity-50"
              >
                <div className="flex items-center justify-between w-full mb-1">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-800 group-hover:text-emerald-700">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Super Admin Console
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    1-Click →
                  </span>
                </div>
                <p className="text-[11px] font-mono text-slate-700 font-medium truncate w-full">
                  admin@marketplace.com
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Pass: <span className="text-slate-600 font-semibold">Admin@12345678!</span>
                </p>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerify2FA} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 text-center">
                Security Token (TOTP)
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={totpCode}
                  onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoFocus
                  required
                  className="w-full h-12 text-center text-xl font-bold tracking-[0.35em] rounded-lg border border-slate-200 text-slate-900 placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || totpCode.length < 6}
              className="w-full h-11 rounded-lg bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-semibold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Verify & Login</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIs2FAStep(false)}
              className="w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors pt-1 cursor-pointer font-medium"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Credentials</span>
            </button>
          </form>
        )}

        {/* Bottom Prompts & Copyright */}
        <div className="pt-8">
          <div className="text-center text-xs text-slate-600">
            Protected System •{' '}
            <Link href="http://localhost:3000" className="font-semibold text-[#14a800] hover:underline">
              Marketplace
            </Link>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-3">
            © 2026 Banglance Admin Console
          </p>
        </div>
      </div>
    </div>
  );
}
