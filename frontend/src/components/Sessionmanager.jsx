// src/components/SessionManager.jsx
import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const SessionManager = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    const validateSession = async () => {
      if (loading) return;

      try {
        const { data: { session: localSession } } = await supabase.auth.getSession();
        
        if (localSession) {
          console.log('🔍 Validation de la session pour:', localSession.user.email);
          
          const { data, error } = await supabase.auth.getUser();
          
          if (error || !data.user) {
            console.warn('⚠️ Session invalide détectée, nettoyage en cours...');
            await cleanupInvalidSession();
          } else {
            console.log('✅ Session valide:', data.user.email);
          }
        }
      } catch (error) {
        console.error('❌ Erreur lors de la validation de session:', error);
        await cleanupInvalidSession();
      }
    };

    const cleanupInvalidSession = async () => {
      try {
        console.log('🧹 Nettoyage de la session invalide...');
        
        await supabase.auth.signOut();
        
        localStorage.removeItem('supabase.auth.token');
        sessionStorage.clear();
        
        console.log('✅ Session nettoyée avec succès');
        
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?session_expired=true';
        }
      } catch (error) {
        console.error('❌ Erreur lors du nettoyage:', error);
      }
    };

    validateSession();
    
    const interval = setInterval(validateSession, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [loading]);

  return null;
};

export default SessionManager;