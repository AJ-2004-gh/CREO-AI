'use client';

/**
 * Dashboard Page — Premium v2 with teal-violet brand theme
 */
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DashboardSkeleton } from '@/components/ui/Skeleton';
import type { DashboardData } from '@/types/analytics';
import {
  TrendingUp,
  Target,
  Zap,
  BarChart3,
  FileText,
  Plus,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';

const PLATFORM_COLORS: Record<string, string> = {
  Twitter:   '#1d9bf0',
  LinkedIn:  '#0a66c2',
  Instagram: '#E1306C',
};

const PIE_COLORS = ['#e2e8f0', '#99f6e4', '#2dd4bf', '#14b8a6', '#0d9488'];

/* ── Stat Card ── */
function StatCard({
  label,
  value,
  sub,
  icon,
  gradient,
  iconBg,
  delay = 0,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  delay?: number;
}) {
  return (
    <motion.div
      className="card p-5 group cursor-default"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: 'spring', stiffness: 90 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      {/* Gradient band at top */}
      <div
        className="absolute top-0 left-0 right-0 h-0.75 rounded-t-2xl"
        style={{ background: gradient }}
      />

      <div className="flex items-start justify-between mb-4">
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm"
          style={{ background: iconBg }}
        >
          {icon}
        </div>

        {sub && (
          <span
            className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(20,184,166,0.06))',
              color: '#0f766e',
              border: '1px solid rgba(20,184,166,0.2)',
            }}
          >
            <ArrowUpRight className="w-3 h-3" />
            {sub}
          </span>
        )}
      </div>

      <p className="text-2xl font-extrabold text-slate-900 mb-1 tracking-tight">{value}</p>
      <p className="text-[13px] text-slate-500 font-medium">{label}</p>
    </motion.div>
  );
}

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-lg"
      style={{
        background: 'rgba(255,255,255,0.97)',
        border: '1px solid rgba(20,184,166,0.2)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      }}
    >
      <p className="font-bold text-slate-700 mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} className="text-[12px]" style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

/* ── Empty State ── */
function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="card p-10 sm:p-14 text-center relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute -top-16 -right-16 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)', filter: 'blur(30px)' }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(30px)' }}
        />
      </div>

      <div className="relative z-10 space-y-6">
        <motion.div
          className="w-20 h-20 mx-auto rounded-3xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(168,85,247,0.1))',
            border: '1px solid rgba(20,184,166,0.2)',
          }}
          animate={{ scale: [1, 1.04, 1], rotate: [0, 1, -1, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <FileText className="w-9 h-9 text-teal-600" />
        </motion.div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Your canvas is empty</h2>
          <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
            Create your first AI-powered post and watch your analytics come alive!
          </p>
        </div>

        <button
          onClick={onCreate}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)',
            boxShadow: '0 4px 18px rgba(20,184,166,0.35)',
          }}
        >
          <Sparkles className="w-4 h-4" />
          Create your first post
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════
   MAIN DASHBOARD
══════════════════════════════════════ */
export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlUser  = urlParams.get('user');

    if (urlToken) {
      localStorage.setItem('creo_token', urlToken);
      if (urlUser) localStorage.setItem('creo_user', urlUser);
      router.replace('/dashboard');
    }

    const token = localStorage.getItem('creo_token');
    if (!token) { router.push('/login'); return; }

    try {
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 401) { localStorage.removeItem('creo_token'); router.push('/login'); return; }
      if (!res.ok) throw new Error('Failed to load dashboard data');
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  if (loading) return <DashboardSkeleton />;

  if (error) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-10 max-w-sm w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-rose-500" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Unable to load dashboard</h3>
          <p className="text-slate-500 text-sm mb-6">{error}</p>
          <Button onClick={fetchDashboard} icon={<TrendingUp className="w-4 h-4" />}>Retry</Button>
        </Card>
      </motion.div>
    );
  }

  if (!data) return null;

  const statCards = [
    {
      label: 'Total Posts',
      value: data.total_posts,
      icon: <FileText className="w-5 h-5 text-teal-600" />,
      gradient: 'linear-gradient(90deg, #14b8a6, #2dd4bf)',
      iconBg: 'linear-gradient(135deg, rgba(20,184,166,0.15), rgba(20,184,166,0.06))',
    },
    {
      label: 'Average Score',
      value: `${data.avg_score}/100`,
      icon: <Target className="w-5 h-5 text-violet-600" />,
      gradient: 'linear-gradient(90deg, #a855f7, #c084fc)',
      iconBg: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.06))',
    },
    {
      label: 'Best Platform',
      value: data.best_platform || 'N/A',
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      gradient: 'linear-gradient(90deg, #f59e0b, #fbbf24)',
      iconBg: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.06))',
    },
    {
      label: 'Success Rate',
      value: `${data.optimization_success_rate}%`,
      sub: data.optimization_success_rate > 50 ? 'Great!' : undefined,
      icon: <TrendingUp className="w-5 h-5 text-teal-600" />,
      gradient: 'linear-gradient(90deg, #14b8a6, #a855f7)',
      iconBg: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(168,85,247,0.08))',
    },
  ];

  return (
    <div className="space-y-7 max-w-7xl mx-auto">

      {/* ── Page Header ── */}
      <motion.div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Analytics{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #14b8a6, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Dashboard
            </span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1.5">
            Real-time view of your content performance
          </p>
        </div>

        <motion.button
          onClick={() => router.push('/create')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white self-start sm:self-auto"
          style={{
            background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)',
            boxShadow: '0 4px 18px rgba(20,184,166,0.3)',
          }}
          whileHover={{ scale: 1.03, boxShadow: '0 6px 24px rgba(20,184,166,0.45)' }}
          whileTap={{ scale: 0.97 }}
        >
          <Plus className="w-4 h-4" />
          New Post
        </motion.button>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {statCards.map((card, i) => (
          <StatCard key={card.label} {...card} delay={0.06 * i} />
        ))}
      </div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {data.total_posts === 0 ? (
          <EmptyState onCreate={() => router.push('/create')} />
        ) : (
          <motion.div
            key="charts"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            {/* Engagement Trend */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="p-5 sm:p-7">
                <CardHeader className="px-0 pt-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
                    />
                    <CardTitle className="text-base sm:text-lg">Engagement Trend</CardTitle>
                    <span className="text-xs text-slate-400 font-medium ml-auto">Last 30 days</span>
                  </div>
                </CardHeader>
                <CardContent className="px-0 pb-0">
                  <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={data.engagement_trend} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                      <defs>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%"   stopColor="#14b8a6" />
                          <stop offset="100%" stopColor="#a855f7" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                      <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="avg_score"
                        name="Avg Score"
                        stroke="url(#lineGrad)"
                        strokeWidth={2.5}
                        dot={{ r: 3, fill: '#14b8a6', strokeWidth: 0 }}
                        activeDot={{ r: 5, fill: '#a855f7' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </motion.div>

            {/* Bottom charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
              {/* Platform Comparison */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-5 sm:p-7">
                  <CardHeader className="px-0 pt-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
                      />
                      <CardTitle className="text-base sm:text-lg">Platform Comparison</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={data.platform_stats} margin={{ left: -20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                        <XAxis dataKey="platform" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="avg_score" name="Avg Score" radius={[6, 6, 0, 0]}>
                          {data.platform_stats.map((entry) => (
                            <Cell key={entry.platform} fill={PLATFORM_COLORS[entry.platform] || '#14b8a6'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Score Distribution */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-5 sm:p-7">
                  <CardHeader className="px-0 pt-0">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
                      />
                      <CardTitle className="text-base sm:text-lg">Score Distribution</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 pb-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={data.score_distribution}
                            dataKey="count"
                            nameKey="range"
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                          >
                            {data.score_distribution.map((_, index) => (
                              <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(v, name) => [v, `Score ${name}`]} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex-1 space-y-2.5">
                        {data.score_distribution.map((item, i) => (
                          <div key={item.range} className="flex items-center gap-2.5 text-[12px]">
                            <span
                              className="w-3 h-3 rounded shrink-0"
                              style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length], borderRadius: '4px' }}
                            />
                            <span className="text-slate-600 font-medium flex-1">{item.range}</span>
                            <span className="font-bold text-slate-900">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
