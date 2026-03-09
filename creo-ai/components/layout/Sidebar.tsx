'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  PenTool,
  Settings,
  BarChart3,
  Users,
  FileText,
  HelpCircle,
  LogOut,
  X,
  Sparkles,
  History,
  TrendingUp
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
  color?: string;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-[18px] w-[18px]" />,
    color: 'teal',
  },
  {
    label: 'Create',
    href: '/create',
    icon: <PenTool className="h-[18px] w-[18px]" />,
    color: 'violet',
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-[18px] w-[18px]" />,
    color: 'amber',
  },
  {
    label: 'Content',
    href: '/content',
    icon: <FileText className="h-[18px] w-[18px]" />,
    badge: 'New',
    color: 'teal',
  },
  {
    label: 'Team',
    href: '/team',
    icon: <Users className="h-[18px] w-[18px]" />,
    color: 'violet',
  },
  {
    label: 'History',
    href: '/history',
    icon: <History className="h-[18px] w-[18px]" />,
    color: 'teal',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-[18px] w-[18px]" />,
    color: 'gray',
  },
];

const bottomItems: SidebarItem[] = [
  {
    label: 'Help',
    href: '/help',
    icon: <HelpCircle className="h-[18px] w-[18px]" />,
    color: 'gray',
  },
];

// per-item accent maps
const iconColors: Record<string, string> = {
  teal: 'text-teal-600',
  violet: 'text-violet-600',
  amber: 'text-amber-600',
  gray: 'text-slate-500',
};
const iconBgColors: Record<string, string> = {
  teal: 'from-teal-400/20 to-teal-500/10',
  violet: 'from-violet-400/20 to-violet-500/10',
  amber: 'from-amber-400/20 to-amber-500/10',
  gray: 'from-slate-300/20 to-slate-400/10',
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const sidebarVariants = {
    open: { width: '15.5rem', transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] as const } },
    closed: { width: '4.5rem', transition: { duration: 0.32, ease: [0.4, 0, 0.2, 1] as const } },
  };

  const labelVariants = {
    open: { opacity: 1, x: 0, transition: { delay: 0.08, duration: 0.18 } },
    closed: { opacity: 0, x: -14, transition: { duration: 0.14 } },
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={cn(
          'fixed left-0 top-0 h-screen z-50 flex flex-col',
          'lg:sticky lg:top-0 lg:h-screen lg:shrink-0',
          'transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          // Glass sidebar surface
          'bg-white/80 backdrop-blur-xl border-r border-white/60',
        )}
        style={{
          boxShadow: '4px 0 30px rgba(0,0,0,0.06), 1px 0 0 rgba(255,255,255,0.8) inset',
        }}
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      >
        {/* Decorative teal orb in sidebar */}
        <div
          className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(20,184,166,0.12) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }}
        />

        {/* ── Brand Header ── */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-100/80 min-h-[64px]">
          <motion.div
            className="flex items-center gap-3 overflow-hidden"
            variants={labelVariants}
            animate={isOpen ? 'open' : 'closed'}
            initial={false}
          >
            {/* Logo mark */}
            <div
              className="relative w-9 h-9 rounded-xl flex-shrink-0 flex items-center justify-center shadow-md"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)',
                boxShadow: '0 4px 12px rgba(20,184,166,0.35)',
              }}
            >
              <Sparkles className="w-4.5 h-4.5 text-white" />
              {/* Subtle shine */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/30 to-transparent" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold text-[15px] text-slate-900 tracking-tight">CREO</span>
              <span
                className="text-[10px] font-semibold tracking-widest uppercase"
                style={{
                  background: 'linear-gradient(90deg, #14b8a6, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                AI Studio
              </span>
            </div>
          </motion.div>

          {/* Collapsed state logo (only icon) */}
          {!isOpen && (
            <div
              className="mx-auto w-9 h-9 rounded-xl flex items-center justify-center shadow-md"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)',
                boxShadow: '0 4px 12px rgba(20,184,166,0.35)',
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          )}

          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors lg:hidden ml-auto"
          >
            <X className="h-4 w-4 text-slate-500" />
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          <div className="space-y-0.5">
            {/* Section label */}
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2 pt-1"
                >
                  Navigation
                </motion.p>
              )}
            </AnimatePresence>

            {sidebarItems.map((item, index) => {
              const isActive = pathname === item.href;
              const color = item.color || 'teal';

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'relative flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer group',
                      isActive
                        ? 'nav-active shadow-sm'
                        : 'hover:bg-slate-50/80'
                    )}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.3 }}
                    whileHover={{ x: isActive ? 0 : 3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                  >
                    {/* Active indicator bar */}
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                        style={{ background: 'linear-gradient(180deg, #14b8a6, #a855f7)' }}
                        layoutId="activeBar"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}

                    {/* Icon container */}
                    <div
                      className={cn(
                        'flex-shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center transition-all duration-200',
                        isActive
                          ? `bg-gradient-to-br ${iconBgColors[color]}`
                          : 'bg-transparent group-hover:bg-slate-100'
                      )}
                    >
                      <span className={cn(
                        'transition-colors duration-200',
                        isActive ? iconColors[color] : 'text-slate-400 group-hover:text-slate-600'
                      )}>
                        {item.icon}
                      </span>
                    </div>

                    {/* Label */}
                    <motion.div
                      className="flex-1 flex items-center justify-between min-w-0"
                      variants={labelVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      initial={false}
                    >
                      <span className={cn(
                        'font-semibold text-[13.5px] truncate',
                        isActive ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-800'
                      )}>
                        {item.label}
                      </span>

                      {item.badge && (
                        <span
                          className="ml-2 px-1.5 py-0.5 text-[10px] font-bold rounded-full flex-shrink-0"
                          style={{
                            background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(168,85,247,0.1))',
                            color: '#0f766e',
                            border: '1px solid rgba(20,184,166,0.25)',
                          }}
                        >
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  </motion.div>
                </Link>
              );
            })}
          </div>

          {/* Bottom items */}
          <div className="pt-4 mt-2 border-t border-slate-100/80 space-y-0.5">
            <AnimatePresence>
              {isOpen && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3 pb-2"
                >
                  Support
                </motion.p>
              )}
            </AnimatePresence>

            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-[12px] transition-all duration-200 cursor-pointer group',
                      isActive ? 'nav-active' : 'hover:bg-slate-50/80'
                    )}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => {
                      if (window.innerWidth < 1024) onToggle();
                    }}
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-[9px] flex items-center justify-center bg-transparent group-hover:bg-slate-100 transition-colors">
                      <span className="text-slate-400 group-hover:text-slate-600 transition-colors">
                        {item.icon}
                      </span>
                    </div>
                    <motion.span
                      className="font-semibold text-[13.5px] text-slate-600 group-hover:text-slate-800"
                      variants={labelVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      initial={false}
                    >
                      {item.label}
                    </motion.span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* ── User Footer ── */}
        <div className="p-3 border-t border-slate-100/80">
          <motion.div
            className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-slate-50/80 transition-colors cursor-pointer group"
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.97 }}
          >
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-sm"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
            >
              U
            </div>

            <motion.div
              className="flex-1 min-w-0"
              variants={labelVariants}
              animate={isOpen ? 'open' : 'closed'}
              initial={false}
            >
              <div className="text-[13px] font-semibold text-slate-800 truncate">Creator</div>
              <div className="text-[11px] text-slate-400 truncate">Premium Plan</div>
            </motion.div>

            <motion.div
              variants={labelVariants}
              animate={isOpen ? 'open' : 'closed'}
              initial={false}
            >
              <LogOut className="h-3.5 w-3.5 text-slate-400 group-hover:text-rose-500 transition-colors flex-shrink-0" />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
