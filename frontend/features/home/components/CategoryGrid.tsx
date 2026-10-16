'use client';

import React from 'react';
import Link from 'next/link';
import { Terminal, Paintbrush, Smartphone, Brain, ShieldCheck, FileEdit, ArrowRight } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';

export function CategoryGrid() {
  const user = useAuthStore((s) => s.user);
  const isClient = user?.role === 'CLIENT';

  const categories = [
    {
      title: 'Fullstack & Web Architecture',
      description: 'Next.js 16, NestJS, TypeScript, PostgreSQL, and scalable microservices.',
      jobs: '2,110 Open Jobs',
      rates: '৳500 - ৳1,200/hr',
      tags: ['#NextJS', '#NestJS', '#PostgreSQL'],
      icon: Terminal,
      slug: 'development',
    },
    {
      title: 'UI/UX Design & Systems',
      description: 'Modern design systems, spatial UI, Figma prototypes, and micro-interactions.',
      jobs: '890 Open Jobs',
      rates: '৳500 - ৳1,500/hr',
      tags: ['#Figma', '#DesignSystems', '#DesignOps'],
      icon: Paintbrush,
      slug: 'design',
    },
    {
      title: 'Mobile Apps & Cross-Platform',
      description: 'React Native, Flutter, iOS Swift, and native Android applications.',
      jobs: '1,420 Open Jobs',
      rates: '৳600 - ৳1,500/hr',
      tags: ['#ReactNative', '#Flutter', '#Mobile'],
      icon: Smartphone,
      slug: 'mobile',
    },
    {
      title: 'AI, Agents & Machine Learning',
      description: 'Autonomous AI agents, LLM integrations, PyTorch models, and RAG pipelines.',
      jobs: '740 Open Jobs',
      rates: '৳800 - ৳2,000/hr',
      tags: ['#AI', '#Python', '#LLMAgents'],
      icon: Brain,
      slug: 'ai',
    },
    {
      title: 'Cybersecurity & Audit',
      description: 'Penetration testing, code audits, compliance, and vulnerability mitigation.',
      jobs: '530 Open Jobs',
      rates: '৳1,200 - ৳3,000/hr',
      tags: ['#Security', '#Audit', '#Compliance'],
      icon: ShieldCheck,
      slug: 'security',
    },
    {
      title: 'Technical Writing & Growth',
      description: 'Developer documentation, API reference guides, and tech marketing content.',
      jobs: '615 Open Jobs',
      rates: '৳400 - ৳1,000/hr',
      tags: ['#Documentation', '#APIs', '#TechWriting'],
      icon: FileEdit,
      slug: 'writing',
    },
  ];

  const browseAllHref = isClient ? '/freelancers' : '/jobs';

  return (
    <section className="w-full bg-white py-16 px-4 md:px-8 border-b border-[#e4ebe4]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#001e00] font-normal tracking-tight">
              Browse talent by category
            </h2>
            <p className="text-sm text-[#5e6d55] mt-1">
              Looking for work?{' '}
              <Link href="/jobs" className="text-[#14a800] font-semibold hover:underline">
                Browse jobs
              </Link>
            </p>
          </div>
          <Link
            href={browseAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#14a800] hover:underline group"
          >
            <span>{isClient ? 'Browse all talent' : 'Browse all categories'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const categoryHref = isClient
              ? `/freelancers?category=${cat.slug}`
              : `/jobs?category=${cat.slug}`;

            return (
              <Link
                key={cat.title}
                href={categoryHref}
                className="group p-6 rounded-2xl bg-white border border-[#e4ebe4] hover:bg-[#f2f7f2] hover:border-[#14a800] hover:shadow-sm transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#f2f7f2] border border-[#e4ebe4] flex items-center justify-center text-[#14a800] mb-4 group-hover:bg-[#14a800] group-hover:text-white transition-colors duration-150">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-[#001e00] mb-1.5 group-hover:text-[#14a800] transition-colors tracking-tight">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-[#5e6d55] mb-5 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs py-2 bg-[#f9faf9] rounded-xl px-3 mb-3 border border-[#e4ebe4]">
                    <span className="text-[#14a800] font-bold">★ 4.85/5</span>
                    <span className="text-[#5e6d55] font-medium">{cat.jobs}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-[#5e6d55]">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded-full bg-[#f2f7f2] border border-[#e4ebe4]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
