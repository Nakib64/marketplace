'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  WalletCards,
  Scale,
  Users,
  Sliders,
  History,
  FolderTree,
  Tag,
  Briefcase,
  Globe,
  ChevronDown,
  ChevronRight,
  UserCheck,
  Building,
  Terminal,
  Paintbrush,
  Brain,
  AlertTriangle,
  Layers,
  Sparkles,
  BarChart3,
  MessageSquare,
  BadgeCheck,
  TrendingUp,
  FileText,
  Settings,
  ShieldCheck,
  FileCheck,
  Bell,
} from 'lucide-react';
import { cn } from '@/lib/utils';


interface NavGroup {
  id: string;
  label: string;
  icon: any;
  baseHref: string;
  items: Array<{
    label: string;
    href: string;
    icon?: any;
    badge?: string;
  }>;
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'analytics',
    label: 'Analytics & Insights',
    icon: TrendingUp,
    baseHref: '/analytics',
    items: [
      { label: 'Executive Radar', href: '/analytics', icon: TrendingUp },
      { label: 'Freelancers', href: '/analytics/freelancers', icon: Users },
      { label: 'Clients & Spend', href: '/analytics/clients', icon: Building },
      { label: 'Cash Flow & Vault', href: '/analytics/cash-flow', icon: WalletCards },
      { label: 'Job Postings', href: '/analytics/jobs', icon: Briefcase },
      { label: 'Proposals & Bids', href: '/analytics/proposals', icon: FileText },
    ],
  },
  {
    id: 'users',
    label: 'User Governance',
    icon: Users,
    baseHref: '/users',
    items: [
      { label: 'All Accounts', href: '/users', icon: Users },
      { label: 'Freelancers', href: '/users/freelancers', icon: UserCheck },

      { label: 'Clients & Buyers', href: '/users/clients', icon: Building },
    ],
  },
  {
    id: 'jobs',
    label: 'Job Moderation',
    icon: Briefcase,
    baseHref: '/jobs',
    items: [
      { label: 'All Job Postings', href: '/jobs', icon: Briefcase },
      { label: 'Dev & Engineering', href: '/jobs/development', icon: Terminal },
      { label: 'Design & Creative', href: '/jobs/design', icon: Paintbrush },
      { label: 'AI & Data Science', href: '/jobs/ai', icon: Brain },
      { label: 'Flagged & Reports', href: '/jobs/flagged', icon: AlertTriangle },
    ],
  },
  {
    id: 'categories',
    label: 'Categories',
    icon: FolderTree,
    baseHref: '/categories',
    items: [
      { label: 'Taxonomy Tree', href: '/categories', icon: FolderTree },
      { label: 'Primary Categories', href: '/categories/main', icon: Layers },
      { label: 'Subcategories', href: '/categories/subcategories', icon: ChevronRight },
    ],
  },
  {
    id: 'skills',
    label: 'Skills Directory',
    icon: Tag,
    baseHref: '/skills',
    items: [
      { label: 'All Skill Tags', href: '/skills', icon: Tag },
      { label: 'Tech & Engineering', href: '/skills/tech', icon: Terminal },
      { label: 'Design & Creative', href: '/skills/design', icon: Paintbrush },
      { label: 'AI & Machine Learning', href: '/skills/ai', icon: Brain },
      { label: 'Business & Writing', href: '/skills/business', icon: BadgeCheck },
    ],
  },
  {
    id: 'cms',
    label: 'Homepage CMS',
    icon: Globe,
    baseHref: '/cms',
    items: [
      { label: 'CMS Overview', href: '/cms', icon: Globe },
      { label: 'Hero & Showcase', href: '/cms/hero', icon: Sparkles },
      { label: 'Platform Metrics', href: '/cms/metrics', icon: BarChart3 },
      { label: 'Customer Stories', href: '/cms/testimonials', icon: MessageSquare },
      { label: 'Trusted Brands', href: '/cms/brands', icon: BadgeCheck },
      { label: 'Bottom CTAs', href: '/cms/cta', icon: Layers },
    ],
  },
  {
    id: 'finance',
    label: 'Finance & Risk',
    icon: WalletCards,
    baseHref: '/payouts',
    items: [
      { label: 'Payouts & Vault', href: '/payouts', icon: WalletCards },
      { label: 'Dispute Arbitration', href: '/disputes', icon: Scale },
    ],
  },
  {
    id: 'settings',
    label: 'Enterprise Settings',
    icon: Settings,
    baseHref: '/settings',
    items: [
      { label: 'General & Circuit Breakers', href: '/settings', icon: Sliders },
      { label: 'Security & Access (SSO/MFA)', href: '/settings/security', icon: ShieldCheck },
      { label: 'Escrow & Gateways', href: '/settings/billing', icon: WalletCards },
      { label: 'KYC & Compliance', href: '/settings/compliance', icon: FileCheck },
      { label: 'Webhooks & Alerts', href: '/settings/notifications', icon: Bell },
    ],
  },
  {
    id: 'audit',
    label: 'Platform Audit',
    icon: History,
    baseHref: '/audit',
    items: [
      { label: 'Audit Trail & Logs', href: '/audit', icon: History },
    ],
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  // Track which dropdowns are open
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    NAV_GROUPS.forEach((g) => {
      if (
        pathname.startsWith(g.baseHref) ||
        (g.id === 'finance' && pathname.startsWith('/disputes')) ||
        (g.id === 'audit' && pathname.startsWith('/audit')) ||
        (g.id === 'settings' && pathname.startsWith('/settings'))
      ) {
        initial[g.id] = true;
      }
    });
    return initial;
  });

  // Automatically expand group when navigating to it
  useEffect(() => {
    NAV_GROUPS.forEach((g) => {
      const isCurrentGroup =
        pathname.startsWith(g.baseHref) ||
        (g.id === 'finance' && pathname.startsWith('/disputes')) ||
        (g.id === 'audit' && pathname.startsWith('/audit')) ||
        (g.id === 'settings' && pathname.startsWith('/settings'));
      if (isCurrentGroup) {
        setOpenGroups((prev) => ({ ...prev, [g.id]: true }));
      }
    });
  }, [pathname]);

  const [isHovered, setIsHovered] = useState(false);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'flex-shrink-0 border-r border-outline-variant bg-white flex flex-col justify-between select-none transition-all duration-300 ease-in-out z-30',
        isHovered ? 'w-[296px] shadow-xl' : 'w-[76px]'
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto overflow-x-hidden">
        {/* Brand Header */}
        <div
          className={cn(
            'h-16 border-b border-outline-variant flex items-center shrink-0 transition-all duration-300',
            isHovered ? 'px-6 gap-3' : 'px-0 justify-center'
          )}
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-[#00b377] flex items-center justify-center font-bold text-white text-base shadow-[0_0_15px_-3px_rgba(20,168,0,0.35)] shrink-0">
            B
          </div>
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 whitespace-nowrap min-w-0',
              isHovered ? 'opacity-100 max-w-[210px]' : 'opacity-0 max-w-0 pointer-events-none'
            )}
          >
            <span className="text-lg font-bold tracking-tight text-on-surface leading-tight block truncate">
              bang<span className="text-primary font-black">lance</span>
            </span>
            <span className="text-xs uppercase font-bold text-on-surface-variant tracking-wider block truncate">
              Admin Gateway
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className={cn('space-y-1.5 flex-1 transition-all duration-300', isHovered ? 'p-3.5' : 'p-2.5')}>
          {/* Dashboard Direct Link */}
          <Link
            href="/dashboard"
            title={!isHovered ? 'Dashboard' : undefined}
            className={cn(
              'flex items-center rounded-xl text-sm transition-all duration-300 cursor-pointer font-bold',
              isHovered ? 'gap-3 px-3.5 py-2.5 justify-start' : 'px-0 py-2.5 justify-center',
              pathname === '/dashboard'
                ? 'bg-surface-container-high text-primary shadow-2xs'
                : 'text-on-surface hover:bg-surface-container'
            )}
          >
            <LayoutDashboard className={cn('h-4.5 w-4.5 shrink-0', pathname === '/dashboard' ? 'text-primary' : 'text-on-surface-variant')} />
            <span
              className={cn(
                'overflow-hidden whitespace-nowrap transition-all duration-300 truncate',
                isHovered ? 'opacity-100 max-w-[210px]' : 'opacity-0 max-w-0 pointer-events-none'
              )}
            >
              Dashboard
            </span>
          </Link>

          {/* Section Divider */}
          <div
            className={cn(
              'overflow-hidden transition-all duration-300 whitespace-nowrap',
              isHovered ? 'pt-2.5 pb-1 px-3 opacity-100 max-h-10' : 'opacity-0 max-h-0 pointer-events-none'
            )}
          >
            <span className="text-xs uppercase font-bold tracking-wider text-outline">
              Platform Sections
            </span>
          </div>

          {!isHovered && <hr className="my-2 border-outline-variant/60" />}

          {/* Group Dropdowns */}
          {NAV_GROUPS.map((group) => {
            const GroupIcon = group.icon;
            const isOpen = openGroups[group.id] ?? false;
            const isGroupActive =
              pathname.startsWith(group.baseHref) ||
              (group.id === 'finance' && pathname.startsWith('/disputes')) ||
              (group.id === 'system' && pathname.startsWith('/audit'));

            return (
              <div key={group.id} className="space-y-1">
                {/* Accordion Trigger */}
                <button
                  type="button"
                  onClick={() => toggleGroup(group.id)}
                  title={!isHovered ? group.label : undefined}
                  className={cn(
                    'w-full flex items-center rounded-xl text-sm transition-all duration-300 cursor-pointer font-bold',
                    isHovered ? 'justify-between px-3.5 py-2.5' : 'justify-center px-0 py-2.5',
                    isGroupActive
                      ? 'text-primary bg-[#eaf5ea]/50'
                      : 'text-on-surface hover:bg-surface-container'
                  )}
                >
                  <div className={cn('flex items-center min-w-0', isHovered ? 'gap-3' : 'justify-center')}>
                    <GroupIcon className={cn('h-4.5 w-4.5 shrink-0', isGroupActive ? 'text-primary' : 'text-on-surface-variant')} />
                    <span
                      className={cn(
                        'overflow-hidden whitespace-nowrap transition-all duration-300 truncate text-left',
                        isHovered ? 'opacity-100 max-w-[185px]' : 'opacity-0 max-w-0 pointer-events-none'
                      )}
                    >
                      {group.label}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300 shrink-0',
                      isHovered ? 'opacity-100 max-w-[30px]' : 'opacity-0 max-w-0 pointer-events-none'
                    )}
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 text-outline" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-outline" />
                    )}
                  </div>
                </button>

                {/* Submenu Items with smooth height & opacity transition */}
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300 ease-in-out border-l-2 ml-5',
                    isHovered && isOpen
                      ? 'max-h-96 opacity-100 pl-4 pr-1 py-1 space-y-1 border-outline-variant/70'
                      : 'max-h-0 opacity-0 py-0 pl-0 pr-0 border-transparent pointer-events-none'
                  )}
                >
                  {group.items.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = pathname === subItem.href;

                    return (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={cn(
                          'flex items-center justify-between px-3 py-2 rounded-xl text-[13px] transition-colors cursor-pointer',
                          isSubActive
                            ? 'bg-primary text-white font-bold shadow-2xs'
                            : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container font-semibold'
                        )}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          {SubIcon && <SubIcon className={cn('h-4 w-4 shrink-0', isSubActive ? 'text-white' : 'text-outline')} />}
                          <span className="truncate">{subItem.label}</span>
                        </div>
                        {subItem.badge && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-surface-container font-bold shrink-0">
                            {subItem.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

