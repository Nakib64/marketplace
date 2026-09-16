'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { freelancerApi } from '../api/freelancerApi';
import { ProfileEditHeader } from './ProfileEditHeader';
import { ProfileEditSidebar } from './ProfileEditSidebar';
import { ProfileDecentralizedIdentitySection } from './ProfileDecentralizedIdentitySection';
import { ProfileAddressSection } from './ProfileAddressSection';
import { ProfilePortfolioSection } from './ProfilePortfolioSection';
import { ProfileCertificatesSection } from './ProfileCertificatesSection';
import { ProfileEducationSection } from './ProfileEducationSection';
import { ProfileWorkHistorySection } from './ProfileWorkHistorySection';
import { ProfileWorkParametersSection } from './ProfileWorkParametersSection';
import { FreelancerProfile } from '@/features/talent/types/talentTypes';

interface ProfileEditContentProps {
  profile: FreelancerProfile | null;
  workHistories: any[];
  onRefresh: () => void;
}

const ProfileEditContent: React.FC<ProfileEditContentProps> = ({
  profile,
  workHistories = [],
  onRefresh,
}) => {
  const [title, setTitle] = useState(profile?.title || '');
  const [bio, setBio] = useState(profile?.description || '');
  const [ensDomain, setEnsDomain] = useState(profile?.slug || 'freelancer.banglance');
  const [hourlyRate, setHourlyRate] = useState<number>(
    profile?.hourlyRate ? Number(profile.hourlyRate) : 500
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await freelancerApi.updateFreelancerProfile({
        title,
        description: bio,
        hourlyRate,
      });
      toast.success('Professional Identity updated successfully!');
      onRefresh();
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Failed to update profile identity.';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Merge full profile with workHistories for completeness computation
  const fullProfile: FreelancerProfile | null = profile
    ? {
        ...profile,
        user: {
          id: profile.userId,
          email: '',
          createdAt: profile.createdAt,
          workHistories,
        },
      }
    : null;

  return (
    <div className="w-full bg-background min-h-screen py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
        <ProfileEditHeader onSave={handleSave} isSaving={isSaving} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <ProfileEditSidebar profile={fullProfile} />

          <div className="lg:col-span-9 flex flex-col gap-6">
            {/* 1. Basic Identity & Bio */}
            <ProfileDecentralizedIdentitySection
              title={title}
              onTitleChange={setTitle}
              bio={bio}
              onBioChange={setBio}
              ensDomain={ensDomain}
              onEnsChange={setEnsDomain}
            />

            {/* 2. Rates & Parameters */}
            <ProfileWorkParametersSection
              hourlyRate={hourlyRate}
              onHourlyRateChange={setHourlyRate}
              onSave={handleSave}
              isSaving={isSaving}
            />

            {/* 3. Address & Location */}
            <ProfileAddressSection
              initialCountry={profile?.country}
              initialCity={profile?.city}
              initialAddress={profile?.address}
              onSaved={onRefresh}
            />

            {/* 4. Portfolio Projects (Images & Links) */}
            <ProfilePortfolioSection
              portfolioItems={profile?.portfolioItems || []}
              onRefresh={onRefresh}
            />

            {/* 5. Certificates & Credentials (Images & Links) */}
            <ProfileCertificatesSection
              certificates={profile?.certificates || []}
              onRefresh={onRefresh}
            />

            {/* 6. Education History */}
            <ProfileEducationSection
              educations={profile?.educations || []}
              onRefresh={onRefresh}
            />

            {/* 7. Previous Work History */}
            <ProfileWorkHistorySection
              workHistories={workHistories}
              onRefresh={onRefresh}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileEditView: React.FC = () => {
  const { data: userProfile, refetch } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => freelancerApi.getMyProfile().catch(() => null),
  });

  const profile = userProfile?.freelancerProfile || null;
  const workHistories = userProfile?.workHistories || [];

  return (
    <ProfileEditContent
      key={profile?.id || 'default'}
      profile={profile}
      workHistories={workHistories}
      onRefresh={refetch}
    />
  );
};

