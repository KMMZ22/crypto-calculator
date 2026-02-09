// src/contexts/AuthContext.jsx - VERSION ULTRA SIMPLE
import { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { user, isLoaded, isSignedIn } = useUser();
  const { signOut: clerkSignOut } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Chargement initial
    if (isLoaded) {
      setLoading(false);
    }
  }, [isLoaded]);

  const signOut = async () => {
    try {
      await clerkSignOut();
      window.location.href = '/login';
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  // Récupérer le plan depuis les métadonnées Clerk
  const getUserPlan = () => {
    if (!user) return 'free';
    return user.publicMetadata?.plan || 'free';
  };

  // Mettre à jour le plan (pour après paiement Stripe)
  const updateUserPlan = async (newPlan) => {
    // Cette fonction sera complétée plus tard
    console.log('Plan mis à jour:', newPlan);
    return { success: true };
  };

  const value = {
    // État
    user: user ? {
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      publicMetadata: user.publicMetadata || {}
    } : null,
    
    loading,
    isSignedIn,
    
    // Plan
    userPlan: getUserPlan(),
    updateUserPlan,
    
    // Fonctions
    signOut,
    
    // Vérification de plan
    hasPlan: (requiredPlan) => {
      const userPlan = getUserPlan();
      const planHierarchy = {
        'free': 0,
        'pro_monthly': 1,
        'pro_yearly': 1,
        'elite_monthly': 2,
        'elite_yearly': 2
      };
      
      return (planHierarchy[userPlan] || 0) >= (planHierarchy[requiredPlan] || 0);
    }
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};