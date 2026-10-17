import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { AdminLoginForm } from '@/components/login/AdminLoginForm';

export const metadata: Metadata = {
  title: 'Staff Gateway | Banglance Admin',
  description: 'Secure operational gateway for platform administrators.',
};

export default function AdminLoginPage() {
  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 bg-[#f5f8f5] overflow-hidden">
      {/* Decorative Organic Ambient Shapes matching brand green aesthetic */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#14a800]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#108a00]/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Subtle top navigation back to public portal */}
      <div className="w-full max-w-[960px] flex items-center justify-between mb-4 relative z-10 px-2">
        <Link
          href="http://localhost:3000"
          className="text-xs text-slate-500 hover:text-[#14a800] transition-colors flex items-center gap-1.5 font-medium"
        >
          <span>←</span>
          <span>Return to Marketplace Portal</span>
        </Link>
      </div>

      {/* Main Split Authentication Card */}
      <div className="w-full max-w-[960px] bg-white rounded-3xl sm:rounded-[32px] shadow-[0_25px_60px_-15px_rgba(20,168,0,0.12)] border border-slate-100/80 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[640px]">
        {/* Left Column: Form Panel */}
        <div className="flex flex-col h-full">
          <AdminLoginForm />
        </div>

        {/* Right Column: Hero Image Panel */}
        <div className="hidden md:block relative w-full h-full min-h-[640px] bg-slate-100 overflow-hidden">
          <Image
            src="/images/login-hero.jpg"
            alt="Banglance Operations Command Center"
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover object-center"
          />
          {/* Subtle gradient overlay to merge naturally with borders */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
