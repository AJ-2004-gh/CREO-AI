'use client';

import { motion } from 'framer-motion';

export default function LoginPage() {
  const handleCognitoLogin = () => {
    // Clear any existing session first
    localStorage.removeItem('creo_token');
    localStorage.removeItem('creo_user');
    
    // ⚠️ IMPORTANT: Change this redirectUri to your local environment for testing!
    const redirectUri = 'http://localhost:3000/api/auth/callback';
    
    // Your Cognito details
    const domain = 'us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com';
    const clientId = '4b9em2599sm42256qpnork0817';
    
    const authUrl = `https://${domain}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Redirect the user to the AWS Cognito Hosted UI
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[28rem] h-[28rem] bg-indigo-400/20 rounded-full blur-3xl pointer-events-none"
        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
      >
        {/* Header */}
        <div className="text-center mb-10">
          <motion.div 
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl mb-6 shadow-xl shadow-indigo-500/30"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <span className="text-white font-black text-3xl">C</span>
          </motion.div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 mb-2">
            Welcome to CREO-AI
          </h1>
          <p className="text-gray-500 text-sm font-medium">Your premium social media content studio</p>
        </div>

        {/* Login Card */}
        <motion.div 
          className="glass p-8 rounded-3xl"
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={handleCognitoLogin}
            className="w-full btn-gradient py-3.5 rounded-xl font-semibold text-sm transition-all focus:ring-4 focus:ring-indigo-500/20 active:scale-[0.98]"
          >
            Enter Workspace
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-px bg-gray-200 flex-1"></span>
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Secured Access</span>
            <span className="h-px bg-gray-200 flex-1"></span>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Powered by AWS Cognito
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}