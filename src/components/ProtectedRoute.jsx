// src/components/ProtectedRoute.jsx - VERSION SIMPLE
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  return (
    <>
      <SignedIn>
        {children}
      </SignedIn>
      
      <SignedOut>
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      </SignedOut>
    </>
  );
};

export default ProtectedRoute;