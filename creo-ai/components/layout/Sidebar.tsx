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
  Menu,
  X
} from 'lucide-react';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

const sidebarItems: SidebarItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="h-5 w-5" />
  },
  {
    label: 'Create',
    href: '/create',
    icon: <PenTool className="h-5 w-5" />
  },
  {
    label: 'Analytics',
    href: '/analytics',
    icon: <BarChart3 className="h-5 w-5" />
  },
  {
    label: 'Content',
    href: '/content',
    icon: <FileText className="h-5 w-5" />,
    badge: 'New'
  },
  {
    label: 'Team',
    href: '/team',
    icon: <Users className="h-5 w-5" />
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="h-5 w-5" />
  }
];

const bottomItems: SidebarItem[] = [
  {
    label: 'Help',
    href: '/help',
    icon: <HelpCircle className="h-5 w-5" />
  }
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  const sidebarVariants = {
    open: {
      width: '16rem',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
    },
    closed: {
      width: '4.5rem',
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as const }
    }
  };

  const contentVariants = {
    open: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.2 }
    },
    closed: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
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
          'fixed left-0 top-0 h-screen bg-white border-r border-gray-200 z-50 flex flex-col',
          'lg:relative lg:z-auto',
          'transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
        variants={sidebarVariants}
        animate={isOpen ? 'open' : 'closed'}
        initial={false}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <motion.div
            className="flex items-center gap-3"
            variants={contentVariants}
            animate={isOpen ? 'open' : 'closed'}
            initial={false}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-lg text-gray-900 hidden sm:block">CREO<span className="text-blue-600">-AI</span></span>
          </motion.div>
          
          <button
            onClick={onToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* Main navigation */}
          <div className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                      'hover:bg-gray-50 group touch-manipulation',
                      isActive && 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                  >
                    <span className={cn(
                      'flex-shrink-0 transition-colors',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    )}>
                      {item.icon}
                    </span>
                    
                    <motion.div
                      className="flex-1 flex items-center justify-between"
                      variants={contentVariants}
                      animate={isOpen ? 'open' : 'closed'}
                      initial={false}
                    >
                      <span className={cn(
                        'font-medium text-sm',
                        isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'
                      )}>
                        {item.label}
                      </span>
                      
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
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
          <div className="space-y-1 pt-4 border-t border-gray-100">
            {bottomItems.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200',
                      'hover:bg-gray-50 group touch-manipulation',
                      isActive && 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      // Close sidebar on mobile after navigation
                      if (window.innerWidth < 1024) {
                        onToggle();
                      }
                    }}
                  >
                    <span className={cn(
                      'flex-shrink-0 transition-colors',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    )}>
                      {item.icon}
                    </span>
                    
                    <motion.span
                      className={cn(
                        'font-medium text-sm',
                        isActive ? 'text-blue-600' : 'text-gray-700 group-hover:text-gray-900'
                      )}
                      variants={contentVariants}
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

        {/* Footer */}
        <div className="p-4 border-t border-gray-100">
          <motion.div
            className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group touch-manipulation"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">U</span>
            </div>
            
            <motion.div
              className="flex-1 hidden sm:block"
              variants={contentVariants}
              animate={isOpen ? 'open' : 'closed'}
              initial={false}
            >
              <div className="text-sm font-medium text-gray-900">User</div>
              <div className="text-xs text-gray-500">user@example.com</div>
            </motion.div>
            
            <LogOut className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
