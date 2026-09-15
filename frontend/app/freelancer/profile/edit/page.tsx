import { Metadata } from 'next';
import { ProfileEditView } from '@/features/freelancer/components/ProfileEditView';

export const metadata: Metadata = {
  title: 'Edit Freelancer Profile & Credentials | Banglance',
  description:
    'Manage your freelancer profile, verified skills, payment settings, and availability on Banglance.',
  keywords: ['freelancer profile', 'verified skills', 'developer portfolio', 'marketplace profile'],
};

export default function FreelancerProfileEditPage() {
  return <ProfileEditView />;
}
