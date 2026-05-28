import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center relative overflow-hidden">
        {/* Glowing background highlights */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-radial-gradient rounded-full pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-radial-gradient-cyan rounded-full pointer-events-none"></div>
        
        {/* Loading Spinner */}
        <div className="z-10 flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin"></div>
          <p className="mt-4 text-brand-textSecondary text-sm tracking-wider font-light uppercase">Loading session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
