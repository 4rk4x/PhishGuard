import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, isAuthenticated, loading, isAdmin } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-navy-border border-t-electric rounded-full animate-spin"></div>
        <p className="mt-4 text-navy-muted font-mono text-sm">Verifying cryptographic session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="max-w-xl mx-auto my-16 p-8 bg-navy-surface border border-red-500/30 rounded-xl text-center">
        <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-offwhite mb-2">Access Denied: Administrative Scope Required</h2>
        <p className="text-navy-muted text-sm mb-6">
          This module is reserved for Lead Security Auditors and Professor Examiners with elevated administrative roles.
        </p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2.5 bg-navy-card border border-navy-border hover:border-electric text-offwhite text-sm rounded-lg transition"
        >
          Return to Previous View
        </button>
      </div>
    );
  }

  return children;
};

