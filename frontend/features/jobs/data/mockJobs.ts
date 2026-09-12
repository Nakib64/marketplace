import { Job } from '../types/jobsTypes';

export const FALLBACK_JOBS: Job[] = [
  {
    id: 'job-1',
    title: 'Senior NestJS & Distributed Backend Architect',
    description:
      'Implement high-throughput Redis sliding-window rate limiters, BullMQ background moderation workers, and SSLCommerz escrow webhook listeners with Prisma ORM.',
    budget: 8500,
    status: 'OPEN',
    categoryName: 'DeFi & Fullstack',
    skills: ['NestJS', 'PostgreSQL', 'Redis', 'Docker'],
    clientId: 'client-1',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    client: {
      id: 'client-1',
      email: 'hirer@apexvaults.io',
      createdAt: new Date().toISOString(),
      clientProfile: {
        companyName: 'Apex Vaults Inc.',
        rating: 4.9,
        totalJobPosts: 14,
        totalSpent: 84000,
      },
    },
    _count: { proposals: 12 },
  },
  {
    id: 'job-2',
    title: 'Lead UI/UX Product Designer (Fintech & Escrow)',
    description:
      'Revamp mobile and desktop dashboard workflows for dual-actor freelance marketplace. Create double-blind review system flows and bKash/Nagad withdrawal modals.',
    budget: 4200,
    status: 'OPEN',
    categoryName: 'Design Systems',
    skills: ['Figma', 'Design Systems', 'Prototyping', 'Fintech'],
    clientId: 'client-2',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    client: {
      id: 'client-2',
      email: 'design@synthetix.design',
      createdAt: new Date().toISOString(),
      clientProfile: {
        companyName: 'Synthetix Studio',
        rating: 5.0,
        totalJobPosts: 8,
        totalSpent: 36000,
      },
    },
    _count: { proposals: 8 },
  },
  {
    id: 'job-3',
    title: 'Next.js 16 App Router & Socket.io Real-Time Engineer',
    description:
      'Build responsive 2-column live messaging hub with typing indicators, optimistic UI updates, and headless TanStack Query v5 state management.',
    budget: 5200,
    status: 'OPEN',
    categoryName: 'Frontend Architecture',
    skills: ['Next.js 16', 'React 19', 'Socket.io', 'Tailwind v4'],
    clientId: 'client-3',
    createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    client: {
      id: 'client-3',
      email: 'tech@banglance.dev',
      createdAt: new Date().toISOString(),
      clientProfile: {
        companyName: 'Banglance Core',
        rating: 4.8,
        totalJobPosts: 22,
        totalSpent: 120000,
      },
    },
    _count: { proposals: 5 },
  },
];
