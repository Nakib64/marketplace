'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginSchema, LoginFormData } from '../schemas/authSchema';
import { useAuthActions } from '../hooks/useAuthActions';
import { Button } from '@/components/ui/Button';

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn } = useAuthActions();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: true,
    },
  });

  const onSubmit = (data: LoginFormData) => {
    login({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <div className="w-full bg-surface-container rounded-2xl border border-outline-variant/50 p-6 md:p-8 shadow-xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Input */}
        <div>
          <label className="block text-xs font-semibold text-on-surface-variant mb-1.5" htmlFor="login-email">
            Email Address
          </label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 w-4 h-4 text-outline pointer-events-none" />
            <input
              id="login-email"
              type="email"
              placeholder="user@marketplace.com"
              className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline border border-outline-variant/50 focus:border-primary focus:outline-none text-sm transition-colors"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
        </div>

        {/* Password Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-on-surface-variant" htmlFor="login-password">
              Password
            </label>
            <span className="text-[10px] font-mono text-outline">Min. 8 chars</span>
          </div>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 w-4 h-4 text-outline pointer-events-none" />
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••••••"
              className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container-lowest text-on-surface placeholder:text-outline border border-outline-variant/50 focus:border-primary focus:outline-none text-sm transition-colors"
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 text-outline hover:text-on-surface transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-error mt-1">{errors.password.message}</p>}
        </div>

        {/* Options Row */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              className="rounded border-outline-variant text-primary focus:ring-primary/20 accent-primary"
              {...register('remember')}
            />
            <span className="text-xs text-on-surface-variant">Remember device</span>
          </label>
          <span className="text-xs text-outline cursor-not-allowed">Forgot password?</span>
        </div>

        {/* Primary Action Button */}
        <Button
          type="submit"
          isLoading={isLoggingIn}
          size="lg"
          rightIcon={<ArrowRight className="w-4 h-4 text-surface" />}
          className="w-full bg-primary hover:bg-primary-container text-surface font-semibold mt-2"
        >
          Sign In
        </Button>
      </form>

      {/* Security & Rate-Limit Notice */}
      <div className="mt-6 p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex flex-col text-xs">
          <span className="font-semibold text-on-surface">Dual-Actor JWT &amp; Escrow Security</span>
          <span className="text-[11px] text-on-surface-variant font-mono mt-0.5">
            Distributed sliding-window rate limit active to protect against brute-force attacks.
          </span>
        </div>
      </div>

      {/* Switch to Register */}
      <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
        <span>Don&apos;t have an account yet?</span>
        <Link href="/register" className="font-semibold text-primary hover:underline">
          Create Account →
        </Link>
      </div>
    </div>
  );
}
