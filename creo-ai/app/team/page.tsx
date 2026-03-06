'use client';

import { motion } from 'framer-motion';
import { Users, UserPlus, Share2, CheckCircle } from 'lucide-react';

const featureCards = [
  { icon: <UserPlus className="w-5 h-5" />,   title: 'Invite Members',     desc: 'Add teammates and assign roles with one click' },
  { icon: <Share2 className="w-5 h-5" />,     title: 'Share Drafts',       desc: 'Collaborate on content before publishing' },
  { icon: <CheckCircle className="w-5 h-5" />,title: 'Approval Workflows', desc: 'Set up review and sign-off chains' },
  { icon: <Users className="w-5 h-5" />,      title: 'Role Management',    desc: 'Fine-grained permission controls per member' },
];

export default function TeamPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Team{' '}
          <span style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Collaboration
          </span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1.5">Invite members and manage workspace roles</p>
      </motion.div>

      <motion.div
        className="card p-10 sm:p-16 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div className="relative z-10">
          <motion.div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(20,184,166,0.1))', border: '1px solid rgba(168,85,247,0.2)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Users className="w-9 h-9 text-violet-600" />
          </motion.div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Team Features — Coming Soon</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-10">
            Collaboration features are currently in development. Soon you'll be able to invite teammates, share drafts, and set up approval workflows.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            {featureCards.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.08 }}
                className="flex items-start gap-3 p-4 rounded-2xl"
                style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(168,85,247,0.1)' }}
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(20,184,166,0.1))' }}>
                  <span className="text-violet-600">{f.icon}</span>
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
