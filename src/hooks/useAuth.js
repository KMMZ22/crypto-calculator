import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const getUserPlan = () => {
    return user?.user_metadata?.plan || 'free';
  };

  const getUsername = () => {
    return user?.user_metadata?.username || user?.user_metadata?.full_name || user?.email?.split('@')[0];
  };

  return {
    user,
    loading,
    signOut,
    getUserPlan,
    getUsername,
    isAuthenticated: !!user
  };
}