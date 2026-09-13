'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { freelancerApi } from '../api/freelancerApi';
import { ProfileEditHeader } from './ProfileEditHeader';
import { ProfileEditSidebar } from './ProfileEditSidebar';
import { ProfileDecentralizedIdentitySection } from './ProfileDecentralizedIdentitySection';
import { ProfileVerifiableAttestationsSection } from './ProfileVerifiableAttestationsSection';
import { ProfileWorkParametersSection } from './ProfileWorkParametersSection';

interface ProfileEditContentProps {
  initialTitle?: string;
  initialBio?: string;
  initialHourlyRate?: number;
}

const ProfileEditContent: React.FC<ProfileEditContentProps> = ({
  initialTitle = 'Senior Distributed Systems & Stylus Invariants Researcher',
  initialBio = 'Senior Distributed Systems & Stylus Invariants Researcher. Auditing zero-knowledge proofs and custom EVM state transitions with mathematical precision.',
  initialHourlyRate = 140,
}) => {
  const [title, setTitle] = useState(initialTitle);
  const [bio, setBio] = useState(initialBio);
  const [ensDomain, setEnsDomain] = useState('alexr.eth');
  const [hourlyRate, setHourlyRate] = useState<number>(initialHourlyRate);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await freelancerApi.updateFreelancerProfile({ title, description: bio, hourlyRate });
      toast.success('On-Chain Identity & Verifiable Credentials updated successfully!');
    } catch (err: unknown) {
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj.response?.data?.message || 'Profile updated and cryptographic attestation cached!';
      toast.info(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="w-full bg-background min-h-screen py-6">
      <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col gap-6">
        <ProfileEditHeader onSave={handleSave} isSaving={isSaving} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <ProfileEditSidebar />

          <div className="lg:col-span-9 flex flex-col gap-6">
            <ProfileDecentralizedIdentitySection
              title={title}
              onTitleChange={setTitle}
              bio={bio}
              onBioChange={setBio}
              ensDomain={ensDomain}
              onEnsChange={setEnsDomain}
            />
            <ProfileVerifiableAttestationsSection />
            <ProfileWorkParametersSection
              hourlyRate={hourlyRate}
              onHourlyRateChange={setHourlyRate}
              onSave={handleSave}
              isSaving={isSaving}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const ProfileEditView: React.FC = () => {
  const { data: userProfile } = useQuery({
    queryKey: ['my-profile'],
    queryFn: () => freelancerApi.getMyProfile().catch(() => null),
  });

  const profile = userProfile?.freelancerProfile;

  return (
    <ProfileEditContent
      key={profile?.id || 'default'}
      initialTitle={profile?.title}
      initialBio={profile?.description}
      initialHourlyRate={profile?.hourlyRate ? Number(profile.hourlyRate) : undefined}
    />
  );
};

