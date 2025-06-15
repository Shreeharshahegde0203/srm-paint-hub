
import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '../contexts/SupabaseAuthContext';

const AdminLogin = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  if (user) {
    // If logged in, redirect to admin panel
    return <Navigate to="/admin" replace />;
  }

  // Redirect immediately to /auth for login/signup
  React.useEffect(() => {
    navigate('/auth');
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-lg font-medium">Redirecting to login...</div>
    </div>
  );
};

export default AdminLogin;
