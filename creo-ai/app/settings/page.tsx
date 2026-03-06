'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Save, User, Layout, Bell, Shield, ChevronRight } from 'lucide-react';

const SECTIONS = [
  { id: 'profile',       label: 'Profile',        icon: <User className="w-4 h-4" /> },
  { id: 'preferences',   label: 'Preferences',    icon: <Layout className="w-4 h-4" /> },
  { id: 'notifications', label: 'Notifications',  icon: <Bell className="w-4 h-4" /> },
  { id: 'security',      label: 'Security',       icon: <Shield className="w-4 h-4" /> },
];

function SectionTab({
  section,
  active,
  onClick,
}: {
  section: typeof SECTIONS[0];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all"
      style={
        active
          ? {
              background: 'linear-gradient(135deg, rgba(20,184,166,0.1), rgba(168,85,247,0.07))',
              color: '#0f766e',
              border: '1px solid rgba(20,184,166,0.2)',
            }
          : { color: '#64748b' }
      }
    >
      <span className="flex items-center gap-2.5">
        <span style={{ color: active ? '#14b8a6' : '#94a3b8' }}>{section.icon}</span>
        {section.label}
      </span>
      {active && <ChevronRight className="w-3.5 h-3.5 text-teal-500" />}
    </button>
  );
}

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');
  const [defaultPlatform, setDefaultPlatform] = useState('LinkedIn');
  const [userName, setUserName] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const savedPlatform = localStorage.getItem('creo_default_platform');
    if (savedPlatform) setDefaultPlatform(savedPlatform);
    const user = localStorage.getItem('creo_user');
    setUserName(user || 'Creator');
  }, []);

  const handleSave = () => {
    localStorage.setItem('creo_default_platform', defaultPlatform);
    if (userName.trim()) localStorage.setItem('creo_user', userName.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const inputClass = "w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all placeholder:text-slate-400";

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings
        </h1>
        <p className="text-slate-500 text-sm font-medium mt-1.5">
          Manage your preferences and workspace configuration
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {/* Sidebar nav */}
        <div className="card p-3 h-fit space-y-1">
          {SECTIONS.map((s) => (
            <SectionTab
              key={s.id}
              section={s}
              active={activeSection === s.id}
              onClick={() => setActiveSection(s.id)}
            />
          ))}
        </div>

        {/* Content */}
        <Card className="p-6 md:p-8">
          {activeSection === 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-xl flex items-center gap-2">
                  <User className="w-5 h-5 text-teal-600" />
                  Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0 pb-0 space-y-5">
                {/* Avatar preview */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md"
                    style={{ background: 'linear-gradient(135deg, #14b8a6, #a855f7)' }}
                  >
                    {userName ? userName[0].toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{userName || 'Creator'}</p>
                    <p className="text-xs text-teal-600 font-semibold">Premium Plan</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className={inputClass}
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Default Platform</label>
                  <select
                    value={defaultPlatform}
                    onChange={(e) => setDefaultPlatform(e.target.value)}
                    className={inputClass}
                  >
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Twitter">Twitter / X</option>
                    <option value="Instagram">Instagram</option>
                  </select>
                  <p className="text-xs text-slate-400 mt-2">
                    This platform will be pre-selected when you navigate to the Create page.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  {saved && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-sm font-semibold text-teal-600 flex items-center gap-1.5"
                    >
                      ✓ Saved successfully
                    </motion.span>
                  )}
                  <div className="ml-auto">
                    <Button onClick={handleSave} icon={<Save className="w-4 h-4" />}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </motion.div>
          )}

          {activeSection !== 'profile' && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'linear-gradient(135deg, rgba(20,184,166,0.12), rgba(168,85,247,0.08))' }}
              >
                <span className="text-teal-500">
                  {SECTIONS.find((s) => s.id === activeSection)?.icon}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">
                {SECTIONS.find((s) => s.id === activeSection)?.label} Settings
              </h3>
              <p className="text-sm text-slate-400 max-w-xs">
                This section is coming soon. Check back in the next update!
              </p>
            </motion.div>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
