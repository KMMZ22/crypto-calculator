import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const ElitePlanGuard = ({ children }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isElite, setIsElite] = useState(false);

  useEffect(() => {
    checkPlan();
  }, [user]);

  const checkPlan = async () => {
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan_name')
        .eq('user_id', user.id)
        .single();

      if (error || !data || data.plan_name !== 'elite') {
        navigate('/select-plan', { 
          state: { message: 'L\'AI Advisor est réservé au plan ELITE (49€/mois)' }
        });
        return;
      }

      setIsElite(true);
    } catch (error) {
      console.error('Erreur vérification plan:', error);
      navigate('/select-plan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-400">Vérification de votre abonnement...</p>
        </div>
      </div>
    );
  }

  if (!isElite) {
    return null;
  }

  return children;
};

export default ElitePlanGuard;