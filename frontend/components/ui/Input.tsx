import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightIcon, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold text-[#001e00]">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3 text-[#5e6d55] pointer-events-none flex items-center">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              'w-full rounded-xl border border-[#d5e0d5] bg-white px-3.5 py-2.5 text-sm text-[#001e00] placeholder:text-[#9aaa97] transition-colors focus:border-[#14a800] focus:outline-none focus:ring-2 focus:ring-[#14a800]/20 disabled:bg-[#f9faf9] disabled:cursor-not-allowed',
              leftIcon && 'pl-10',
              rightIcon && 'pr-10',
              error && 'border-[#bc2c1a] focus:border-[#bc2c1a] focus:ring-[#bc2c1a]/20 text-[#bc2c1a]',
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 text-[#5e6d55] pointer-events-none flex items-center">
              {rightIcon}
            </div>
          )}
        </div>
        {error ? (
          <p className="text-xs text-[#bc2c1a] font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#5e6d55]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
