import React from 'react';
import { Routes, Route } from "react-router-dom";
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Home from './pages/Home';
import ListProduct from './pages/ListProduct';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import UploadProduct from './pages/UploadProduct';
import Header from './components/Header';
import Login from './pages/Login';

// Get your publishable key from environment variables
const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

// Component to handle protected routes
const ProtectedRoute = ({ children }) => {
  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

function App() {
  return (
    
        <div className="main-container w-full h-screen bg-gray-600">
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            
            {/* Login route - redirect to home if already signed in */}
            <Route path="/login" element={
              <>
                <SignedOut>
                  <Login />
                </SignedOut>
                <SignedIn>
                  <Home />
                </SignedIn>
              </>
            } />
            
            {/* Protected routes */}
            <Route path="/sell" element={
              <ProtectedRoute>
                <UploadProduct />
              </ProtectedRoute>
            } />
            
            <Route path="/products" element={
              <ProtectedRoute>
                <ListProduct />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="*" element={
              <ProtectedRoute>
                <NotFound />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
  );
}

export default App;