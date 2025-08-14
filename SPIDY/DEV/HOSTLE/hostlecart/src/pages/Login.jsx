import React, { useState, useEffect } from 'react';
import { Loader2, Shield, Sparkles } from 'lucide-react';
import { account } from "../services/Appwriteconfig";

const Login = () => {
    const [googleLoading, setGoogleLoading] = useState(false);
    const [errors, setErrors] = useState({});
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

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        setErrors({});

        try {
            // Determine URLs based on environment
            const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
            
            const successUrl = isProduction 
                ? "https://hostlecartkanpur.vercel.app/"
                : "http://localhost:5173/";
                
            const failureUrl = isProduction 
                ? "https://hostlecartkanpur.vercel.app/login"
                : "http://localhost:5173/login";

            // Redirect to Google OAuth
            account.createOAuth2Session(
                'google',
                successUrl,
                failureUrl
            );
        } catch (error) {
            console.error('Google auth error:', error);
            setErrors({ general: 'Google authentication failed. Please try again.' });
            setGoogleLoading(false);
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
                    {/* Form Header */}
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white">
                        <h2 className="text-2xl font-bold text-center">
                            Sign In with Google
                        </h2>
                        <p className="text-center text-indigo-100 mt-2">
                            Access your hostel marketplace securely
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

                        {/* Google OAuth Button */}
                        <button
                            onClick={handleGoogleLogin}
                            disabled={googleLoading}
                            className="w-full bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-6 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {googleLoading ? (
                                <Loader2 className="animate-spin w-6 h-6" />
                            ) : (
                                <svg className="w-6 h-6" viewBox="0 0 24 24">
                                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                </svg>
                            )}
                            <span className="group-hover:text-gray-800 transition-colors text-lg">
                                {googleLoading ? 'Signing in...' : 'Continue with Google'}
                            </span>
                        </button>

                        {/* Benefits Section */}
                        <div className="mt-8 space-y-3">
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                <span className="text-sm">Quick and secure authentication</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                <span className="text-sm">No need to remember passwords</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                                <span className="text-sm">Instant access to your marketplace</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
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