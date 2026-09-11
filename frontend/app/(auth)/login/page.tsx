import type { Metadata } from 'next';
import { LoginForm } from '@/features/auth/components/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | Banglance',
  description: 'Sign in to access your freelance projects, escrow contracts, and wallet.',
};

export default function LoginPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12 overflow-hidden">
      {/* Ambient Top Glow Halo from Stitch */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Security Badge */}
        <div className="flex items-center justify-between px-3.5 py-1.5 mb-4 bg-surface-container-low border border-outline-variant/40 rounded-lg text-xs font-mono text-on-surface-variant">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span>SSLCommerz Escrow Gateway</span>
          </div>
          <span className="text-outline">TLS 1.3</span>
        </div>

        {/* Header Titles */}
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface">
            Sign In to Bang<span className="text-primary">lance</span>
          </h1>
          <p className="text-xs md:text-sm text-on-surface-variant mt-1.5">
            Access your secure escrow contracts and talent workspace
          </p>
        </div>

        {/* Login Form */}
        <LoginForm />
      </div>
    </div>
  );
}
