import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const ElitePlanGuard = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [checkingPlan, setCheckingPlan] = useState(true);
  const [isElite, setIsElite] = useState(false);
  const [usage, setUsage] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      checkElitePlan();
    }
  }, [user, authLoading]);

  const checkElitePlan = async () => {
    setCheckingPlan(true);
    
    // Si pas connecté, rediriger vers login
    if (!user) {
      navigate('/signup');
      return;
    }

    try {
      // 1. Vérifier l'abonnement dans user_subscriptions
      const { data: subscription, error: subError } = await supabase
        .from('user_subscriptions')
        .select('plan_name, status, current_period_end')
        .eq('user_id', user.id)
        .single();

      if (subError || !subscription || subscription.plan_name !== 'elite') {
        // Rediriger vers la page de choix de plan avec un message
        navigate('/select-plan', {
          state: {
            message: '🚀 Accès Réservé aux Membres ELITE',
            description: "L'AI Advisor utilise l'intelligence artificielle pour analyser vos trades avec précision. Cette fonctionnalité est exclusive au plan ELITE (49€/mois).",
            upgradeRequired: true
          }
        });
        return;
      }

      // 2. Vérifier si l'abonnement est actif
      const isActive = subscription.status === 'active' && 
                      (!subscription.current_period_end || 
                       new Date(subscription.current_period_end) > new Date());
      
      if (!isActive) {
        navigate('/select-plan', {
          state: {
            message: 'Abonnement ELITE expiré',
            description: 'Votre abonnement ELITE a expiré. Renouvelez-le pour accéder à l\'AI Advisor.',
            upgradeRequired: true
          }
        });
        return;
      }

      // 3. Vérifier l'usage mensuel (50 analyses max)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: analyses, error: usageError } = await supabase
        .from('ai_analyses')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString());

      if (!usageError) {
        const used = analyses?.length || 0;
        const remaining = Math.max(0, 50 - used);
        
        setUsage({
          used,
          remaining,
          limit: 50,
          percentUsed: (used / 50) * 100
        });

        // Si limite atteinte, afficher warning mais permettre l'accès
        if (used >= 50) {
          console.warn(`Limite d'analyses AI atteinte: ${used}/50`);
          // On permet l'accès mais l'analyse échouera avec un message clair
        }
      }

      setIsElite(true);
    } catch (error) {
      console.error('Erreur vérification plan ELITE:', error);
      // En cas d'erreur, on redirige vers select-plan
      navigate('/select-plan', {
        state: {
          message: 'Erreur de vérification',
          description: 'Impossible de vérifier votre abonnement. Contactez le support.',
          upgradeRequired: false
        }
      });
    } finally {
      setCheckingPlan(false);
    }
  };

  // Loading states
  if (authLoading || checkingPlan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full"></div>
            </div>
          </div>
          <p className="mt-6 text-gray-300 font-medium">Vérification de votre accès ELITE...</p>
          <p className="mt-2 text-sm text-gray-500">Analyse de votre abonnement et limites d'usage</p>
        </div>
      </div>
    );
  }

  // Si pas ELITE, le composant a déjà redirigé
  if (!isElite) {
    return null;
  }

  // Si ELITE, afficher les enfants avec la bannière d'usage
  return (
    <div>
      {/* Bannière d'usage en haut */}
      {usage && usage.remaining < 10 && (
        <div className={`sticky top-0 z-50 ${usage.remaining === 0 ? 'bg-gradient-to-r from-red-900/90 to-rose-900/90' : 'bg-gradient-to-r from-amber-900/90 to-yellow-900/90'} text-white p-3 text-center border-b ${usage.remaining === 0 ? 'border-red-700' : 'border-amber-700'}`}>
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">{usage.remaining === 0 ? '⛔' : '⚠️'}</span>
              <div>
                <p className="font-semibold">
                  {usage.remaining === 0 
                    ? 'Limite d\'analyses atteinte!' 
                    : 'Attention: limite d\'analyses approche'}
                </p>
                <p className="text-sm opacity-90">
                  {usage.used}/{usage.limit} analyses AI ce mois ({usage.remaining} restantes)
                </p>
              </div>
            </div>
            {usage.remaining === 0 && (
              <button
                onClick={() => navigate('/select-plan')}
                className="px-4 py-2 bg-white text-red-700 font-semibold rounded-lg hover:bg-gray-100 transition"
              >
                Upgrade
              </button>
            )}
          </div>
          
          {/* Barre de progression */}
          <div className="mt-2 max-w-2xl mx-auto">
            <div className="h-2 bg-black/30 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${usage.percentUsed >= 100 ? 'bg-red-500' : usage.percentUsed >= 80 ? 'bg-amber-500' : 'bg-green-500'}`}
                style={{ width: `${Math.min(100, usage.percentUsed)}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      {children}

      {/* Footer avec info usage */}
      {usage && (
        <div className="fixed bottom-4 right-4 bg-gray-900/90 backdrop-blur-sm border border-gray-700 rounded-xl p-3 shadow-2xl z-40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-bold">AI</span>
            </div>
            <div>
              <p className="text-xs text-gray-400">Analyses AI ce mois</p>
              <p className="font-semibold">
                <span className={usage.remaining === 0 ? 'text-red-400' : usage.remaining < 10 ? 'text-amber-400' : 'text-green-400'}>
                  {usage.used}/{usage.limit}
                </span>
                <span className="text-xs text-gray-500 ml-2">({usage.remaining} restantes)</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ElitePlanGuard;