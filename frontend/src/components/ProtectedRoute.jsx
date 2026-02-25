// src/components/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, requiredPlan }) => {
  const location = useLocation();
  const { user, loading, hasPlan } = useAuth();

  console.log('🛡️ ProtectedRoute - loading:', loading, 'user:', user?.email); // ← LOG

  if (loading) {
    console.log('⏳ ProtectedRoute: chargement...');
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-white">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    console.log('➡️ ProtectedRoute: pas d\'utilisateur, redirection vers login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiredPlan && !hasPlan(requiredPlan)) {
    console.log('➡️ ProtectedRoute: plan insuffisant, redirection vers select-plan');
    return <Navigate to="/select-plan" replace />;
  }

  console.log('✅ ProtectedRoute: affichage du dashboard');
  return children;
};

export default ProtectedRoute;