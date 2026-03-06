'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Settings, LogOut, Menu, ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

const PAGE_TITLES: Record<string, { title: string; sub: string }> = {
  '/dashboard': { title: 'Dashboard',  sub: 'Your content performance at a glance' },
  '/create':    { title: 'Create',     sub: 'Generate AI-powered social content' },
  '/analytics': { title: 'Analytics',  sub: 'Deep-dive into your engagement data' },
  '/content':   { title: 'Content',    sub: 'Manage all your published content' },
  '/team':      { title: 'Team',       sub: 'Collaborate with your workspace' },
  '/settings':  { title: 'Settings',   sub: 'Preferences & workspace config' },
};

export function Navbar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const page = PAGE_TITLES[pathname] || { title: 'CREO-AI', sub: 'Your AI content studio' };

  const handleSignOut = () => {
    localStorage.removeItem('creo_token');
    localStorage.removeItem('creo_user');
    router.push('/login');
  };

  return (
    <motion.header
      className="sticky top-0 z-40"
      style={{
        background: 'rgba(248,250,251,0.85)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.8), 0 2px 12px rgba(0,0,0,0.04)',
      }}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between px-5 py-3 min-h-[60px]">
        {/* Left — hamburger + page title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl hover:bg-white/80 transition-all text-slate-500 hover:text-slate-700 border border-transparent hover:border-slate-200/60"
            style={{ backdropFilter: 'blur(8px)' }}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Page breadcrumb */}
          <div className="hidden sm:flex flex-col leading-none">
            <motion.h2
              key={pathname}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[15px] font-bold text-slate-900"
            >
              {page.title}
            </motion.h2>
            <motion.p
              key={pathname + '-sub'}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="text-[11px] text-slate-400 font-medium mt-0.5"
            >
              {page.sub}
            </motion.p>
          </div>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-2">

          {/* Quick Create CTA */}
          <Link href="/create">
            <motion.button
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-semibold text-white"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)',
                boxShadow: '0 4px 14px rgba(20,184,166,0.3)',
              }}
              whileHover={{ scale: 1.03, boxShadow: '0 6px 20px rgba(20,184,166,0.45)' }}
              whileTap={{ scale: 0.97 }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Create
            </motion.button>
          </Link>

          {/* Notifications */}
          <div className="relative">
            <motion.button
              className="relative p-2.5 rounded-xl hover:bg-white/80 transition-all text-slate-500 hover:text-slate-700 border border-transparent hover:border-slate-200/60"
              onClick={() => { setIsNotificationsOpen(!isNotificationsOpen); setIsProfileOpen(false); }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="h-[18px] w-[18px]" />
              <span
                className="absolute top-2 right-2 w-2 h-2 rounded-full"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
              />
            </motion.button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  }}
                  initial={{ opacity: 0, scale: 0.94, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  <div className="p-4 border-b border-slate-100 flex items-center justify-between">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <span className="text-[11px] font-semibold text-teal-600 cursor-pointer hover:text-teal-700">Mark all read</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                    {/* Notification item */}
                    {[
                      { title: 'New feature available', desc: 'Indic language support is now live!', time: '2h ago', unread: true },
                      { title: 'Content generated', desc: 'Your LinkedIn post is ready to publish', time: '5h ago', unread: false },
                      { title: 'Analytics report', desc: 'Your weekly report is ready', time: '1d ago', unread: false },
                    ].map((notif, i) => (
                      <div
                        key={i}
                        className={cn(
                          'flex items-start gap-3 p-3 rounded-xl cursor-pointer transition-colors',
                          notif.unread ? 'bg-teal-50/80 hover:bg-teal-50' : 'hover:bg-slate-50'
                        )}
                      >
                        <div
                          className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                          style={{
                            background: notif.unread
                              ? 'linear-gradient(135deg, #14b8a6, #a855f7)'
                              : '#cbd5e1',
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-800">{notif.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5 truncate">{notif.desc}</p>
                          <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <motion.button
              className={cn(
                'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl transition-all border',
                isProfileOpen
                  ? 'bg-white border-slate-200/80 shadow-sm'
                  : 'border-transparent hover:bg-white/80 hover:border-slate-200/60'
              )}
              onClick={() => { setIsProfileOpen(!isProfileOpen); setIsNotificationsOpen(false); }}
              whileTap={{ scale: 0.97 }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm"
                style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
              >
                U
              </div>
              <span className="hidden sm:block text-[13px] font-semibold text-slate-700">Creator</span>
              <ChevronDown
                className={cn(
                  'hidden sm:block h-3.5 w-3.5 text-slate-400 transition-transform duration-200',
                  isProfileOpen && 'rotate-180'
                )}
              />
            </motion.button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-56 max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.97)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.8)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
                  }}
                  initial={{ opacity: 0, scale: 0.94, y: -8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.94, y: -8 }}
                  transition={{ duration: 0.18 }}
                >
                  {/* Profile header */}
                  <div
                    className="p-4"
                    style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.08) 0%, rgba(168,85,247,0.06) 100%)' }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
                      >
                        U
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 text-sm">Creator</p>
                        <p className="text-[11px] font-medium text-teal-600">Premium Plan</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/settings"
                      onClick={() => setIsProfileOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-slate-700 hover:bg-slate-50 rounded-xl transition-colors font-medium"
                    >
                      <Settings className="h-4 w-4 text-slate-400" />
                      Settings
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-medium border-0 bg-transparent text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
