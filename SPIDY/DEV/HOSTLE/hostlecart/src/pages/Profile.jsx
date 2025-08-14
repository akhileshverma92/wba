import React, { useState, useEffect } from "react";
import { Mail, Calendar, CheckCircle, LogOut } from "lucide-react";
import { account } from "../services/Appwriteconfig"; // <-- import from your Appwrite client

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAvatarSpinning, setIsAvatarSpinning] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

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
    // Rotate quotes every 4s
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % funQuotes.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Fetch logged-in user
    account.get()
      .then(res => setUser(res))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleLogin = () => {
    account.createOAuth2Session("google", "http://localhost:5173", "https://hostlecartkanpur.vercel.app");
    // Replace redirect URLs with your production site URLs
  };

  const handleLogout = async () => {
    await account.deleteSession("current");
    window.location.reload();
  };

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
  };

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });

  const getAvatarUrl = (name) => {
    if (!name) return "";
    const initials = name.split(" ").map(word => word[0]).join("").toUpperCase();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=6366f1&color=fff&size=200&font-size=0.6`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Ruko zara... profile garma garam ban raha hai 😋</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Login to see your profile</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="px-4 py-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Your Profile <span className="text-2xl ml-2">👤</span>
            </h1>
            <p className="text-gray-600 mt-1">Manage your HostelCart presence</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-100 hover:bg-red-200 p-3 rounded-xl border border-red-200 transition-all"
          >
            <LogOut size={20} className="text-red-600" />
          </button>
        </div>
      </header>

      <div className="px-4 pb-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200 mb-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Avatar Section */}
              <div className="text-center">
                <div
                  className={`inline-block cursor-pointer ${isAvatarSpinning ? 'animate-spin' : 'hover:scale-105'} transition-transform`}
                  onClick={handleAvatarClick}
                >
                  <img
                    src={user.prefs?.avatar || getAvatarUrl(user.name)}
                    alt={user.name}
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                  />
                </div>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center lg:text-left">
                <div className="flex items-center gap-3 justify-center lg:justify-start mb-3">
                  <h2 className="text-3xl font-bold text-gray-800">{user.name}</h2>
                  <span className="text-2xl">👋</span>
                  <CheckCircle size={24} className="text-green-500" />
                </div>

                <p className="text-lg text-gray-600 animate-fade-in-out italic mb-6">{funQuotes[currentQuote]}</p>

                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <Mail size={20} className="text-blue-500" />
                    <div>
                      <span className="font-medium">{user.email}</span>
                      <span className="text-xs text-green-600 flex items-center gap-1">
                        <CheckCircle size={12} /> Verified
                      </span>
                    </div>
                  </div>

                  <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                    <Calendar size={20} className="text-green-500" />
                    <div>
                      <span className="font-medium">Joined</span>
                      <span className="text-sm">{formatDate(user.registration)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-xl border border-indigo-100">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{user.$id.slice(-4)}</div>
                    <div className="text-sm text-gray-600">User ID</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {showEasterEgg && (
            <div className="mt-8 bg-gradient-to-r from-yellow-400 to-orange-400 text-white p-6 rounded-2xl text-lg text-center font-bold shadow-xl animate-bounce">
              🎉 Awesome! You found the secret! You're officially the coolest trader in the hostel! 🎉
            </div>
          )}
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

export default Profile;
