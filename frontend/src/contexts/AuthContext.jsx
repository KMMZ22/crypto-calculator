// src/contexts/AuthContext.jsx - VERSION COMPLÈTE
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';


const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    // Vérifier la session au démarrage
    checkUser();

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          fetchUserProfile(session.user.id);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      
      const { data: { user }, error } = await supabase.auth.getUser();
    
      if (error) {
        // Gestion spécifique des erreurs de session
        if (error.message && (
          error.message.includes('Auth session missing') ||
          error.message.includes('Invalid Refresh Token') ||
          error.message.includes('Session expired')
        )) {
          // Session invalide ou expirée - pas une erreur grave
          console.log('🔐 Session invalide - déconnexion automatique');
          setUser(null);
        } else {
          // Autre erreur
          console.error('❌ Erreur vérification utilisateur:', error);
        }
      } else if (user) {
        console.log('✅ Utilisateur connecté:', user.email);
        setUser(user);
        await fetchUserProfile(user.id);
      } else {
        console.log('👤 Aucun utilisateur connecté');
        setUser(null);
      }
    } catch (error) {
      console.error('❌ Erreur inattendue dans checkUser:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };


  // ========== FONCTIONS AJOUTÉES ==========

  // 🔥 FONCTION D'INSCRIPTION (manquante)
  const signup = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            subscription_plan: 'FREE',
            credits: 10
          }
        }
      });

      if (error) throw error;

      // Créer le profil utilisateur
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            email: email,
            username: email.split('@')[0],
            subscription_plan: 'FREE',
            credits: 10,
            trial_ends_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours d'essai
          });

        if (profileError) throw profileError;
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erreur inscription:', error);
      throw error;
    }
  };

  // 🔥 FONCTION DE CONNEXION (manquante)
  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('Erreur connexion:', error);
      throw error;
    }
  };

  // 🔥 FONCTION DE DÉCONNEXION (corrigée)
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      navigate('/login'); // ✅ Utilise navigate ici
    } catch (error) {
      console.error('Erreur déconnexion:', error);
      throw error;
    }
  };

  const getUserPlan = () => {
    if (!user) return 'FREE';
    return user.profile?.subscription_plan || 'FREE';
  };

  const updateUserPlan = async (newPlan) => {
    if (!user) return { success: false, error: 'Non authentifié' };

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          subscription_plan: newPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      // Mettre à jour le state local
      setUser(prev => ({
        ...prev,
        profile: {
          ...prev.profile,
          subscription_plan: newPlan
        }
      }));

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // ========== VALEUR DU CONTEXTE ==========

  const value = {
    // État
    user: user ? {
      id: user.id,
      email: user.email,
      profile: user.profile || {}
    } : null,
    
    loading,
    isSignedIn: !!user,
    
    // Plan
    userPlan: getUserPlan(),
    updateUserPlan,
    
    // 🔥 FONCTIONS D'AUTHENTIFICATION (AJOUTÉES)
    signup,  // ✅ AJOUTÉ
    login,   // ✅ AJOUTÉ
    signOut,
    
    // Vérification de plan
    hasPlan: (requiredPlan) => {
      const userPlan = getUserPlan();
      const planHierarchy = {
        'FREE': 0,
        'PRO': 1,
        'ELITE': 2
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