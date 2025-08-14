import React, { useState, useEffect } from 'react';
import { Loader2, Shield } from 'lucide-react';
import { ID } from "appwrite";
import { account } from "../services/Appwriteconfig";

const Login = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [currentQuote, setCurrentQuote] = useState(0);

  const inspiringQuotes = [
    "Connect with your hostel community! 🏠",
    "Trade, share, and make friends! 👥",
    "Your marketplace adventure begins here! 🚀",
    "Building connections, one trade at a time! ✨",
    "Where students meet opportunity! 🎯"
  ];

  // Rotate quotes every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % inspiringQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleMagicURLLogin = async () => {
    setLoading(true);
    setErrors({});
    setMessage('');

    try {
      const isProduction =
        window.location.hostname !== 'localhost' &&
        window.location.hostname !== '127.0.0.1';

      const redirectUrl = isProduction
        ? "https:///verify"
        : "http://localhost:5173/verify";

      await account.createMagicURLToken(ID.unique(), email, redirectUrl);
      setMessage("A login link has been sent to your email. Please check your inbox.");
    } catch (error) {
      console.error("Magic URL error:", error);
      setErrors({ general: "Failed to send magic link. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-pulse opacity-20">🏠</div>
        <div className="absolute top-40 right-16 text-4xl animate-bounce opacity-20">🎯</div>
        <div className="absolute bottom-32 left-20 text-5xl animate-spin opacity-20">⭐</div>
        <div className="absolute bottom-20 right-32 text-4xl animate-pulse opacity-20">🚀</div>
        <div className="absolute top-60 left-1/3 text-3xl animate-bounce opacity-20">✨</div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
            <Shield className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Welcome to HostleCart!
          </h1>
          <div className="h-6 flex items-center justify-center">
            <p className="text-gray-600 animate-fade-in-out">
              {inspiringQuotes[currentQuote]}
            </p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
            <h2 className="text-2xl font-bold text-center">Sign In with Email</h2>
            <p className="text-center text-indigo-100 mt-2">
              We'll send you a secure login link
            </p>
          </div>

          <div className="p-8">
            {/* Error Display */}
            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">!</span>
                  </div>
                  <span className="text-red-700 text-sm">{errors.general}</span>
                </div>
              </div>
            )}

            {/* Success message */}
            {message && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                <span className="text-green-700 text-sm">{message}</span>
              </div>
            )}

            {/* Email Input */}
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-indigo-500"
            />

            {/* Send Magic Link Button */}
            <button
              onClick={handleMagicURLLogin}
              disabled={loading || !email}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin w-6 h-6" />
              ) : (
                <span className="text-lg">Send Login Link</span>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-out {
          0%, 100% { opacity: 0.7; transform: translateY(5px); }
          50% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-out {
          animation: fade-in-out 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Login;
