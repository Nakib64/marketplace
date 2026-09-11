import React from 'react';
import Link from 'next/link';
import { Terminal, Paintbrush, Smartphone, Brain, ShieldCheck, FileEdit, ArrowRight } from 'lucide-react';

export function CategoryGrid() {
  const categories = [
    {
      title: 'Fullstack & Web Architecture',
      description: 'Next.js 16, NestJS, TypeScript, PostgreSQL, and scalable microservices.',
      jobs: '2,110 Open Jobs',
      rates: '$45 - $110/hr',
      tags: ['#NextJS', '#NestJS', '#PostgreSQL'],
      icon: Terminal,
      slug: 'development',
    },
    {
      title: 'UI/UX Design & Systems',
      description: 'Modern design systems, spatial UI, Figma prototypes, and micro-interactions.',
      jobs: '890 Open Jobs',
      rates: '$50 - $125/hr',
      tags: ['#Figma', '#DesignSystems', '#DesignOps'],
      icon: Paintbrush,
      slug: 'design',
    },
    {
      title: 'Mobile Apps & Cross-Platform',
      description: 'React Native, Flutter, iOS Swift, and native Android applications.',
      jobs: '1,420 Open Jobs',
      rates: '$55 - $130/hr',
      tags: ['#ReactNative', '#Flutter', '#Mobile'],
      icon: Smartphone,
      slug: 'mobile',
    },
    {
      title: 'AI, Agents & Machine Learning',
      description: 'Autonomous AI agents, LLM integrations, PyTorch models, and RAG pipelines.',
      jobs: '740 Open Jobs',
      rates: '$80 - $190/hr',
      tags: ['#AI', '#Python', '#LLMAgents'],
      icon: Brain,
      slug: 'ai',
    },
    {
      title: 'Cybersecurity & Audit',
      description: 'Penetration testing, code audits, compliance, and vulnerability mitigation.',
      jobs: '530 Open Jobs',
      rates: '$110 - $250/hr',
      tags: ['#Security', '#Audit', '#Compliance'],
      icon: ShieldCheck,
      slug: 'security',
    },
    {
      title: 'Technical Writing & Growth',
      description: 'Developer documentation, API reference guides, and tech marketing content.',
      jobs: '615 Open Jobs',
      rates: '$40 - $95/hr',
      tags: ['#Documentation', '#APIs', '#TechWriting'],
      icon: FileEdit,
      slug: 'writing',
    },
  ];

  return (
    <section className="w-full bg-surface-container-lowest py-16 px-4 md:px-8 border-y border-outline-variant/30">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-mono text-primary uppercase tracking-widest block mb-1.5 font-semibold">
              ECOSYSTEM DOMAINS
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              Explore In-Demand Tech Categories
            </h2>
          </div>
          <Link
            href="/jobs"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-secondary transition-colors group"
          >
            <span>Browse all categories</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.title}
                href={`/jobs?category=${cat.slug}`}
                className="group p-6 rounded-2xl bg-surface-container border border-outline-variant/40 hover:bg-surface-container-high hover:border-primary/50 transition-all duration-200 flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-surface-container-highest flex items-center justify-center text-primary mb-4 group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-on-surface mb-1.5 group-hover:text-primary transition-colors">
                    {cat.title}
                  </h3>
                  <p className="text-xs text-on-surface-variant mb-6 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs py-2 bg-surface-container-lowest/70 rounded-lg px-3 mb-3 border border-outline-variant/30 font-mono">
                    <span className="text-primary font-semibold">{cat.jobs}</span>
                    <span className="text-on-surface-variant">{cat.rates}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-[11px] font-mono text-outline">
                    {cat.tags.map((tag) => (
                      <span key={tag} className="px-2 py-0.5 rounded bg-surface-container-highest">
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
