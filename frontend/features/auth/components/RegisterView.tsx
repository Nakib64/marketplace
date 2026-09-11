'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserRole } from '@/types/user';
import { RolePicker } from './RolePicker';
import { RegisterForm } from './RegisterForm';

export function RegisterView() {
  const [selectedRole, setSelectedRole] = useState<UserRole>('CLIENT');

  return (
    <div className="w-full max-w-2xl relative z-10 flex flex-col items-center">
      {/* Stage Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container-low border border-outline-variant/40 text-[11px] font-mono text-on-surface-variant mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
        <span>STAGE 01 // ROLE PROVISIONING</span>
      </div>

      {/* Title */}
      <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface text-center mb-2">
        Join Bang<span className="text-primary">lance</span> Network
      </h1>
      <p className="text-xs md:text-sm text-on-surface-variant text-center max-w-lg mb-8">
        Select your primary role in the marketplace. You can post bounties or provide freelance services with escrow protection.
      </p>

      {/* Dual Role Selector Cards */}
      <div className="w-full mb-8">
        <RolePicker selectedRole={selectedRole} onSelectRole={setSelectedRole} />
      </div>

      {/* Form Container */}
      <div className="w-full bg-surface-container rounded-2xl border border-outline-variant/50 p-6 md:p-8 shadow-xl">
        <h2 className="text-sm font-bold text-on-surface uppercase tracking-wider mb-4 font-mono">
          Account Credentials
        </h2>
        <RegisterForm selectedRole={selectedRole} />

        {/* Switch to Login */}
        <div className="mt-6 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Already have an account?</span>
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign In →
          </Link>
        </div>
      </div>
    </div>
  );
}
