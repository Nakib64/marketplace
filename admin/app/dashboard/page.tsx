import type { Metadata } from 'next';
import { ModernDashboardView } from '@/components/dashboard/ModernDashboardView';

export const metadata: Metadata = {
  title: 'Dashboard | Banglance Admin',
  description: 'Executive overview, project velocities, performance gauge, revenue analytics, and active deals.',
};

export default function AdminDashboardPage() {
  return <ModernDashboardView />;
}
