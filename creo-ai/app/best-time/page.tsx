'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Star, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Platform, IndicLanguage, CulturalContext } from '@/types/post';

type PostingTimeSlot = {
  day: string;
  time: string;
  timezone: string;
  reason: string;
};

type BestTimeResult = {
  top_pick: PostingTimeSlot;
  best_times: PostingTimeSlot[];
  summary: string;
};

const PLATFORMS: Platform[] = ['Twitter', 'LinkedIn', 'Instagram'];
const PLATFORM_META: Record<Platform, { icon: string; color: string }> = {
  Twitter:   { icon: '𝕏',   color: '#1d9bf0' },
  LinkedIn:  { icon: 'in',  color: '#0a66c2' },
  Instagram: { icon: '📸',  color: '#E1306C' },
};

const LANGUAGES: IndicLanguage[] = [
  'English', 'Hindi', 'Marathi', 'Tamil', 'Bengali',
  'Telugu', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi',
];

const CULTURAL_CONTEXTS: CulturalContext[] = [
  'None', 'Diwali', 'Holi', 'Eid', 'Christmas', 'Pongal', 'Onam',
  'Durga Puja', 'Ganesh Chaturthi', 'Navratri', 'IPL Season',
  'Cricket World Cup', 'Monsoon', 'Summer', 'Winter', 'Wedding Season',
  'Festival Season', 'Independence Day', 'Republic Day', 'New Year',
];

const EXAMPLES = [
  { label: 'Product launch', content: 'Introducing our new handmade leather bag collection — crafted with love, built to last. Perfect for the modern professional.' },
  { label: 'Festival offer', content: 'This Diwali bring home joy! Get 30% off on all festive hampers. Limited stock — order before it sells out! 🪔✨' },
  { label: 'Tech insight', content: '5 productivity tools every remote developer should be using in 2026. Thread 🧵👇' },
];

export default function BestTimePage() {
  const router = useRouter();
  const [platform, setPlatform] = useState<Platform>('LinkedIn');
  const [language, setLanguage] = useState<IndicLanguage>('English');
  const [culturalContext, setCulturalContext] = useState<CulturalContext>('None');
  const [content, setContent] = useState('');
  const [result, setResult] = useState<BestTimeResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!content.trim()) return;

    const token = typeof window !== 'undefined' ? localStorage.getItem('creo_token') : null;
    if (!token) { router.push('/login'); return; }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/best-time', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          content,
          platform,
          culturalContext,
          targetLanguage: language,
        }),
      });

      if (res.status === 401) { router.push('/login'); return; }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to get suggestions');
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-md"
            style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)', boxShadow: '0 4px 12px rgba(20,184,166,0.3)' }}
          >
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Best Time to{' '}
            <span style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Post
            </span>
          </h1>
        </div>
        <p className="text-slate-500 text-sm font-medium ml-13">
          Paste your content and let AI recommend the optimal publishing windows for maximum reach
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* ── Left: Input panel ── */}
        <motion.div
          className="lg:col-span-3 space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card p-6 space-y-5">
            {/* Platform */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Platform</label>
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <motion.button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className="relative p-3 rounded-2xl border-2 transition-all duration-200 flex flex-col items-center gap-1.5"
                    style={
                      platform === p
                        ? { background: 'rgba(20,184,166,0.06)', borderColor: '#14b8a6', boxShadow: '0 4px 12px rgba(20,184,166,0.15)' }
                        : { background: 'white', borderColor: '#e2e8f0' }
                    }
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <span className="text-xl">{PLATFORM_META[p].icon}</span>
                    <span className="text-xs font-semibold" style={{ color: platform === p ? '#0f766e' : '#64748b' }}>{p}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Language + Cultural Context */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value as IndicLanguage)}
                  className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:border-teal-400 appearance-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Cultural Context</label>
                <select
                  value={culturalContext}
                  onChange={(e) => setCulturalContext(e.target.value as CulturalContext)}
                  className="w-full px-3 py-2.5 border-2 border-slate-200 rounded-xl text-sm text-slate-800 bg-white focus:outline-none focus:border-teal-400 appearance-none cursor-pointer"
                >
                  {CULTURAL_CONTEXTS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Content input */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-semibold text-slate-700">Your Post Content</label>
                <span className="text-xs text-slate-400">{content.length} chars</span>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                placeholder={`Paste your ${platform} post here...`}
                className="w-full px-4 py-3 border-2 border-slate-200 rounded-2xl text-sm text-slate-800 bg-white focus:outline-none focus:border-teal-400 resize-none transition-colors placeholder:text-slate-400"
              />
            </div>

            {/* Example starters */}
            <div>
              <p className="text-xs font-semibold text-slate-500 mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    onClick={() => setContent(ex.content)}
                    className="text-xs px-3 py-1.5 rounded-full border border-teal-200 text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors font-medium"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                className="p-3 bg-red-50 border border-red-200 rounded-xl"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-red-700 text-sm">{error}</p>
              </motion.div>
            )}

            <Button
              onClick={handleAnalyze}
              disabled={loading || !content.trim()}
              loading={loading}
              size="lg"
              icon={<Sparkles className="w-5 h-5" />}
              className="w-full shadow-lg hover:shadow-xl"
              style={content.trim() ? { background: 'linear-gradient(135deg, #14b8a6, #0d9488)' } : {}}
            >
              {loading ? 'Analyzing content...' : 'Get Best Posting Times'}
            </Button>
          </div>
        </motion.div>

        {/* ── Right: Results panel ── */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {!result && !loading && (
              <motion.div
                key="placeholder"
                className="card p-8 text-center h-full flex flex-col items-center justify-center gap-4"
                style={{ minHeight: '320px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(168,85,247,0.08))', border: '1px solid rgba(20,184,166,0.2)' }}
                >
                  <Clock className="w-8 h-8 text-teal-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-1">AI Timing Suggestions</p>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Fill in your post details and click Analyze to see when your audience is most active
                  </p>
                </div>
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                className="card p-8 h-full flex flex-col items-center justify-center gap-4"
                style={{ minHeight: '320px' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="relative w-14 h-14">
                  <div className="w-14 h-14 rounded-full border-4 border-teal-100 border-t-teal-500 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-teal-500" />
                  </div>
                </div>
                <p className="text-sm font-semibold text-teal-700">Analyzing your content...</p>
                <p className="text-xs text-slate-400">Checking platform trends & audience patterns</p>
              </motion.div>
            )}

            {result && (
              <motion.div
                key="result"
                className="space-y-4"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                {/* Top Pick */}
                <div
                  className="card p-5"
                  style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.07), rgba(168,85,247,0.05))', border: '1.5px solid rgba(20,184,166,0.25)' }}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span className="text-xs font-bold text-teal-700 uppercase tracking-wide">Top Pick</span>
                  </div>
                  <p className="text-xl font-extrabold text-slate-800">
                    {result.top_pick.day}
                  </p>
                  <p className="text-base font-bold" style={{ color: '#14b8a6' }}>
                    {result.top_pick.time}
                    <span className="ml-2 text-xs font-semibold text-slate-400">{result.top_pick.timezone}</span>
                  </p>
                  <p className="text-xs text-slate-500 mt-2 leading-relaxed">{result.top_pick.reason}</p>
                </div>

                {/* Summary */}
                <div className="card p-4">
                  <p className="text-xs text-slate-500 leading-relaxed">{result.summary}</p>
                </div>

                {/* Other slots */}
                <div className="space-y-3">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">Other Good Windows</p>
                  {result.best_times.map((slot, i) => (
                    <motion.div
                      key={i}
                      className="card p-4"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-bold text-slate-700">{slot.day}</p>
                          <p className="text-sm font-semibold" style={{ color: '#14b8a6' }}>{slot.time}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{slot.timezone}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-snug">{slot.reason}</p>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={loading}
                  loading={loading}
                  variant="outline"
                  size="sm"
                  icon={<Clock className="w-3.5 h-3.5" />}
                  className="w-full border-slate-200 text-slate-500 hover:bg-slate-50 bg-white text-xs"
                >
                  Refresh Suggestions
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
