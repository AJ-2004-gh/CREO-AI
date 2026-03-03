'use client';

export default function LoginPage() {
  const handleCognitoLogin = () => {
    // Clear any existing session first
    localStorage.removeItem('creo_token');
    localStorage.removeItem('creo_user');
    
    // ⚠️ IMPORTANT: Change this redirectUri to your local environment for testing!
    // Example: 'http://localhost:3000/api/auth/callback'
    const redirectUri = 'http://localhost:3000/api/auth/callback';
    
    // Your Cognito details
    const domain = 'us-east-1k82zi1ywn.auth.us-east-1.amazoncognito.com';
    const clientId = '4b9em2599sm42256qpnork0817';
    
    const authUrl = `https://${domain}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+phone&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Redirect the user to the AWS Cognito Hosted UI
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 rounded-2xl mb-4">
            <span className="text-white font-bold text-2xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to CREO-AI</h1>
          <p className="text-gray-500 mt-1 text-sm">Sign in to your content studio</p>
        </div>

        {/* Login Card */}
        <div className="card p-8 bg-white rounded-xl shadow-sm border border-gray-100">
          <button
            onClick={handleCognitoLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg text-sm transition-colors"
          >
            Sign in with Secure Login
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secured by AWS Cognito
        </p>
      </div>
    </div>
  );
}