'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Zap, Building2, UserCheck, Sparkles } from 'lucide-react';
import { loginSchema, LoginFormData } from '../schemas/authSchema';
import { useAuthActions } from '../hooks/useAuthActions';
import { BrandThemeLogo } from '@/components/ui/BrandThemeLogo';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthActions();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  const remember = watch('remember');

  const onSubmit = (data: LoginFormData) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  const handleDemoLogin = (demoEmail: string, demoPassword: string) => {
    setValue('email', demoEmail, { shouldValidate: true });
    setValue('password', demoPassword, { shouldValidate: true });
    login({
      email: demoEmail,
      password: demoPassword,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Top Header Banner */}
      <div className="relative bg-gradient-to-r from-[#14a800] to-[#108a00] text-white pt-8 pb-12 px-6 sm:px-8 text-center rounded-t-3xl md:rounded-tr-none">
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
          Welcome Back !
        </h2>
        <p className="text-xs sm:text-sm text-emerald-50/90 mt-1 font-normal">
          Sign in to continue to Banglance
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
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username / Email Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="login-username">
              Username
            </label>
            <input
              id="login-username"
              type="text"
              placeholder="Username"
              className="w-full h-11 px-3.5 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
              {...register('email')}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1 font-medium">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5" htmlFor="login-password">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full h-11 pl-3.5 pr-10 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#14a800] focus:ring-1 focus:ring-[#14a800] transition-colors bg-white"
                {...register('password')}
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
            {errors.password && <p className="text-xs text-red-500 mt-1 font-medium">{errors.password.message}</p>}
          </div>

          {/* Controls Row: Toggle on left, Submit button on right (desktop) */}
          <div className="pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Remember Me Pill Toggle */}
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <button
                  type="button"
                  role="switch"
                  aria-checked={Boolean(remember)}
                  onClick={() => setValue('remember', !remember)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    remember ? 'bg-[#14a800]' : 'bg-slate-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      remember ? 'translate-x-4' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs text-slate-600 font-medium">keep me logged in</span>
              </label>

              {/* Login Button */}
              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full sm:w-auto sm:min-w-[130px] h-10 px-6 rounded-lg bg-[#14a800] hover:bg-[#108a00] text-white text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isLoggingIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <span>Login</span>
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="text-center sm:text-right mt-2.5">
              <Link
                href="/forgot-password"
                className="text-xs text-slate-400 hover:text-[#14a800] transition-colors cursor-pointer"
              >
                Forgot Password ?
              </Link>
            </div>
          </div>
        </form>

        {/* Demo Credentials Quick Access Section */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              Demo Credentials (1-Click Login)
            </span>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 font-semibold px-2 py-0.5 rounded-full border border-emerald-200/60">
              Instant Access
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Client Demo Account */}
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={() => handleDemoLogin('nafiz2282@gmail.com', 'Password@123')}
              className="group relative flex flex-col items-start p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all duration-150 text-left cursor-pointer hover:shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 group-hover:text-emerald-700">
                  <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                  Client Demo
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  1-Click →
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-700 font-medium truncate w-full">
                nafiz2282@gmail.com
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Pass: <span className="text-slate-600 font-semibold">Password@123</span>
              </p>
            </button>

            {/* Freelancer Demo Account */}
            <button
              type="button"
              disabled={isLoggingIn}
              onClick={() => handleDemoLogin('nafizuddowla01@gmail.com', 'Password@123')}
              className="group relative flex flex-col items-start p-2.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-emerald-50/60 hover:border-emerald-300 transition-all duration-150 text-left cursor-pointer hover:shadow-sm disabled:opacity-50"
            >
              <div className="flex items-center justify-between w-full mb-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-800 group-hover:text-emerald-700">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Freelancer Demo
                </span>
                <span className="text-[10px] font-semibold text-emerald-700 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  1-Click →
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-700 font-medium truncate w-full">
                nafizuddowla01@gmail.com
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                Pass: <span className="text-slate-600 font-semibold">Password@123</span>
              </p>
            </button>
          </div>
        </div>

        {/* Bottom Prompts & Copyright */}
        <div className="pt-6">
          <div className="text-center text-xs text-slate-600">
            Don&apos;t have an account ?{' '}
            <Link href="/register" className="font-semibold text-[#14a800] hover:underline">
              Signup now
            </Link>
          </div>
          <p className="text-[11px] text-slate-400 text-center mt-2.5">
            © 2026 Banglance
          </p>
        </div>
      </div>
    </div>
  );
}
