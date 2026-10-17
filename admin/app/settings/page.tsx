import type { Metadata } from 'next';
import { EnterpriseSettingsSubNav } from '@/components/settings/EnterpriseSettingsSubNav';
import { CircuitBreakersControl } from '@/components/settings/CircuitBreakersControl';
import { PlatformFeeSetting } from '@/components/settings/PlatformFeeSetting';
import { Sliders, Activity, Database, Server, Cpu } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Platform Controls & Circuit Breakers | Banglance Admin',
  description: 'Emergency circuit breakers, platform maintenance, and commission configuration.',
};

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-outline-variant pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-primary" />
            <h1 className="text-xl font-bold tracking-tight text-on-surface">Platform Controls & Circuit Breakers</h1>
          </div>
          <p className="text-xs text-on-surface-variant mt-1">
            Toggle mission-critical emergency kill switches, maintenance mode, and calibrate platform commission parameters.
          </p>
        </div>
      </div>

      <EnterpriseSettingsSubNav />

      {/* Operational Infrastructure Health Card */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-outline-variant shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold">
              <Database className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Neon PostgreSQL</span>
              <span className="text-[10px] text-outline block">Managed Primary DB</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            ONLINE
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-outline-variant shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center font-bold">
              <Server className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">Upstash Redis</span>
              <span className="text-[10px] text-outline block">Circuit Breaker & Queues</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            ACTIVE
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-outline-variant shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">NestJS Core API</span>
              <span className="text-[10px] text-outline block">Port 4000 Daemon</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            HEALTHY
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-outline-variant shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center font-bold">
              <Activity className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-xs font-bold text-on-surface block">SSLCommerz / bKash</span>
              <span className="text-[10px] text-outline block">Payment Gateway Rails</span>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
            READY
          </span>
        </div>
      </div>

      <CircuitBreakersControl />
      <PlatformFeeSetting />
    </div>
  );
}
