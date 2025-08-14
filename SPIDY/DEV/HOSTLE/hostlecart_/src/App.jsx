import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import ListProduct from './pages/ListProduct';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import UploadProduct from './pages/UploadProduct';
import Header from './components/Header';
import Login from './pages/Login';
import ProtectedRoute from './services/ProtectedRoute';
import Verify from './pages/Verify';

function App() {
  return (
    <div className="main-container w-full h-screen bg-gray-600">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        
        <Route path="/login" element={<Login />} />

        <Route 
      
          path="/sell" 
          element={
            <ProtectedRoute>
              <UploadProduct />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/products" 
          element={
            <ProtectedRoute>
              <ListProduct />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
         <Route path="/verify" element={<Verify />} />

        <Route 
          path="*" 
          element={<NotFound />} 
        />
      </Routes>
    </div>
  );
}

export default App;
