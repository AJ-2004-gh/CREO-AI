'use client';

import { motion } from 'framer-motion';
import { FileText, Tag, Calendar, Search } from 'lucide-react';

const featureCards = [
  { icon: <Search className="w-5 h-5" />,    title: 'Smart Search',        desc: 'Find any post instantly with semantic search' },
  { icon: <Tag className="w-5 h-5" />,       title: 'Tag & Organize',      desc: 'Group posts by campaign, platform or topic' },
  { icon: <Calendar className="w-5 h-5" />, title: 'Schedule Posts',      desc: 'Plan and schedule content directly from the library' },
  { icon: <FileText className="w-5 h-5" />, title: 'Template Library',    desc: 'Save your best posts as reusable templates' },
];

export default function ContentPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Content{' '}
          <span style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Library
          </span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1.5">Manage all your generated posts and assets</p>
      </motion.div>

      <motion.div
        className="card p-10 sm:p-16 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div className="relative z-10">
          <motion.div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(20,184,166,0.2)' }}
            animate={{ scale: [1, 1.04, 1], rotate: [0, -2, 2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <FileText className="w-9 h-9 text-teal-600" />
          </motion.div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Content Library — Coming Soon</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-10">
            Soon you'll be able to organize, tag, and schedule your content from a beautiful library interface.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {featureCards.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(20,184,166,0.1)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(168,85,247,0.1))' }}>
                  <span className="text-teal-600">{f.icon}</span>
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">{f.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
