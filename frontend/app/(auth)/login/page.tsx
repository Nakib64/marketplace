import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Banglance',
  description: 'Sign in to continue to Banglance - your secure freelance marketplace.',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f5f8f5] overflow-hidden">
      {/* Decorative Organic Ambient Shapes matching brand green aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14a800]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#108a00]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      
      {/* Subtle top navigation back to homepage */}
      <div className="w-full max-w-[960px] flex items-center justify-between mb-4 relative z-10 px-2">
        <Link
          href="/"
          className="text-xs text-slate-500 hover:text-[#14a800] transition-colors flex items-center gap-1.5 font-medium"
        >
          <span>←</span>
          <span>Back to Banglance</span>
        </Link>
      </div>

      {/* Main Split Authentication Card */}
      <div className="w-full max-w-[960px] bg-white rounded-3xl sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(20,168,0,0.12)] border border-slate-100/80 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[640px]">
        {/* Left Column: Form Panel */}
        <div className="flex flex-col h-full">
          <LoginForm />
        </div>

        {/* Right Column: Hero Image Panel */}
        <div className="hidden md:block relative w-full h-full min-h-[640px] bg-slate-100 overflow-hidden">
          <Image
            src="/images/login-hero.jpg"
            alt="Freelancer collaborating on Banglance"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover object-center"
          />
          {/* Subtle gradient overlay to merge naturally with borders */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
