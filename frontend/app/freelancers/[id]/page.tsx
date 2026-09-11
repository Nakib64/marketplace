import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { UserX } from 'lucide-react';
import { talentApi } from '@/features/talent/api/talentApi';
import { TalentDossierView } from '@/features/talent/components/TalentDossierView';
import { Button } from '@/components/ui/Button';

interface PageProps {
  params: Promise<{ id: string }>;
}

const FALLBACK_PROFILE = {
  id: 'talent-1',
  userId: 'user-1',
  title: 'Senior Solidity & EVM Protocol Architect',
  description:
    'Specializing in DEX AMM architecture, gas optimization (Yul/assembly), and Foundry invariant fuzzing. Over $180M TVL protected across audited deployments with zero critical vulnerabilities.',
  hourlyRate: 120,
  skills: ['Solidity 0.8.28', 'Uniswap v3/v4', 'Foundry', 'Yul', 'Arbitrum Nitro', 'Slither'],
  totalProjects: 38,
  earnings: 240000,
  rating: 5.0,
  totalReviews: 42,
  successRate: 100,
  createdAt: new Date().toISOString(),
  user: {
    id: 'u1',
    email: 'alex.rivera@banglance.dev',
    createdAt: new Date().toISOString(),
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const profile = await talentApi.getFreelancerProfile(id);
    const name = profile.user?.email.split('@')[0] || 'Freelancer';
    return {
      title: `${name} – ${profile.title || 'Specialist'} | Banglance Dossier`,
      description: profile.description?.slice(0, 155),
    };
  } catch {
    return {
      title: 'Talent Dossier | Banglance Marketplace',
      description: 'View verified developer profile and escrow track record on Banglance.',
    };
  }
}

export default async function FreelancerDossierPage({ params }: PageProps) {
  const { id } = await params;

  let profile = null;
  try {
    profile = await talentApi.getFreelancerProfile(id);
  } catch {
    profile = null;
  }

  // Use seed fallback profile if requested in demo/dev mode
  const activeProfile = profile || (id.startsWith('talent-') ? FALLBACK_PROFILE : null);

  if (!activeProfile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-4 border border-outline-variant/30">
          <UserX className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Talent Profile Not Found</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          The freelancer profile you requested could not be located or may have been unlisted.
        </p>
        <Link href="/freelancers">
          <Button variant="primary" size="md">
            Browse Talent Directory
          </Button>
        </Link>
      </div>
    );
  }

  return <TalentDossierView profile={activeProfile} />;
}
