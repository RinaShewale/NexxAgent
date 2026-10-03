import { Navigate, useLocation } from 'react-router-dom';
import authHook, { useAuth as useAuthNamed } from '../../hooks/useAuth';

// Supports both default and named export of useAuth
const useAuthHook = authHook || useAuthNamed;

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuthHook();
  const location = useLocation();

  // Avoid rendering protected content until authentication has been checked.
  if (loading) {
    return null;
  }

  // 2. If user is NOT logged in, redirect to /login and preserve attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. User is authenticated, render the page
  return children;
}