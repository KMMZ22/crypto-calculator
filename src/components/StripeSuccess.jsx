import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase, subscriptionService } from '../services/supabase';
import { Check, Shield, Zap, Loader2 } from 'lucide-react';

const StripeSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');
  
  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const sessionId = searchParams.get('session_id');
        const success = searchParams.get('success');
        
        if (!sessionId || success !== 'true') {
          navigate('/dashboard');
          return;
        }
        
        // Ici, normalement tu appellerais ton backend pour vérifier la session
        // En frontend-only, on simule une mise à jour
        
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }
        
        // Récupérer le plan depuis l'URL ou les metadata
        const plan = searchParams.get('plan') || 'pro';
        
        // Mettre à jour le plan dans Supabase
        await subscriptionService.updateUserPlan(user.id, plan, {
          customerId: `cust_${Date.now()}`, // Simulé
          subscriptionId: sessionId,
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // +30 jours
        });
        
        setStatus('success');
        setMessage(`🎉 Félicitations ! Vous êtes maintenant sur le plan ${plan.toUpperCase()}`);
        
        // Redirection après 3 secondes
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } catch (error) {
        console.error('Erreur traitement succès:', error);
        setStatus('error');
        setMessage('Erreur lors de l\'activation de votre plan. Contactez le support.');
      }
    };
    
    handleSuccess();
  }, [searchParams, navigate]);
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {status === 'loading' && (
          <>
            <div className="w-20 h-20 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-4">Activation de votre plan...</h2>
            <p className="text-gray-400">Veuillez patienter</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-green-500" size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">🎉 Upgrade réussi !</h2>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3 text-green-400">
                <Zap size={20} />
                <span>Fonctionnalités PRO débloquées</span>
              </div>
              <div className="flex items-center justify-center gap-3 text-green-400">
                <Shield size={20} />
                <span>Accès prioritaire activé</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-6">Redirection vers le dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-20 h-20 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-500 text-3xl">!</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">⚠️ Problème d'activation</h2>
            <p className="text-gray-300 mb-6">{message}</p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition"
            >
              Retour au dashboard
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default StripeSuccess;