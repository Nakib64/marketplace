import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { PlatformMetrics } from './PlatformMetrics';

export function Testimonials() {
  const reviews = [
    {
      author: 'Marcus Vance',
      role: 'Co-Founder, Synthetix Hub',
      badge: 'Verified Client',
      quote:
        'Hired two NestJS and React developers for our platform within 48 hours. Escrow locking gave both parties complete peace of mind, and the transparent fee is unbeatable compared to legacy platforms.',
      stat: '$210K',
      statLabel: 'Spent in Escrow',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    },
    {
      author: 'Elena Rostova',
      role: 'Fullstack Security Specialist',
      badge: 'Top Rated Talent',
      quote:
        'As a software consultant, getting paid without 14-day clearance delays or currency conversion fee gouging is game changing. Approved milestone payments land directly into my wallet within minutes.',
      stat: '$145K',
      statLabel: 'Earned & Payouts',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
    },
    {
      author: 'Kenji Takahashi',
      role: 'Lead Project Director, Apex Tech',
      badge: 'Enterprise Client',
      quote:
        'Our engineering team manages multiple ongoing contractor workstreams solely through Banglance milestone escrow contracts. Zero payment disputes, automatic delivery tracking, and honest feedback ratings.',
      stat: '$380K',
      statLabel: 'Total Volume',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-16 w-full">
      {/* Platform Metrics */}
      <PlatformMetrics />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-mono text-primary uppercase tracking-widest block mb-1.5 font-semibold">
          PEER ENDORSEMENTS
        </span>
        <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
          Vetted by Builders &amp; Engineering Teams
        </h2>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.author}
            className="p-6 rounded-2xl bg-surface-container border border-outline-variant/40 shadow-xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-primary gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  {r.badge}
                </span>
              </div>
              <p className="text-xs md:text-sm text-on-surface mb-6 leading-relaxed italic">
                &ldquo;{r.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-outline-variant/30">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={r.avatar}
                  alt={r.author}
                  width={40}
                  height={40}
                  unoptimized
                  className="w-10 h-10 rounded-full object-cover border border-outline-variant/50"
                />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-on-surface truncate">{r.author}</h4>
                  <p className="text-[11px] text-on-surface-variant truncate">{r.role}</p>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono">
                <span className="text-xs font-bold text-primary block">{r.stat}</span>
                <span className="text-[10px] text-outline">{r.statLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
