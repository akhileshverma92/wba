import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, MapPin, Star, Heart, Award, Trophy, Camera, Edit3, Settings, LogOut, Volume2, VolumeX, ShoppingBag, Clock, Zap, Shield, CheckCircle } from 'lucide-react';
import { account } from '../services/Appwriteconfig';

const Profile = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAvatarSpinning, setIsAvatarSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [showEasterEgg, setShowEasterEgg] = useState(false);
  const [userData, setUserData] = useState({});
  const [loading, setLoading] = useState(true);
const funQuotes = [
  "Mess ki biryani se zyada spicy profile! 🌶️",
  "Assignment pending, maggie ready 🍜",
  "Jugaad is my middle name 😎",
  "Hostel ka Elon Musk — bas budget thoda tight hai 💸",
  "Masti bhi, dosti bhi, aur thoda sa dhandha bhi 😁",
  "Notes becho, Maggie lo — HostelCart Zindabad! 📚",
  "Room 101 se business chal raha hai 🧠",
  "Bunk maar ke trading kar raha hu 😂"
];


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % funQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleAvatarClick = () => {
    setIsAvatarSpinning(true);
    setClickCount(prev => prev + 1);

    if (clickCount >= 4) {
      setShowConfetti(true);
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowEasterEgg(false);
      }, 3000);
      setClickCount(0);
    }

    setTimeout(() => setIsAvatarSpinning(false), 1000);

    if (soundEnabled) {
      console.log("🎵 Boing!");
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUser = async () => {
    try {
      setLoading(true);
      const user = await account.get();
      setUserData(user);
      console.log(user);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  // Generate avatar from name initials
  const getAvatarUrl = (name) => {
    if (!name) return '';
    const initials = name.split(' ').map(word => word[0]).join('').toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=fff&size=200&font-size=0.6`;
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      // Redirect to login or handle logout
      window.location.href = '/login';
    } catch (error) {
      console.log('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Ruko zara... profile garma garam ban raha hai 😋</p>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 text-4xl animate-bounce">🎨</div>
        <div className="absolute top-32 right-16 text-3xl animate-pulse">⭐</div>
        <div className="absolute bottom-40 left-20 text-2xl animate-spin">✨</div>
        <div className="absolute bottom-20 right-32 text-4xl animate-bounce">🎯</div>
        <div className="absolute top-60 left-1/3 text-2xl animate-pulse">🌟</div>
        <div className="absolute top-80 right-1/4 text-3xl animate-bounce">🎪</div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none z-30">
            <div className="absolute top-1/4 left-1/4 text-4xl animate-bounce">🎉</div>
            <div className="absolute top-1/3 right-1/4 text-3xl animate-pulse">🎊</div>
            <div className="absolute bottom-1/3 left-1/3 text-4xl animate-bounce delay-300">✨</div>
            <div className="absolute bottom-1/4 right-1/3 text-3xl animate-pulse delay-500">🌟</div>
          </div>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Your Profile
              <span className="text-2xl ml-2">👤</span>
            </h1>
            <p className="text-gray-600 mt-1">Manage your HostelCart presence</p>
          </div>
          <div className="flex gap-3">
           
            <button 
              onClick={handleLogout}
              className="bg-red-100 hover:bg-red-200 p-3 rounded-xl transition-all duration-300 border border-red-200"
            >
              <LogOut size={20} className="text-red-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="relative z-10 px-4 pb-8">
        <div className="max-w-6xl mx-auto">

          {/* Main Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8">

              {/* Avatar Section */}
              <div className="text-center lg:text-left">
                <div className="relative">
                  <div
                    className={`relative inline-block cursor-pointer ${isAvatarSpinning ? 'animate-spin' : 'hover:scale-105'} transition-transform duration-500`}
                    onClick={handleAvatarClick}
                  >
                    <img
                      src={getAvatarUrl(userData.name)}
                      alt={userData.name || 'User'}
                      className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-white shadow-xl"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                      <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                
                </div>

                <div className="mt-6">
                  {/* <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 flex items-center gap-2 mx-auto lg:mx-0">
                    <Edit3 size={16} />
                    Edit Photo
                  </button> */}
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800">{userData.name || 'User'}</h2>
                  <span className="text-2xl">👋</span>
                  {userData.emailVerification && (
                    <CheckCircle size={24} className="text-green-500" title="Email Verified" />
                  )}
                </div>

                {/* Dynamic Quote */}
                <div className="h-8 flex items-center justify-center lg:justify-start mb-8">
                  <p className="text-lg text-gray-600 animate-fade-in-out italic">
                    {funQuotes[currentQuote]}
                  </p>
                </div>

                {/* User Details Grid */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors duration-300">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Mail size={20} className="text-blue-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">{userData.email}</span>
                        {userData.emailVerification && (
                          <span className="text-xs text-green-600 flex items-center gap-1">
                            <CheckCircle size={12} />
                            Verified
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl border border-green-100 hover:bg-green-100 transition-colors duration-300">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Calendar size={20} className="text-green-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">Joined</span>
                        <span className="text-sm">{formatDate(userData.registration)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors duration-300">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Zap size={20} className="text-yellow-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">Last Active</span>
                        <span className="text-sm">{formatDateTime(userData.accessedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors duration-300">
                    <div className="flex items-center gap-3 text-gray-700">
                      <Shield size={20} className="text-purple-500" />
                      <div className="flex flex-col">
                        <span className="font-medium">Account Status</span>
                        <span className={`text-sm ${userData.status ? 'text-green-600' : 'text-red-600'}`}>
                          {userData.status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Stats */}
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">{userData.$id ? userData.$id.slice(-4) : '****'}</div>
                      <div className="text-sm text-gray-600">User ID</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{userData.targets?.length || 0}</div>
                      <div className="text-sm text-gray-600">Auth Methods</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-pink-600">{userData.mfa ? 'ON' : 'OFF'}</div>
                      <div className="text-sm text-gray-600">2FA Status</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
               
              </div>
            </div>
          </div>

          {/* Easter Egg */}
          {showEasterEgg && (
            <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-2xl font-bold text-lg text-center animate-bounce shadow-xl">
              🎉 Awesome! You found the secret! You're officially the coolest trader in the hostel! 🎉
            </div>
          )}

          {/* Footer Tip */}
          <div className="mt-8 text-center">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
             <p className="text-gray-600">💡 <strong>Kanpuriya Tip:</strong> Profile pic ko 5 baar tap karo... aur jadoo dekho! ✨</p>
<p className="mt-2 text-gray-500 text-sm">Hostel ke most wanted ho tum — swag level: {Math.floor(Math.random() * 10 + 90)}% 😎</p>
 </div>
          </div>
        </div>
      </div>

      {/* CSS Animation */}
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

export default Profile;