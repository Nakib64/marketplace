import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateHomepageCmsDto } from '../dto/update-homepage-cms.dto.js';

const DEFAULT_METRICS = [
  { value: '৳50M+', label: 'Protected Payments', sub: 'Completed projects', color: 'text-primary' },
  { value: '99.4%', label: 'Dispute-Free Rate', sub: 'Successful contracts', color: 'text-secondary' },
  { value: '14,000+', label: 'Verified Pros', sub: 'Technical talent', color: 'text-on-surface' },
  { value: '< 5 min', label: 'Average Payout', sub: 'Instant mobile releases', color: 'text-primary-container' },
];

const DEFAULT_TESTIMONIALS = [
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

const DEFAULT_BRANDS = ['Microsoft', 'Airbnb', 'Automattic', 'Bissell', 'GoDaddy'];

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomepageCms() {
    let cms = await this.prisma.homepageCms.findUnique({
      where: { id: 'default' },
    });

    if (!cms) {
      cms = await this.prisma.homepageCms.create({
        data: {
          id: 'default',
          heroBadge: 'Banglance Marketplace • 100% Milestone Protection',
          heroTitle: 'How work should work',
          heroSubtitle:
            'Forget the old rules. You can have the best software engineers, designers, and specialists. Right now. Right here.',
          heroPrimaryCtaText: 'Find talent',
          heroPrimaryCtaLink: '/freelancers',
          heroSecondaryCtaText: 'Find work',
          heroSecondaryCtaLink: '/jobs',
          showcaseBadge: 'FOR CLIENTS & TALENT',
          showcaseTitle: 'Up your work game, it’s free',
          showcaseDescription:
            'Access top 1% technical talent in Bangladesh. Hire with 100% financial protection and zero payment clearance delay.',
          metrics: DEFAULT_METRICS,
          testimonials: DEFAULT_TESTIMONIALS,
          trustedBrands: DEFAULT_BRANDS,
          clientCtaTitle: 'Find talent your way',
          clientCtaText:
            'Work with the largest network of independent professionals and get things done—from quick turnarounds to complex fullstack transformations.',
          talentCtaTitle: 'Find great work',
          talentCtaText:
            'Meet clients you’re excited to work with and take your career or business to new heights with 100% milestone payment protection.',
        },
      });
    }

    return cms;
  }

  async updateHomepageCms(dto: UpdateHomepageCmsDto) {
    const dataToSave: any = { ...dto };
    if (dto.metrics) dataToSave.metrics = dto.metrics;
    if (dto.testimonials) dataToSave.testimonials = dto.testimonials;
    if (dto.trustedBrands) dataToSave.trustedBrands = dto.trustedBrands;

    return this.prisma.homepageCms.upsert({
      where: { id: 'default' },
      create: {
        id: 'default',
        ...dataToSave,
      },
      update: dataToSave,
    });
  }
}
