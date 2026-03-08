'use client';

import { motion } from 'framer-motion';
import { Sparkles, Zap, BarChart3, Globe, ArrowRight, Shield } from 'lucide-react';

const features = [
  { icon: <Zap className="w-4 h-4" />,       label: 'AI-Powered Generation',  desc: 'Create platform-perfect content instantly' },
  { icon: <BarChart3 className="w-4 h-4" />, label: 'Smart Analytics',         desc: 'Score & optimize every post automatically' },
  { icon: <Globe className="w-4 h-4" />,     label: '10+ Indian Languages',    desc: 'Reach audiences in their native tongue' },
];

function AnimatedOrb({ className, delay = 0, color }: { className: string; delay?: number; color: string }) {
  return (
    <motion.div
      className={`absolute rounded-full pointer-events-none ${className}`}
      style={{ background: color, filter: 'blur(60px)' }}
      animate={{
        scale: [1, 1.25, 1],
        opacity: [0.6, 0.9, 0.6],
        x: [0, 15, 0],
        y: [0, -15, 0],
      }}
      transition={{ duration: 7 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

// Animated mesh grid SVG
function GridPattern() {
  return (
    <svg
      className="absolute inset-0 w-full h-full opacity-[0.04]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#14b8a6" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

// Floating illustration cards for the left panel
function FloatingCard({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={`absolute ${className} glass-strong rounded-2xl p-4 shadow-xl`}
      animate={{ y: [0, -8, 0], rotate: [0, 0.5, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
}

export default function LoginPage() {
  const handleCognitoLogin = () => {
    localStorage.removeItem('creo_token');
    localStorage.removeItem('creo_user');
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const redirectUri = `${baseUrl}/api/auth/callback`;
    const domain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com';
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '4b9em2599sm42256qpnork0817';
    const authUrl = `https://${domain}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f8fafb' }}>

      {/* ══ LEFT PANEL — brand visual ══ */}
      <div
        className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #0d1f2d 40%, #0e1628 100%)',
        }}
      >
        {/* Grid */}
        <GridPattern />

        {/* Orbs */}
        <AnimatedOrb className="w-96 h-96 -top-20 -left-20"  delay={0} color="rgba(20,184,166,0.25)"  />
        <AnimatedOrb className="w-80 h-80 bottom-20 -right-10" delay={2} color="rgba(168,85,247,0.22)" />
        <AnimatedOrb className="w-64 h-64 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" delay={1} color="rgba(20,184,166,0.12)" />

        {/* Brand mark */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #a855f7 100%)',
                boxShadow: '0 4px 20px rgba(20,184,166,0.4)',
              }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight">CREO-AI</span>
          </div>
        </div>

        {/* Central hero text */}
        <div className="relative z-10">
          <motion.h1
            className="text-5xl xl:text-6xl font-extrabold text-white leading-[1.1] mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Create content{' '}
            <span
              className="block"
              style={{
                background: 'linear-gradient(90deg, #2dd4bf, #a855f7)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              that converts.
            </span>
          </motion.h1>

          <motion.p
            className="text-slate-400 text-lg leading-relaxed max-w-sm mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
          >
            AI-driven social media content studio built for Indian creators and brands.
          </motion.p>

          {/* Feature list */}
          <div className="space-y-4">
            {features.map((f, i) => (
              <motion.div
                key={f.label}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.12 }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(20,184,166,0.2), rgba(168,85,247,0.15))',
                    border: '1px solid rgba(20,184,166,0.3)',
                  }}
                >
                  <span className="text-teal-400">{f.icon}</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{f.label}</p>
                  <p className="text-slate-500 text-xs">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Floating UI mockup cards */}
        <FloatingCard className="top-[22%] right-8 w-56" delay={0.5}>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-teal-400" />
            <span className="text-[11px] font-bold text-slate-700">Score: 94/100</span>
          </div>
          <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full rounded-full w-[94%]" style={{ background: 'linear-gradient(90deg, #14b8a6, #a855f7)' }} />
          </div>
          <p className="text-[10px] text-slate-500 mt-2">LinkedIn · Engagement optimized</p>
        </FloatingCard>

        <FloatingCard className="top-[46%] right-[-1rem] w-48" delay={1.5}>
          <p className="text-[10px] font-bold text-slate-600 mb-1">🪔 Diwali campaign</p>
          <p className="text-[11px] text-slate-800 font-semibold leading-tight">"This Diwali, let your brand shine brighter…"</p>
          <div className="mt-2 flex gap-1">
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-700 font-semibold border border-teal-200">#Diwali</span>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-50 text-violet-700 font-semibold border border-violet-200">#Brand</span>
          </div>
        </FloatingCard>

        {/* Stats bar at bottom */}
        <div className="relative z-10 pt-10 border-t border-white/10">
          <div className="flex gap-8">
            {[['10K+', 'Posts generated'], ['94%', 'Avg content score'], ['10', 'Languages']].map(([n, l]) => (
              <div key={l}>
                <p
                  className="text-2xl font-extrabold"
                  style={{
                    background: 'linear-gradient(90deg, #2dd4bf, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {n}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ══ RIGHT PANEL — login form ══ */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative overflow-hidden">
        {/* Subtle orbs on right panel */}
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <motion.div
          className="w-full max-w-[400px] relative z-10"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, type: 'spring', stiffness: 90, damping: 20 }}
        >
          {/* Logo on mobile */}
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
            >
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-extrabold text-lg text-slate-900">CREO-AI</span>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">
              Welcome back
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Sign in to your AI content studio
            </p>
          </div>

          {/* Login card */}
          <div
            className="rounded-2xl p-7"
            style={{
              background: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.9)',
              boxShadow: '0 4px 30px rgba(0,0,0,0.07), 0 1px 0 rgba(255,255,255,1) inset',
            }}
          >
            {/* SSO Button */}
            <motion.button
              onClick={handleCognitoLogin}
              className="relative w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm text-white overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #14b8a6 0%, #0d9488 45%, #a855f7 100%)',
                boxShadow: '0 4px 18px rgba(20,184,166,0.35)',
              }}
              whileHover={{
                scale: 1.02,
                boxShadow: '0 6px 24px rgba(20,184,166,0.5)',
              }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Animated shine */}
              <motion.div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)' }}
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
              />
              <Sparkles className="h-4 w-4" />
              Enter Workspace
              <ArrowRight className="h-4 w-4" />
            </motion.button>

            {/* Divider */}
            <div className="my-5 flex items-center gap-3">
              <span className="h-px bg-slate-200 flex-1" />
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">
                Secured Access
              </span>
              <span className="h-px bg-slate-200 flex-1" />
            </div>

            {/* Trust indicators */}
            <div className="flex items-center justify-center gap-2 text-slate-400">
              <Shield className="h-3.5 w-3.5" />
              <p className="text-xs font-medium">Powered by AWS Cognito — enterprise-grade auth</p>
            </div>
          </div>

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-400 font-medium mt-6">
            By signing in, you agree to our{' '}
            <span className="text-teal-600 cursor-pointer hover:underline">Terms of Service</span>
            {' '}and{' '}
            <span className="text-teal-600 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}