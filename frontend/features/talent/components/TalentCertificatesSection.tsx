'use client';

import React from 'react';
import { Award, Calendar, ExternalLink } from 'lucide-react';
import { FreelancerProfile } from '../types/talentTypes';

interface TalentCertificatesSectionProps {
  profile: FreelancerProfile;
}

export function TalentCertificatesSection({ profile }: TalentCertificatesSectionProps) {
  const certificates = profile.certificates || [];

  if (certificates.length === 0) return null;

  return (
    <section className="bg-surface-container rounded-2xl p-6 sm:p-8 border border-outline-variant/30 shadow-sm flex flex-col gap-5">
      <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Award className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-on-surface">Certifications &amp; Credentials</h2>
        </div>
        <span className="text-xs text-primary bg-surface-container-high px-2.5 py-1 rounded-full border border-primary/20">
          {certificates.length} Verified
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {certificates.map((cert) => {
          const formattedDate = cert.issueDate
            ? new Date(cert.issueDate).toLocaleDateString('en-US', {
                month: 'short',
                year: 'numeric',
              })
            : '';

          return (
            <article
              key={cert.id}
              className="bg-surface-container-low rounded-xl p-4 border border-outline-variant/20 flex items-start gap-3.5 group hover:border-primary/40 transition-colors"
            >
              {cert.imageUrl ? (
                <div className="w-12 h-12 rounded-xl bg-surface-container-high overflow-hidden shrink-0 border border-outline-variant/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center shrink-0 text-primary">
                  <Award className="w-6 h-6" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold text-on-surface truncate">{cert.title}</h3>
                <p className="text-xs text-on-surface-variant font-medium mt-0.5 truncate">{cert.issuer}</p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/10 text-xs">
                  <span className="flex items-center gap-1 text-[11px] text-outline font-mono">
                    <Calendar className="w-3 h-3" />
                    {formattedDate}
                  </span>

                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Verify</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
