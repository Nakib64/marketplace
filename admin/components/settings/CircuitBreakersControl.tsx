'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { adminSettingsApi } from '@/lib/api/adminApi';
import { ShieldAlert, Power, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function CircuitBreakersControl() {
  const [toggling, setToggling] = useState<string | null>(null);

  const { data: breakers, isLoading, refetch } = useQuery({
    queryKey: ['admin-circuit-breakers'],
    queryFn: () => adminSettingsApi.getCircuitBreakers(),
  });

  const handleToggle = async (type: 'payouts' | 'escrow' | 'maintenance', currentState: boolean) => {
    const newState = !currentState;
    setToggling(type);
    try {
      await adminSettingsApi.toggleCircuitBreaker(type, newState, 'Operator toggled switch from command center');
      toast.success(`Circuit breaker [${type}] switched to ${newState ? 'TRIPPED (HALTED)' : 'NORMAL'}`);
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to toggle circuit breaker');
    } finally {
      setToggling(null);
    }
  };

  const switches = [
    {
      type: 'payouts' as const,
      name: 'Payouts Kill Switch',
      desc: 'Instantly halts all automated & manual withdrawal approvals across bKash/Nagad.',
      isTripped: breakers?.payouts || false,
    },
    {
      type: 'escrow' as const,
      name: 'Escrow Lock Kill Switch',
      desc: 'Freezes incoming SSLCommerz deposit transactions and contract escrow creations.',
      isTripped: breakers?.escrow || false,
    },
    {
      type: 'maintenance' as const,
      name: 'Platform Maintenance Mode',
      desc: 'Suspends client & freelancer marketplace traffic with 503 while maintaining staff access.',
      isTripped: breakers?.maintenance || false,
    },
  ];

  return (
    <div className="rounded-2xl border border-outline-variant bg-white p-6 shadow-2xs">
      <div className="flex items-center gap-2 border-b border-outline-variant pb-3 mb-5 text-error">
        <ShieldAlert className="h-5 w-5" />
        <h2 className="text-base font-bold text-on-surface">Emergency Circuit Breakers</h2>
      </div>

      <div className="space-y-4">
        {switches.map((sw) => (
          <div
            key={sw.type}
            className={cn(
              'flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border transition-all',
              sw.isTripped ? 'bg-error-container/40 border-error/30' : 'bg-surface-container-low border-outline-variant/60'
            )}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-on-surface">{sw.name}</span>
                <span className={cn(
                  'text-xs font-semibold',
                  sw.isTripped ? 'text-error' : 'text-primary'
                )}>
                  • {sw.isTripped ? 'Halted' : 'Online'}
                </span>
              </div>
              <p className="text-xs text-on-surface-variant max-w-xl">{sw.desc}</p>
            </div>

            <button
              onClick={() => handleToggle(sw.type, sw.isTripped)}
              disabled={isLoading || toggling === sw.type}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer disabled:opacity-50 shrink-0',
                sw.isTripped
                  ? 'bg-surface-container hover:bg-surface-container-high text-on-surface border border-outline-variant'
                  : 'bg-error hover:bg-error/90 text-white shadow-2xs'
              )}
            >
              {toggling === sw.type ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Power className="h-3.5 w-3.5" />
              )}
              {sw.isTripped ? 'Disengage Switch' : 'Trip Kill Switch'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
