import { Metadata } from 'next';
import { ProfileEditView } from '@/features/freelancer/components/ProfileEditView';

export const metadata: Metadata = {
  title: 'Identity & Verifiable Credentials Management | Banglance',
  description:
    'Manage decentralized identity, ENS domains, Soulbound Tokens (SBTs), EAS attestations, and escrow work parameters.',
  keywords: ['verifiable credentials', 'soulbound token', 'decentralized identity', 'ENS resolution', 'zk-KYC'],
};

export default function FreelancerProfileEditPage() {
  return <ProfileEditView />;
}
