'use client';

import React, { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { registerSchema, RegisterFormData } from '../schemas/authSchema';
import { useAuthActions } from '../hooks/useAuthActions';
import { UserRole } from '@/types/user';
import { Button } from '@/components/ui/Button';

interface RegisterFormProps {
  selectedRole: UserRole;
}

export function RegisterForm({ selectedRole }: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { register: submitRegister, isRegistering } = useAuthActions();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: selectedRole,
      email: '',
      password: '',
      terms: false,
    },
  });

  const passwordValue = useWatch({ control, name: 'password' }) || '';

  const getStrength = (pwd: string) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    return score;
  };

  const strength = getStrength(passwordValue);

  const onSubmit = (data: RegisterFormData) => {
    submitRegister({
      email: data.email,
      password: data.password,
      role: selectedRole,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      {/* Email Input */}
      <div>
        <label className="block text-xs font-semibold text-on-surface mb-1.5" htmlFor="reg-email">
          Email Address
        </label>
        <div className="relative flex items-center">
          <Mail className="absolute left-3 w-4 h-4 text-outline pointer-events-none" />
          <input
            id="reg-email"
            type="email"
            placeholder="builder@marketplace.com"
            className="w-full h-11 pl-10 pr-3 rounded-lg bg-surface-container text-on-surface placeholder:text-outline border border-outline-variant/60 focus:border-primary focus:outline-none text-sm transition-colors"
            {...register('email')}
          />
        </div>
        {errors.email && <p className="text-xs text-error mt-1">{errors.email.message}</p>}
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-on-surface" htmlFor="reg-password">
            Account Password
          </label>
          <span className="text-[10px] font-mono text-outline">Min. 8 characters</span>
        </div>
        <div className="relative flex items-center">
          <Lock className="absolute left-3 w-4 h-4 text-outline pointer-events-none" />
          <input
            id="reg-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••••••"
            className="w-full h-11 pl-10 pr-10 rounded-lg bg-surface-container text-on-surface placeholder:text-outline border border-outline-variant/60 focus:border-primary focus:outline-none text-sm transition-colors"
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

        {/* 4-bar Entropy Meter from Stitch */}
        <div className="grid grid-cols-4 gap-1.5 mt-2">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`h-1 rounded-full transition-all ${
                strength >= bar ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Terms Agreement */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer select-none">
          <input
            type="checkbox"
            className="mt-0.5 rounded border-outline-variant text-primary focus:ring-primary/20 accent-primary"
            {...register('terms')}
          />
          <span className="text-xs text-on-surface-variant leading-relaxed">
            I agree to the platform terms, escrow protection guarantee, and double-blind review system.
          </span>
        </label>
        {errors.terms && <p className="text-xs text-error mt-1">{errors.terms.message}</p>}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        isLoading={isRegistering}
        size="lg"
        rightIcon={<ArrowRight className="w-4 h-4 text-surface" />}
        className="w-full bg-primary hover:bg-primary-container text-surface font-semibold"
      >
        Create {selectedRole === 'CLIENT' ? 'Client' : 'Freelancer'} Account
      </Button>
    </form>
  );
}
