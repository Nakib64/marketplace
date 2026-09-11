import { Metadata } from 'next';
import { WorkroomsView } from '@/features/messages/components/WorkroomsView';

export const metadata: Metadata = {
  title: 'Encrypted Workrooms & Messaging | Banglance',
  description: 'End-to-end encrypted decentralized workrooms, milestone delivery handovers, and real-time escrow telemetry.',
};

export default function MessagesPage() {
  return <WorkroomsView />;
}
