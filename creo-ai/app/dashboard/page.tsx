'use client';

/**
 * Dashboard Page — Modern Analytics Overview with Enhanced UI/UX
 * Features: Animated stats cards, modern charts, skeleton loading states
 */
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Skeleton, DashboardSkeleton } from '@/components/ui/Skeleton';
import type { DashboardData } from '@/types/analytics';
import {
  TrendingUp,
  Users,
  Target,
  Zap,
  BarChart3,
  FileText,
  Plus
} from 'lucide-react';

const PLATFORM_COLORS: Record<string, string> = {
  Twitter: '#1d9bf0',
  LinkedIn: '#0a66c2',
  Instagram: '#E1306C',
};
const PIE_COLORS = ['#e5e7eb', '#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8'];

// Modern stat card with animations
function StatCard({
  label, value, sub, icon, trend,
}: { 
  label: string; 
  value: string | number; 
  sub?: string; 
  icon: React.ReactNode;
  trend?: 'up' | 'down' | 'neutral';
}) {
  return (
    <motion.div
      className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl flex items-center justify-center">
          {icon}
        </div>
        {sub && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-green-100 text-green-700">
            {sub}
          </span>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboard = useCallback(async () => {
    // Check if we just redirected from Google Auth
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get('token');
    const urlUser = urlParams.get('user');

    if (urlToken) {
      localStorage.setItem('creo_token', urlToken);
      if (urlUser) localStorage.setItem('creo_user', urlUser);
      // Clean up the URL
      router.replace('/dashboard');
    }

    const token = localStorage.getItem('creo_token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const res = await fetch('/api/dashboard', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        localStorage.removeItem('creo_token');
        router.push('/login');
        return;
      }

      if (!res.ok) throw new Error('Failed to load dashboard data');
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading dashboard');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <motion.div 
        className="flex items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Card className="p-8 max-w-md w-full">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto">
              <BarChart3 className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to load dashboard</h3>
              <p className="text-gray-500 text-sm mb-4">{error}</p>
            </div>
            <Button 
              onClick={fetchDashboard} 
              className="w-full"
              icon={<TrendingUp className="w-4 h-4" />}
            >
              Retry
            </Button>
          </div>
        </Card>
      </motion.div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="flex flex-col gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-2">Your content performance at a glance</p>
        </div>
        <Button
          onClick={() => router.push('/create')}
          size="lg"
          icon={<Plus className="w-4 h-4" />}
          className="shadow-lg hover:shadow-xl w-full sm:w-auto"
        >
          Create Post
        </Button>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard 
          icon={<FileText className="w-6 h-6 text-blue-600" />} 
          label="Total Posts" 
          value={data.total_posts} 
        />
        <StatCard 
          icon={<Target className="w-6 h-6 text-green-600" />} 
          label="Average Score" 
          value={`${data.avg_score}/100`} 
        />
        <StatCard 
          icon={<Zap className="w-6 h-6 text-yellow-600" />} 
          label="Best Platform" 
          value={data.best_platform || 'N/A'} 
        />
        <StatCard 
          icon={<TrendingUp className="w-6 h-6 text-purple-600" />} 
          label="Success Rate" 
          value={`${data.optimization_success_rate}%`}
          sub={data.optimization_success_rate > 50 ? 'Great!' : undefined}
        />
      </div>

      {data.total_posts === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="p-6 sm:p-8 text-center">
            <div className="space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <div className="space-y-2">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">No posts yet</h2>
                <p className="text-gray-500 text-sm sm:text-base">Create your first AI-powered post to see analytics here.</p>
              </div>
              <Button
                onClick={() => router.push('/create')}
                size="lg"
                icon={<Plus className="w-5 h-5" />}
                className="shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                Create your first post
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <>
          {/* Engagement Trend */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-4 sm:p-6">
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Engagement Trend (Last 30 days)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 260}>
                  <LineChart data={data.engagement_trend} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                      formatter={(v) => [`${v}`, 'Avg Score']}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg_score"
                      stroke="#2563eb"
                      strokeWidth={2}
                      dot={{ r: 3, fill: '#2563eb' }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bottom charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            {/* Platform Comparison */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Platform Comparison</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={window.innerWidth < 640 ? 200 : 240}>
                    <BarChart data={data.platform_stats} margin={{ left: -20 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                      <XAxis dataKey="platform" tick={{ fontSize: 10, fill: '#9ca3af' }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#9ca3af' }} />
                      <Tooltip 
                        formatter={(value, name) => [value, name]}
                        contentStyle={{ borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '12px' }}
                      />
                      <Bar dataKey="avg_score" radius={[6, 6, 0, 0]}>
                        {data.platform_stats.map((entry) => (
                          <Cell
                            key={entry.platform}
                            fill={PLATFORM_COLORS[entry.platform] || '#3b82f6'}
                          />
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
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="p-4 sm:p-6">
                <CardHeader>
                  <CardTitle className="text-base sm:text-lg">Score Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                    <ResponsiveContainer width="100%" height={180}>
                      <PieChart>
                        <Pie
                          data={data.score_distribution}
                          dataKey="count"
                          nameKey="range"
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={60}
                        >
                          {data.score_distribution.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v, name) => [v, `Score ${name}`]} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="flex-1 space-y-2 sm:space-y-3">
                      {data.score_distribution.map((item, i) => (
                        <div key={item.range} className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                          <span
                            className="w-3 h-3 sm:w-4 sm:h-4 rounded-lg flex-shrink-0"
                            style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                          />
                          <span className="text-gray-600 font-medium">{item.range}</span>
                          <span className="ml-auto font-semibold text-gray-900">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}
