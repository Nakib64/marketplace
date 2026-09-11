import React from 'react';
import Link from 'next/link';
import { Send, MessageSquare } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentDossierMobileBarProps {
  profile: FreelancerProfile;
}

export function TalentDossierMobileBar({ profile }: TalentDossierMobileBarProps) {
  const hourlyRate = profile.hourlyRate ? Number(profile.hourlyRate) : 120;

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-4 py-3 border-t border-outline-variant/30 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        <div className="flex flex-col">
          <span className="text-[11px] text-on-surface-variant font-mono">Rate</span>
          <span className="text-base font-bold text-on-surface font-mono">
            {formatCurrency(hourlyRate)} <span className="text-xs font-normal">/hr</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/messages?user=${profile.userId}`}>
            <Button variant="secondary" size="sm" className="px-3">
              <MessageSquare className="w-4 h-4" />
            </Button>
          </Link>

          <Link href={`/client/jobs/new?hire=${profile.id}`}>
            <Button variant="primary" size="sm" className="px-4 font-semibold">
              <Send className="w-3.5 h-3.5 mr-1.5" />
              <span>Hire Talent</span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
