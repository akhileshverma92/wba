import React, { useState, useEffect } from "react";
import { account } from "../services/Appwriteconfig";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    checkCurrentUser();
  }, []);

  // Check for OAuth callback parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      // OAuth success - check user session
      checkCurrentUser();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('error')) {
      setError('Authentication failed. Please try again.');
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const checkCurrentUser = async () => {
    try {
      const userData = await account.get();
      setUser(userData);
    } catch (error) {
      console.log("No active session");
      setUser(null);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Use proper URLs with success/failure callbacks
      await account.createOAuth2Session(
        "google", 
        `${window.location.origin}/?success=true`,  // Success URL
        `${window.location.origin}/?error=true`     // Failure URL
      );
    } catch (error) {
      console.error("Error logging in with Google:", error);
      setError("Failed to initiate Google login. Please try again.");
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
      setError("Failed to logout. Please try again.");
    }
  };

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show user dashboard if authenticated
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">Welcome!</h2>
                <p className="text-gray-600">{user.name || 'User'}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              
              <button
                onClick={handleLogout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show login form
  return (
    // When NOT logged in (login form)



 
  <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center items-center px-4 py-12">
    <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl text-center">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
        🏕️ Aao bhai... HostelCart mein ghuso!
      </h2>

      <p className="text-sm text-gray-600 mb-6">
        Flipkart mehenga hai? Bazar jaane ka mann nahi? <br />
        Toh yahin mil jaayega sab kuch! 😎 <br />
        <span className="text-purple-600 font-semibold">
          Login karo HostelCart Kanpur pe aur semester bachao, izzat ke saath 🫡
        </span>
      </p>

      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-300 text-red-700 px-4 py-3 rounded-xl text-sm">
          🔥 {error} (lagta hai Wi-Fi ne dhoka de diya 😅)
        </div>
      )}

      {/* Google Sign In Button */}
      <button
        onClick={loginWithGoogle}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white text-gray-800 font-medium border border-gray-300 rounded-xl shadow hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-b-2 border-blue-600 rounded-full"></div>
            Thoda ruk ja bhai... chai ban rahi hai ☕
          </>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            Sign in with Google 📧 (kyunki password kisko yaad rehta hai bhai?)
          </>
        )}
      </button>

      <p className="text-xs text-gray-500 mt-6">
        🔒 Tension na lo, Maggie nahi churaenge... sirf vibes share karenge 😌
      </p>
    </div>
  </div>

);

  
};

export default Login;