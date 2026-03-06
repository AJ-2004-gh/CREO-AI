'use client';

import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Activity, PieChart } from 'lucide-react';

const featureCards = [
  { icon: <TrendingUp className="w-5 h-5" />,  title: 'Trend Analysis',        desc: 'Track engagement over time with deep-dive charts' },
  { icon: <Activity className="w-5 h-5" />,    title: 'Real-time Metrics',     desc: 'Live view of your content performance as it happens' },
  { icon: <PieChart className="w-5 h-5" />,    title: 'Audience Insights',     desc: 'Understand who your content resonates with most' },
  { icon: <BarChart3 className="w-5 h-5" />,   title: 'Cross-platform Report', desc: 'Compare performance across all your social channels' },
];

export default function AnalyticsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Analytics{' '}
          <span style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            Deep Dive
          </span>
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1.5">Detailed insights and performance tracking</p>
      </motion.div>

      <motion.div
        className="card p-10 sm:p-16 text-center relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        </div>

        <div className="relative z-10">
          <motion.div
            className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(168,85,247,0.1))', border: '1px solid rgba(20,184,166,0.2)' }}
            animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            <BarChart3 className="w-9 h-9 text-teal-600" />
          </motion.div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-3">Advanced Analytics — Coming Soon</h2>
          <p className="text-slate-500 max-w-md mx-auto text-sm leading-relaxed mb-10">
            We're building predictive insights, audience demographics, and deeper engagement metrics. Stay tuned!
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
