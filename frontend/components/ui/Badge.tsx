import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'outline' | 'info' | 'primary';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
  withDot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-[#f2f7f2] text-[#001e00] border-[#e4ebe4] hover:bg-[#e4ebe4]',
  success: 'bg-[#eaf5ea] text-[#14a800] border-[#d5e0d5]',
  warning: 'bg-[#fdf4e8] text-[#935200] border-[#f5dfc6]',
  danger: 'bg-[#fdedec] text-[#bc2c1a] border-[#f8c8c5]',
  info: 'bg-[#f2f7f2] text-[#13544e] border-[#e4ebe4]',
  outline: 'bg-white text-[#5e6d55] border-[#d5e0d5]',
  primary: 'bg-[#14a800]/10 text-[#14a800] border-[#14a800]/25',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-[#001e00]',
  success: 'bg-[#14a800]',
  warning: 'bg-[#935200]',
  danger: 'bg-[#bc2c1a]',
  info: 'bg-[#13544e]',
  outline: 'bg-[#5e6d55]',
  primary: 'bg-[#14a800]',
};

export function Badge({
  className,
  variant = 'default',
  icon,
  withDot = false,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border backdrop-blur-sm select-none',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {withDot && (
        <span
          className={cn('w-1.5 h-1.5 rounded-full animate-pulse shrink-0', dotColors[variant])}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
