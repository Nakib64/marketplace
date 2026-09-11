import React from 'react';
import { Badge, BadgeVariant } from './Badge';

export type MarketplaceStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'FUNDED'
  | 'WORK_SUBMITTED'
  | 'COMPLETED'
  | 'DISPUTED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'PENDING';

interface StatusConfig {
  variant: BadgeVariant;
  label: string;
}

const statusMap: Record<MarketplaceStatus, StatusConfig> = {
  OPEN: { variant: 'info', label: 'Open' },
  IN_PROGRESS: { variant: 'info', label: 'In Progress' },
  FUNDED: { variant: 'success', label: 'Funded in Escrow' },
  WORK_SUBMITTED: { variant: 'warning', label: 'Under Review' },
  COMPLETED: { variant: 'success', label: 'Completed' },
  DISPUTED: { variant: 'danger', label: 'Disputed' },
  REJECTED: { variant: 'danger', label: 'Rejected' },
  CANCELLED: { variant: 'default', label: 'Cancelled' },
  PENDING: { variant: 'warning', label: 'Pending' },
};

export interface StatusBadgeProps {
  status: MarketplaceStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const normalizedStatus = status?.toUpperCase() as MarketplaceStatus;
  const config = statusMap[normalizedStatus] || {
    variant: 'default',
    label: status,
  };

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}
