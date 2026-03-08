'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Post } from '@/types/post';
import { Check, Loader2, Calendar, LayoutGrid, Twitter, Linkedin, Instagram, Play } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/* ── Copy Button Component ── */
function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <motion.button
      onClick={handleCopy}
      className={`p-2 rounded-xl bg-white shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex items-center gap-2 text-gray-500 hover:text-blue-600 ${className}`}
      title="Copy to clipboard"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <AnimatePresence mode="wait">
        {copied ? (
          <motion.div
            key="copied"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-green-500" />
            <span className="text-xs font-semibold text-green-600">Copied!</span>
          </motion.div>
        ) : (
          <motion.div
            key="copy"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium">Copy</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

/* ── Score Bar Component ── */
function ScoreBar({ label, score, color }: { label: string; score: number; color: string }) {
  // Normalize score in case it's missing
  const safeScore = isNaN(score) ? 0 : score;
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-medium text-gray-600" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{label}</span>
        <span className="text-xs font-bold text-gray-900" style={{ fontSize: '0.65rem' }}>{safeScore}/100</span>
      </div>
      <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full shadow-sm"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${safeScore}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-white/20 to-transparent" />
      </div>
    </div>
  );
}

const PLATFORM_ICONS: Record<string, any> = {
  Twitter: Twitter,
  LinkedIn: Linkedin,
  Instagram: Instagram,
};

export default function HistoryPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    const token = localStorage.getItem('creo_token');
    if (!token) {
      router.push('/login');
      return null;
    }
    return token;
  };

  useEffect(() => {
    const fetchHistory = async () => {
      const token = getToken();
      if (!token) return;

      try {
        const res = await fetch('/api/history', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.status === 401) {
          router.push('/login');
          return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch history');

        setPosts(data.posts || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [router]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8 px-4 sm:px-6 lg:px-8 pb-12">
      {/* Page header */}
      <motion.div
        className="flex flex-col gap-4 mt-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Post{' '}
            <span style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>History</span>
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-1.5">View your past generations, images, and engagement scores</p>
        </div>
      </motion.div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
             <div key={i} className="animate-pulse bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
                <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                <div className="h-10 bg-slate-200 rounded"></div>
                <div className="h-32 bg-slate-200 rounded"></div>
             </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 shadow-xs">
          <LayoutGrid className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-4 text-lg font-bold text-slate-800">No Post History Yet</h3>
          <p className="mt-1 text-sm text-slate-500">Go to the Create page to generate your first post!</p>
          <button
            onClick={() => router.push('/create')}
            className="mt-6 px-4 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl"
          >
            Create Post
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
          <AnimatePresence>
            {posts.map((post, index) => {
              const PlatformIcon = PLATFORM_ICONS[post.platform] || LayoutGrid;
              
              // Validate scores as older posts might not have them
              const hasScores = post.final_score !== undefined;

              return (
                <motion.div
                  key={post.post_id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-lg shadow-slate-200/40 rounded-3xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 group"
                >
                  {/* Card Header (Platform & Date) */}
                  <div className="px-5 py-4 flex justify-between items-center border-b border-slate-100 bg-slate-50/50">
                     <div className="flex items-center gap-2">
                       <PlatformIcon className="w-4 h-4 text-slate-600" />
                       <span className="font-semibold text-sm text-slate-700">{post.platform}</span>
                     </div>
                     <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                       <Calendar className="w-3.5 h-3.5" />
                       {new Date(Number(post.created_at)).toLocaleDateString()}
                     </div>
                  </div>

                  {/* Card Image */}
                  {post.image_url && (
                    <div className="w-full h-48 sm:h-56 overflow-hidden relative group-image bg-slate-100">
                      <img 
                        src={post.image_url} 
                        alt="Generated Post Image" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent pointer-events-none" />
                    </div>
                  )}

                  <div className="p-5 space-y-4">
                    {/* Content */}
                    <div className="relative">
                      <div className="absolute -top-1 -right-1 z-10 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                         <CopyButton text={post.content} className="scale-90" />
                      </div>
                      <div className="text-sm text-slate-600 whitespace-pre-wrap max-h-40 overflow-y-auto pr-2 custom-scrollbar prose prose-sm prose-slate max-w-none">
                         <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
                      </div>
                    </div>

                    {/* Hashtags */}
                    {post.suggested_hashtags && post.suggested_hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {post.suggested_hashtags.map((tag, idx) => (
                           <span key={idx} className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100/50">
                             #{tag.replace(/^#/, '')}
                           </span>
                        ))}
                      </div>
                    )}

                    {/* Scores Breakdown */}
                    {hasScores && (
                      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-4 pt-3">
                         <div className="flex items-center justify-between mb-1">
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Engagement Output</span>
                           <span className="text-sm font-black text-slate-800">{post.final_score}/100</span>
                         </div>
                         <div className="grid grid-cols-3 gap-3">
                            <ScoreBar label="Hook" score={post.hook_score} color="#f59e0b" />
                            <ScoreBar label="Clarity" score={post.clarity_score} color="#14b8a6" />
                            <ScoreBar label="CTA" score={post.cta_score} color="#a855f7" />
                         </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Adding custom scrollbar style for content box */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(203, 213, 225, 0.5); /* slate-300 with opacity */
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}
