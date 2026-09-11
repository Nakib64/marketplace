'use client';

import React from 'react';
import { FreelancerProfile } from '../types/talentTypes';
import { TalentDossierHeader } from './TalentDossierHeader';
import { TalentDossierStats } from './TalentDossierStats';
import { TalentPortfolioSection } from './TalentPortfolioSection';
import { TalentReviewsSection } from './TalentReviewsSection';
import { TalentCredentialsSection } from './TalentCredentialsSection';
import { TalentSidebarOffer } from './TalentSidebarOffer';
import { TalentEscrowCalculator } from './TalentEscrowCalculator';
import { TalentVerificationChecklist } from './TalentVerificationChecklist';
import { TalentDossierMobileBar } from './TalentDossierMobileBar';

interface TalentDossierViewProps {
  profile: FreelancerProfile;
}

export function TalentDossierView({ profile }: TalentDossierViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Two-Column Responsive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Primary Details Column (approx 68% = 8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <TalentDossierHeader profile={profile} />
          <TalentDossierStats profile={profile} />
          <TalentPortfolioSection profile={profile} />
          <TalentReviewsSection profile={profile} />
          <TalentCredentialsSection />
        </div>

        {/* Right Sticky Sidebar Column (approx 32% = 4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24">
          <TalentSidebarOffer profile={profile} />
          <TalentEscrowCalculator hourlyRate={profile.hourlyRate} />
          <TalentVerificationChecklist />
        </div>
      </div>

      {/* Mobile Sticky CTA Bar */}
      <TalentDossierMobileBar profile={profile} />
    </div>
  );
}
