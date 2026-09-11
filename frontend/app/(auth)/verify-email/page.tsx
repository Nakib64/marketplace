import React from 'react';
import Link from 'next/link';
import { MailCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-surface-container rounded-2xl border border-outline-variant/50 p-6 md:p-8 shadow-xl text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 text-primary mx-auto flex items-center justify-center">
          <MailCheck className="w-7 h-7" />
        </div>

        <div>
          <h1 className="text-xl font-bold text-on-surface">Verify Your Email Address</h1>
          <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
            In accordance with platform financial compliance, posting jobs, bidding on proposals, and withdrawing funds require a verified email address.
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-surface-container-low border border-outline-variant/40 flex items-start gap-2.5 text-left text-xs">
          <ShieldAlert className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <span className="text-on-surface-variant leading-relaxed">
            A verification link was sent to your registered inbox. Please click the confirmation link to activate full account capabilities.
          </span>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Link href="/">
            <Button variant="outline" className="w-full text-xs">
              Return to Homepage
            </Button>
          </Link>
          <Link href="/login" className="text-xs text-primary hover:underline flex items-center justify-center gap-1">
            <span>Sign into another account</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
