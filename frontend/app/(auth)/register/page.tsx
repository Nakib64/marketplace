import type { Metadata } from 'next';
import { RegisterView } from '@/features/auth/components/RegisterView';

export const metadata: Metadata = {
  title: 'Create an Account | Banglance',
  description: 'Join Banglance to hire pre-vetted talent or find freelance work with automated escrow protection.',
};

export default function RegisterPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient Top Glow Halo from Stitch */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      {/* Pure Client Component Leaf */}
      <RegisterView />
    </div>
  );
}
