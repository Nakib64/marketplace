'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import { useAuthStore } from '@/stores/useAuthStore';
import { DashboardNavLinks } from './DashboardNavLinks';
import { DashboardUserFooter } from './DashboardUserFooter';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container: Fixed on Desktop, Slide-over Drawer on Mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-surface border-r border-outline-variant/40 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-outline-variant/30 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center font-bold text-surface text-base">
              B
            </div>
            <span className="text-lg font-bold tracking-tight text-on-surface">
              Bang<span className="text-primary">lance</span>
            </span>
          </Link>

          {/* Close button on mobile */}
          <button
            type="button"
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Navigation Links */}
        <div className="flex-1 overflow-y-auto">
          <DashboardNavLinks
            pathname={pathname}
            role={user?.role}
            onItemClick={onClose}
          />
        </div>

        {/* User Profile & Logout Footer */}
        <DashboardUserFooter onLogout={onClose} />
      </aside>
    </>
  );
};
