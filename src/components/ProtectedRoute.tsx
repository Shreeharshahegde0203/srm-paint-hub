
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

/**
 * Checks if the user is authenticated using Supabase.
 * Optionally, restrict to a certain email (admin).
 */
interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean; // future extensibility
}

const ADMIN_EMAIL = "admin@admin.com"; // Change as needed for your admin

const ProtectedRoute = ({ children, adminOnly = false }: ProtectedRouteProps) => {
  const { user, loading } = useSupabaseAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Not logged in
    return <Navigate to="/auth" replace />;
  }

  if (adminOnly && user.email !== ADMIN_EMAIL) {
    // Not an admin user
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
