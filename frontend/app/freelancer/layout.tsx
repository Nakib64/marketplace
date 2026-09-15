import React from 'react';
import { RoleGuard } from '@/components/auth/RoleGuard';

export default function FreelancerLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard allowedRoles={['FREELANCER']}>{children}</RoleGuard>;
}
