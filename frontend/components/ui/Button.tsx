import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isPill?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-[#14a800] hover:bg-[#108a00] active:bg-[#0d7000] text-white font-semibold shadow-xs transition-colors rounded-full',
  secondary:
    'bg-transparent border border-[#14a800] text-[#14a800] hover:bg-[#f2f7f2] active:bg-[#e4ebe4] font-semibold transition-colors rounded-full',
  outline:
    'border border-[#001e00] text-[#001e00] hover:bg-[#f2f7f2] font-semibold transition-colors rounded-full',
  ghost:
    'text-[#001e00] hover:bg-[#f2f7f2] font-semibold transition-colors rounded-full',
  danger:
    'bg-[#bc2c1a] hover:bg-[#9e2415] text-white font-semibold shadow-xs transition-colors rounded-full',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3.5 py-1.5 text-xs font-semibold gap-1.5',
  md: 'px-5 py-2 text-sm font-semibold gap-2',
  lg: 'px-6 py-3 text-base font-semibold gap-2.5',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      isPill = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'group inline-flex items-center justify-center transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:active:scale-100 cursor-pointer select-none',
          variantStyles[variant],
          sizeStyles[size],
          isPill && '!rounded-full',
          className
        )}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin text-current" />
        ) : leftIcon ? (
          <span className="shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)]">
            {leftIcon}
          </span>
        ) : null}
        {children}
        {!isLoading && rightIcon && (
          <span className="shrink-0 transition-transform duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-0.5">
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
