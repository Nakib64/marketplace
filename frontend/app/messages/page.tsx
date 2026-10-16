import { Metadata } from 'next';
import { Suspense } from 'react';
import { WorkroomsView } from '@/features/messages/components/WorkroomsView';

export const metadata: Metadata = {
  title: 'Messages & Project Workrooms | Banglance',
  description: 'Secure workrooms, real-time messaging, and milestone delivery handovers on Banglance.',
};

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="flex w-full h-[calc(100vh-4rem)] bg-background items-center justify-center text-sm text-on-surface-variant">Loading workroom conversations...</div>}>
      <WorkroomsView />
    </Suspense>
  );
}
