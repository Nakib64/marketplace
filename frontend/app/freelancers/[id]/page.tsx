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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://banglance.saasfactry.com';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const profile = await talentApi.getFreelancerProfile(id);
    const name = profile.user?.email.split('@')[0] || 'Freelancer';
    const title = `${name} – ${profile.title || 'Specialist'} | Banglance Dossier`;
    const description = profile.description?.slice(0, 160) || 'Verified technical freelancer on Banglance.';
    const profileUrl = `${siteUrl}/freelancers/${id}`;

    return {
      title,
      description,
      alternates: {
        canonical: profileUrl,
      },
      openGraph: {
        title,
        description,
        url: profileUrl,
        type: 'profile',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
    };
  } catch {
    return {
      title: 'Talent Dossier | Banglance Marketplace',
      description: 'View verified developer profile and project track record on Banglance.',
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

  if (!profile) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-4 border border-outline-variant/30">
          <UserX className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-on-surface mb-2">Talent Profile Not Found</h1>
        <p className="text-sm text-on-surface-variant max-w-md mb-6">
          The freelancer profile you requested could not be located or does not exist.
        </p>
        <Link href="/freelancers">
          <Button variant="primary" size="md">
            Browse All Freelancers
          </Button>
        </Link>
      </div>
    );
  }

  const name = profile.user?.email.split('@')[0] || 'Freelancer';
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: name,
      jobTitle: profile.title || 'Independent Specialist',
      description: profile.description || undefined,
      url: `${siteUrl}/freelancers/${id}`,
      knowsAbout: profile.skills || [],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <TalentDossierView profile={profile} />
    </>
  );
}
