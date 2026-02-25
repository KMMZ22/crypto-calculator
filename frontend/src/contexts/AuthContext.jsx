// src/contexts/AuthContext.jsx - Version avec messages d'erreur améliorés
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      if (error) throw error;
      setProfile(data);
      setUser(prev => ({ ...prev, profile: data }));
      return data;
    } catch (error) {
      console.error('❌ Erreur chargement profil:', error);
      return null;
    }
  };

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        if (error.message?.includes('Auth session missing') ||
          error.message?.includes('Invalid Refresh Token') ||
          error.message?.includes('Session expired')) {
          console.log('🔐 Session invalide');
          setUser(null);
          setProfile(null);
        } else {
          console.error('❌ Erreur vérification utilisateur:', error);
        }
      } else if (user) {
        console.log('✅ Utilisateur connecté:', user.email);
        setUser(user);
        await fetchUserProfile(user.id);
      } else {
        console.log('👤 Aucun utilisateur connecté');
        setUser(null);
        setProfile(null);
      }
    } catch (error) {
      console.error('❌ Erreur inattendue dans checkUser:', error);
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (loading) {
        console.warn('⚠️ AuthContext timeout - force loading false');
        setLoading(false);
      }
    }, 5000);
    checkUser();
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Auth event:', event);
        try {
          if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
            if (session?.user) {
              setUser(session.user);
              const existingProfile = await fetchUserProfile(session.user.id);

              // Fallback : si le profil n'existe pas encore (cas confirmation email),
              // on le crée maintenant que la session est active.
              if (!existingProfile && event === 'SIGNED_IN') {
                console.log('ℹ️ Profil manquant, création lors du SIGNED_IN...');
                const username = session.user.user_metadata?.username
                  || session.user.email?.split('@')[0];
                const { error: profileError } = await supabase.from('profiles').upsert({
                  id: session.user.id,
                  email: session.user.email,
                  username,
                  subscription_plan: 'free',
                  created_at: new Date().toISOString()
                }, { onConflict: 'id' });

                if (profileError) {
                  console.error('❌ Erreur création profil (fallback SIGNED_IN):', profileError);
                } else {
                  console.log('✅ Profil créé via fallback SIGNED_IN');
                  await fetchUserProfile(session.user.id);
                }
              }
            }
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            setProfile(null);
            localStorage.removeItem('pending_upgrade');
          }
        } catch (error) {
          console.error('❌ Erreur dans auth listener:', error);
        } finally {
          setLoading(false);
        }
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email, password, username) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username || email.split('@')[0]
          }
        }
      });

      if (error) {
        console.error('❌ Erreur inscription Supabase:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Attendre que la session soit établie avant d'insérer le profil.
        // signUp retourne l'user mais la session JWT peut ne pas encore être active,
        // ce qui cause une erreur 401 si on insère immédiatement.
        let session = data.session;

        if (!session) {
          // Si pas de session immédiate (ex: confirmation email activée),
          // on essaie de récupérer la session jusqu'à 3 fois avec un délai.
          for (let i = 0; i < 3; i++) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const { data: sessionData } = await supabase.auth.getSession();
            if (sessionData?.session) {
              session = sessionData.session;
              break;
            }
          }
        }

        if (session) {
          // Session active : on peut insérer le profil en toute sécurité
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: data.user.id,
            email: data.user.email,
            username: username || email.split('@')[0],
            subscription_plan: 'free',
            created_at: new Date().toISOString()
          }, { onConflict: 'id' });

          if (profileError) {
            // On log l'erreur mais on ne bloque pas l'inscription
            console.error('❌ Erreur création profil (non-bloquant):', profileError);
          } else {
            console.log('✅ Profil créé avec succès');
          }
        } else {
          // Pas de session (confirmation email requise) : le profil sera créé
          // par un trigger Supabase ou lors de la première connexion après confirmation.
          console.log('ℹ️ Pas de session immédiate (confirmation email ?). Le profil sera créé à la connexion.');
        }
      }

      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Erreur inscription:', error);
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data.user) {
        setUser(data.user);
        await fetchUserProfile(data.user.id);
      }
      return { success: true, user: data.user };
    } catch (error) {
      console.error('❌ Erreur connexion:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchUserProfile(user.id);
  };

  const getUserPlan = () => profile?.subscription_plan || 'free';

  const updateUserPlan = async (newPlan) => {
    if (!user) return { success: false, error: 'Non authentifié' };
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ subscription_plan: newPlan, updated_at: new Date().toISOString() })
        .eq('id', user.id);
      if (error) throw error;
      setProfile(prev => ({ ...prev, subscription_plan: newPlan }));
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur update plan:', error);
      return { success: false, error: error.message };
    }
  };

  const hasPlan = (requiredPlan) => {
    const userPlan = getUserPlan();
    const planHierarchy = { 'free': 0, 'pro': 1, 'elite': 2 };
    return (planHierarchy[userPlan] || 0) >= (planHierarchy[requiredPlan] || 0);
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated: !!user,
    userPlan: getUserPlan(),
    isPro: profile?.subscription_plan === 'pro',
    isElite: profile?.subscription_plan === 'elite',
    signup,
    login,
    logout,
    refreshProfile,
    updateUserPlan,
    hasPlan,
    getCredits: () => profile?.credits || 0
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};