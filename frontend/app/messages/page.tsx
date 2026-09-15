import { Metadata } from 'next';
import { WorkroomsView } from '@/features/messages/components/WorkroomsView';

export const metadata: Metadata = {
  title: 'Messages & Project Workrooms | Banglance',
  description: 'Secure workrooms, real-time messaging, and milestone delivery handovers on Banglance.',
};

export default function MessagesPage() {
  return <WorkroomsView />;
}
