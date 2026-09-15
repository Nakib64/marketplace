import React from 'react';

const CREDENTIALS = [
  {
    id: 'cred-id',
    title: 'Identity Verified',
    subtitle: 'Government ID & Phone Confirmed',
    icon: 'verified_user',
  },
  {
    id: 'cred-skills',
    title: 'Skills Assessment',
    subtitle: 'Full Stack & API Verified',
    icon: 'military_tech',
  },
  {
    id: 'cred-top',
    title: 'Top Rated Talent',
    subtitle: '5.0 Client Satisfaction Score',
    icon: 'star',
  },
];

export const FreelancerDecentralizedIdCard: React.FC = () => {
  return (
    <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 shadow-sm flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-base font-bold text-on-surface">Verified Credentials</span>
        <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
      </div>

      <div className="flex flex-col gap-2.5">
        {CREDENTIALS.map((c) => (
          <div key={c.id} className="bg-surface-container p-2.5 rounded-lg border border-outline-variant/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[18px]">{c.icon}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-on-surface">{c.title}</span>
                <span className="text-[11px] text-on-surface-variant">{c.subtitle}</span>
              </div>
            </div>
            <span className="material-symbols-outlined text-primary text-[16px]">check</span>
          </div>
        ))}
      </div>
    </div>
  );
};

