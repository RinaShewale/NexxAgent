import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authHook, { useAuth as useAuthNamed } from '../../hooks/useAuth';

// Supports both default and named export of useAuth
const useAuthHook = authHook || useAuthNamed;

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthHook();
  const location = useLocation();

  // 1. While authentication status is checking, show a clean loading indicator
  if (loading) {
    return (
      <div className="fixed inset-0 w-screen h-screen bg-[#FDF3E4] flex items-center justify-center z-50">
        <div className="w-8 h-8 border-2 border-[#A35100] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. If user is NOT logged in, redirect to /login and preserve attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. User is authenticated, render the page
  return children;
}