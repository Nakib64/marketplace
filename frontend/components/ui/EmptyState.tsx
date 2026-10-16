import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-[#e4ebe4] bg-white shadow-xs ${
        className || ''
      }`}
    >
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f2f7f2] border border-[#e4ebe4] text-[#14a800] mb-4">
        <Icon className="h-6 w-6" />
      </div>
      <h4 className="text-lg font-bold text-[#001e00] tracking-tight">{title}</h4>
      <p className="mt-1.5 max-w-sm text-sm text-[#5e6d55] leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
