import React from 'react';
import Link from 'next/link';
import { ShieldCheck, MapPin, Clock, Award, ChevronRight } from 'lucide-react';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentDossierHeaderProps {
  profile: FreelancerProfile;
}

export function TalentDossierHeader({ profile }: TalentDossierHeaderProps) {
  const displayName = profile.title
    ? profile.user.email.split('@')[0]
    : 'Web3 Specialist';
  const handle = `${displayName.toLowerCase().replace(/\s+/g, '')}.eth`;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-6">
      {/* Navigation Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-on-surface-variant font-mono">
        <Link href="/" className="hover:text-primary transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3 h-3 text-outline-variant shrink-0" />
        <Link href="/freelancers" className="hover:text-primary transition-colors">
          Find Talent
        </Link>
        <ChevronRight className="w-3 h-3 text-outline-variant shrink-0" />
        <span className="text-on-surface font-semibold truncate max-w-[200px] sm:max-w-none">
          {displayName}
        </span>
      </nav>

      {/* Main Profile Info Row */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Avatar with Live Status */}
        <div className="relative shrink-0">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-surface-container-high border border-outline-variant/50 flex items-center justify-center text-3xl font-bold text-primary">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-primary ring-2 ring-surface-container" />
          </span>
        </div>

        {/* Identity & Badges */}
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-on-surface tracking-tight capitalize">
              {displayName.replace('.', ' ')}
            </h1>
            <span className="text-xs font-mono text-on-surface-variant bg-surface-container-low px-2 py-0.5 rounded border border-outline-variant/20">
              {handle}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold bg-surface-container-high text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
              <ShieldCheck className="w-3 h-3" />
              Verified Expert
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-mono text-secondary bg-surface-container-low px-2.5 py-0.5 rounded-full border border-secondary/20">
              <Award className="w-3 h-3 text-secondary" />
              SBT #0418
            </span>
          </div>

          <p className="text-lg font-semibold text-on-surface">
            {profile.title || 'Senior Protocol Engineer'}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-on-surface-variant pt-0.5">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              Remote / Global
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Local Time: 15:42 CET
            </span>
            <span className="flex items-center gap-1 text-primary font-medium">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Available Immediately
            </span>
          </div>
        </div>
      </div>

      {/* Bio Paragraph */}
      <div className="bg-surface-container-low/60 rounded-xl p-4 sm:p-5 border border-outline-variant/20">
        <p className="text-sm text-on-surface-variant leading-relaxed">
          {profile.description ||
            'Specialized in architecting high-performance smart contracts, DeFi AMMs, and audited decentralized protocol applications with zero critical vulnerabilities.'}
        </p>
      </div>

      {/* Skills Badges */}
      <div className="flex flex-wrap gap-2">
        {profile.skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 rounded-full text-xs font-mono bg-surface-container-high text-on-surface border border-outline-variant/30 hover:border-primary/50 transition-colors"
          >
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}
