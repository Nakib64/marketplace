import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Briefcase } from 'lucide-react';

export function BottomCTA() {
  return (
    <section className="max-w-[1280px] mx-auto px-4 md:px-8 pb-20 pt-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: For Clients */}
        <div className="rounded-3xl bg-[#13544e] text-white p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider text-[#a0dfa0] font-bold block mb-3">
              FOR CLIENTS
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-normal tracking-tight mb-4">
              Find talent your way
            </h3>
            <p className="text-sm text-[#d4e6d4] leading-relaxed mb-8 max-w-md font-normal">
              Work with the largest network of independent professionals and get things done—from quick turnarounds to complex fullstack transformations.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link
              href="/client/jobs/new"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#14a800] hover:bg-[#108a00] text-white font-medium text-sm transition-all duration-150 cursor-pointer shadow-sm hover:shadow"
            >
              <span>Post a job and hire talent</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-white/5 pointer-events-none" />
        </div>

        {/* Card 2: For Talent */}
        <div className="rounded-3xl bg-[#f2f7f2] border border-[#e4ebe4] text-[#001e00] p-8 md:p-12 flex flex-col justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <span className="text-xs uppercase tracking-wider text-[#14a800] font-bold block mb-3">
              FOR TALENT
            </span>
            <h3 className="text-3xl md:text-4xl font-display font-normal tracking-tight mb-4">
              Find great work
            </h3>
            <p className="text-sm text-[#5e6d55] leading-relaxed mb-8 max-w-md font-normal">
              Meet clients you’re excited to work with and take your career or business to new heights with 100% milestone payment protection.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center gap-3">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#14a800] text-[#14a800] hover:bg-[#e4ebe4]/60 font-medium text-sm transition-all duration-150 cursor-pointer bg-white"
            >
              <span>Find opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full bg-[#14a800]/5 pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
