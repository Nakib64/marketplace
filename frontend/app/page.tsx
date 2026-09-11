import type { Metadata } from 'next';
import { HeroSection } from '@/features/home/components/HeroSection';
import { CategoryGrid } from '@/features/home/components/CategoryGrid';
import { FeaturedJobs } from '@/features/home/components/FeaturedJobs';
import { EscrowExplainer } from '@/features/home/components/EscrowExplainer';
import { Testimonials } from '@/features/home/components/Testimonials';
import { BottomCTA } from '@/features/home/components/BottomCTA';

export const metadata: Metadata = {
  title: 'Banglance | Hire Top Talent & Find Freelance Work with Escrow Protection',
  description:
    'Join Banglance, the premier freelance marketplace with 100% financial escrow protection, SSLCommerz gateway, and automated local mobile payouts via bKash and Nagad.',
};

export default function HomePage() {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <HeroSection />
      <CategoryGrid />
      <FeaturedJobs />
      <EscrowExplainer />
      <Testimonials />
      <BottomCTA />
    </div>
  );
}
