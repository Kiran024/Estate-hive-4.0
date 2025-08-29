import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children, requireAuth = true }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  // If authentication is required and user is not logged in
  if (requireAuth && !user) {
    // Save the attempted location for redirect after login
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  // User is authenticated or auth not required, render children
  return children;
};

export default ProtectedRoute;