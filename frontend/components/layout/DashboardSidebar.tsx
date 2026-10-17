'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FileCheck2,
  MessageSquare,
  Wallet,
  Receipt,
  ShieldAlert,
  PlusCircle,
  UserCheck,
  LogOut,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';

interface DashboardSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isHovered, setIsHovered] = useState(false);

  const isClient = user?.role === 'CLIENT';
  const roleLabel = isClient ? 'Client' : 'Freelancer';
  const portalSubtitle = isClient ? 'Client Workspace' : 'Freelancer Portal';
  const displayName = user?.clientProfile?.companyName || user?.name || user?.email?.split('@')[0] || 'User';
  const isVerified = user?.isEmailVerified;

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const navSections: NavSection[] = isClient
    ? [
        {
          title: 'Workspace',
          items: [
            {
              label: 'Dashboard',
              href: '/client/jobs',
              icon: LayoutDashboard,
              active: pathname === '/client/jobs' || pathname === '/client',
            },
            {
              label: 'Post a Job',
              href: '/client/jobs/new',
              icon: PlusCircle,
              active: pathname === '/client/jobs/new',
            },
            {
              label: 'Find Talent',
              href: '/freelancers',
              icon: Users,
              active: pathname.startsWith('/freelancers'),
            },
            {
              label: 'Active Contracts',
              href: '/contracts',
              icon: FileCheck2,
              active: pathname.startsWith('/contracts'),
            },
            {
              label: 'Messages',
              href: '/messages',
              icon: MessageSquare,
              active: pathname.startsWith('/messages'),
            },
          ],
        },
        {
          title: 'Payments & Activity',
          items: [
            {
              label: 'Wallet & Funds',
              href: '/wallet',
              icon: Wallet,
              active: pathname.startsWith('/wallet'),
            },
            {
              label: 'Transactions',
              href: '/transactions',
              icon: Receipt,
              active: pathname.startsWith('/transactions'),
            },
            {
              label: 'Help & Resolutions',
              href: '/disputes',
              icon: ShieldAlert,
              active: pathname.startsWith('/disputes'),
            },
          ],
        },
        {
          title: 'Account',
          items: [
            {
              label: 'Company Settings',
              href: '/client/settings',
              icon: UserCheck,
              active: pathname.startsWith('/client/settings') || pathname.startsWith('/settings'),
            },
          ],
        },
      ]
    : [
        {
          title: 'Workspace',
          items: [
            {
              label: 'Dashboard',
              href: '/freelancer/dashboard',
              icon: LayoutDashboard,
              active: pathname === '/freelancer/dashboard' || pathname === '/freelancer',
            },
            {
              label: 'Find Work',
              href: '/jobs',
              icon: Briefcase,
              active: pathname === '/jobs' || pathname.startsWith('/jobs/'),
            },
            {
              label: 'Browse Talent',
              href: '/freelancers',
              icon: Users,
              active: pathname.startsWith('/freelancers'),
            },
            {
              label: 'Active Contracts',
              href: '/contracts',
              icon: FileCheck2,
              active: pathname.startsWith('/contracts'),
            },
            {
              label: 'Messages',
              href: '/messages',
              icon: MessageSquare,
              active: pathname.startsWith('/messages'),
            },
          ],
        },
        {
          title: 'Payments & Activity',
          items: [
            {
              label: 'Wallet & Funds',
              href: '/wallet',
              icon: Wallet,
              active: pathname.startsWith('/wallet'),
            },
            {
              label: 'Transactions',
              href: '/transactions',
              icon: Receipt,
              active: pathname.startsWith('/transactions'),
            },
            {
              label: 'Help & Resolutions',
              href: '/disputes',
              icon: ShieldAlert,
              active: pathname.startsWith('/disputes'),
            },
          ],
        },
        {
          title: 'Account',
          items: [
            {
              label: 'Profile Settings',
              href: '/freelancer/profile/edit',
              icon: UserCheck,
              active: pathname.startsWith('/freelancer/profile') || pathname.startsWith('/settings'),
            },
          ],
        },
      ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden transition-opacity"
        />
      )}

      {/* Sidebar: Fixed Drawer on Mobile, Smooth Animated Hover Rail on Desktop */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-white border-r border-outline-variant flex flex-col justify-between select-none transition-all duration-300 ease-in-out md:relative md:inset-auto md:translate-x-0',
          isOpen ? 'translate-x-0 w-[296px] shadow-2xl' : '-translate-x-full md:translate-x-0',
          isHovered ? 'md:w-[296px] md:shadow-xl' : 'md:w-[76px]'
        )}
      >
        <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
          {/* Brand Header */}
          <div
            className={cn(
              'h-16 border-b border-outline-variant flex items-center shrink-0 transition-all duration-300',
              isHovered || isOpen ? 'px-6 gap-3 justify-between' : 'px-0 justify-center'
            )}
          >
            <Link
              href="/"
              className={cn(
                'flex items-center transition-all duration-300',
                isHovered || isOpen ? 'gap-3 min-w-0' : 'justify-center'
              )}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#00b377] flex items-center justify-center font-bold text-white text-base shadow-[0_0_15px_-3px_rgba(20,168,0,0.35)] shrink-0">
                B
              </div>
              <div
                className={cn(
                  'overflow-hidden transition-all duration-300 whitespace-nowrap min-w-0',
                  isHovered || isOpen ? 'opacity-100 max-w-[210px]' : 'opacity-0 max-w-0 pointer-events-none'
                )}
              >
                <span className="text-lg font-bold tracking-tight text-on-surface leading-tight block truncate">
                  bang<span className="text-primary font-black">lance</span>
                </span>
                <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider block truncate">
                  {portalSubtitle}
                </span>
              </div>
            </Link>

            {/* Mobile close button */}
            <button
              type="button"
              onClick={onClose}
              className="md:hidden p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav
            className={cn(
              'space-y-4 flex-1 transition-all duration-300',
              isHovered || isOpen ? 'p-3.5' : 'p-2.5'
            )}
          >
            {navSections.map((section, sIndex) => (
              <div key={section.title} className="space-y-1">
                {/* Section Title */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 whitespace-nowrap',
                    isHovered || isOpen
                      ? 'pt-2 pb-1 px-3 opacity-100 max-h-10'
                      : 'opacity-0 max-h-0 pointer-events-none'
                  )}
                >
                  <span className="text-[11px] uppercase font-bold tracking-wider text-outline">
                    {section.title}
                  </span>
                </div>

                {!isHovered && !isOpen && sIndex > 0 && (
                  <hr className="my-2 border-outline-variant/60" />
                )}

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClose}
                        title={!isHovered && !isOpen ? item.label : undefined}
                        className={cn(
                          'flex items-center rounded-xl text-sm transition-all duration-300 cursor-pointer font-medium',
                          isHovered || isOpen
                            ? 'gap-3 px-3.5 py-2.5 justify-start'
                            : 'px-0 py-2.5 justify-center',
                          item.active
                            ? 'bg-surface-container-high text-primary font-bold shadow-2xs'
                            : 'text-on-surface hover:bg-surface-container hover:text-primary'
                        )}
                      >
                        <Icon
                          className={cn(
                            'h-5 w-5 shrink-0 transition-colors',
                            item.active ? 'text-primary' : 'text-on-surface-variant'
                          )}
                        />
                        <span
                          className={cn(
                            'overflow-hidden whitespace-nowrap transition-all duration-300 truncate',
                            isHovered || isOpen
                              ? 'opacity-100 max-w-[210px]'
                              : 'opacity-0 max-w-0 pointer-events-none'
                          )}
                        >
                          {item.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* User Profile & Logout Footer */}
          <div
            className={cn(
              'border-t border-outline-variant bg-surface-container-low/50 shrink-0 transition-all duration-300 flex flex-col justify-center',
              isHovered || isOpen ? 'p-3.5 gap-2.5' : 'p-2.5 items-center'
            )}
          >
            {/* User row */}
            <div
              className={cn(
                'flex items-center transition-all duration-300 w-full',
                isHovered || isOpen ? 'justify-between gap-2' : 'justify-center flex-col gap-1'
              )}
            >
              <Link
                href={isClient ? '/client/settings' : '/freelancer/profile/edit'}
                onClick={onClose}
                title={!isHovered && !isOpen ? displayName : undefined}
                className={cn(
                  'flex items-center min-w-0 group hover:opacity-90 transition-opacity',
                  isHovered || isOpen ? 'gap-2.5 flex-1' : 'justify-center'
                )}
              >
                <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant/40 flex items-center justify-center shrink-0 font-bold text-primary text-xs uppercase shadow-2xs">
                  {displayName.charAt(0).toUpperCase()}
                </div>
                <div
                  className={cn(
                    'flex flex-col min-w-0 overflow-hidden transition-all duration-300',
                    isHovered || isOpen
                      ? 'opacity-100 max-w-[160px]'
                      : 'opacity-0 max-w-0 pointer-events-none'
                  )}
                >
                  <span className="text-xs font-semibold text-on-surface truncate capitalize">
                    {displayName}
                  </span>
                  <span className="text-[10px] text-primary flex items-center gap-1 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {roleLabel}
                  </span>
                </div>
              </Link>

              {/* Sign Out Button */}
              <button
                type="button"
                onClick={handleLogout}
                title="Sign Out"
                className={cn(
                  'p-1.5 rounded-lg text-on-surface-variant hover:text-error hover:bg-surface-container transition-colors cursor-pointer',
                  isHovered || isOpen ? 'block' : 'mt-1'
                )}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>

            {/* Email Verified Badge (Expanded state only) */}
            <div
              className={cn(
                'overflow-hidden transition-all duration-300',
                isHovered || isOpen ? 'opacity-100 max-h-12' : 'opacity-0 max-h-0 pointer-events-none'
              )}
            >
              <div className="px-2.5 py-1.5 rounded-lg bg-surface-container border border-outline-variant/30 flex items-center justify-between text-xs">
                <span className="text-on-surface-variant text-[11px]">Email:</span>
                <span
                  className={cn(
                    'font-semibold text-[11px] flex items-center gap-1',
                    isVerified ? 'text-primary' : 'text-amber-600'
                  )}
                >
                  <span className="material-symbols-outlined text-[14px]">
                    {isVerified ? 'verified' : 'mail'}
                  </span>
                  {isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
