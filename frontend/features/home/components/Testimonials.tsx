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
        'Hired two NestJS and React developers for our platform within 48 hours. Payment protection gave both parties complete peace of mind, and the transparent fee is unbeatable compared to legacy platforms.',
      stat: '৳2.1M',
      statLabel: 'Paid Securely',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    },
    {
      author: 'Elena Rostova',
      role: 'Fullstack Security Specialist',
      badge: 'Top Rated Talent',
      quote:
        'As a software consultant, getting paid without 14-day clearance delays or currency conversion fee gouging is game changing. Approved milestone payments land directly into my wallet within minutes.',
      stat: '৳1.45M',
      statLabel: 'Earned & Payouts',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&h=120&q=80',
    },
    {
      author: 'Kenji Takahashi',
      role: 'Lead Project Director, Apex Tech',
      badge: 'Enterprise Client',
      quote:
        'Our engineering team manages multiple ongoing contractor workstreams solely through Banglance milestone contracts. Zero payment disputes, automatic delivery tracking, and honest feedback ratings.',
      stat: '৳3.8M',
      statLabel: 'Total Volume',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80',
    },
  ];

  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 py-20 w-full">
      {/* Platform Metrics */}
      <PlatformMetrics />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-12">
        <span className="text-xs text-[#14a800] uppercase tracking-wider block mb-2 font-bold">
          CUSTOMER STORIES
        </span>
        <h2 className="text-3xl md:text-4xl font-display text-[#001e00] tracking-tight font-normal">
          Real results from verified clients &amp; talent
        </h2>
      </div>

      {/* Reviews Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((r) => (
          <div
            key={r.author}
            className="group p-7 rounded-2xl bg-white border border-[#e4ebe4] hover:border-[#14a800] hover:shadow-md transition-all duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-[#14a800] gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#14a800] text-[#14a800]" />
                  ))}
                </div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#f2f7f2] text-[#14a800] font-semibold">
                  {r.badge}
                </span>
              </div>
              <p className="text-sm text-[#001e00] mb-8 leading-relaxed italic font-normal">
                &ldquo;{r.quote}&rdquo;
              </p>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-[#e4ebe4]">
              <div className="flex items-center gap-3 min-w-0">
                <Image
                  src={r.avatar}
                  alt={r.author}
                  width={42}
                  height={42}
                  unoptimized
                  className="w-10 h-10 rounded-full object-cover border border-[#e4ebe4]"
                />
                <div className="truncate">
                  <h4 className="text-xs font-bold text-[#001e00] truncate">{r.author}</h4>
                  <p className="text-[11px] text-[#5e6d55] truncate">{r.role}</p>
                </div>
              </div>
              <div className="text-right shrink-0 font-mono">
                <span className="text-xs font-bold text-[#14a800] block">{r.stat}</span>
                <span className="text-[10px] text-[#5e6d55] uppercase tracking-wider">{r.statLabel}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
