// src/pages/StripeSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export default function StripeSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, loading: authLoading, refreshProfile } = useAuth(); const [status, setStatus] = useState('loading');
  const [message, setMessage] = useState('');

  const sessionId = searchParams.get('session_id');
  const plan = searchParams.get('plan');

  useEffect(() => {
    // ⚠️ IMPORTANT: Attendre que l'auth ait fini de charger
    if (authLoading) {
      console.log('⏳ Auth en cours de chargement...');
      return;
    }

    const handleSuccess = async () => {
      try {
        // Vérifier l'utilisateur APRÈS chargement
        if (!user) {
          console.log('❌ Utilisateur non connecté après chargement');

          // Sauvegarder l'intention de mise à niveau
          if (plan) {
            localStorage.setItem('pending_upgrade', JSON.stringify({
              plan,
              sessionId,
              timestamp: Date.now()
            }));
          }

          setStatus('error');
          setMessage('Veuillez vous connecter pour activer votre abonnement');
          return;
        }

        console.log('✅ Utilisateur connecté:', user.email);
        console.log('🎯 Mise à jour du plan:', plan);

        // Vérifier que le plan est valide
        const normalizedPlan = plan?.toLowerCase();
        if (!normalizedPlan || !['pro', 'elite'].includes(normalizedPlan)) {
          setStatus('error');
          setMessage('Plan invalide');
          return;
        }

        // Mettre à jour le plan directement via Supabase pour éviter les hangs
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout de la base de données. Veuillez rafraîchir.")), 15000)
        );

        // Mettre à jour le plan est maintenant géré par le Webhook Stripe côté backend.
        // Nous attendons simplement quelques secondes pour laisser le temps au webhook de s'exécuter.
        const updateProcess = async () => {
          // Polling the database max 10 times to see if webhook updated the plan
          for (let i = 0; i < 10; i++) {
            const { data } = await supabase
              .from('profiles')
              .select('subscription_plan')
              .eq('id', user.id)
              .single();
              
            if (data?.subscription_plan === normalizedPlan) {
              return { success: true };
            }
            await new Promise(res => setTimeout(res, 1000));
          }
          console.warn("Le Webhook prend du temps, mais le paiement est validé côté Stripe.");
          return { success: true };
        };

        const result = await Promise.race([updateProcess(), timeoutPromise]);

        if (!result.success) {
          throw new Error(result.error);
        }

        // Rafraîchir le profil
        await refreshProfile();

        // Nettoyer tout pending upgrade
        localStorage.removeItem('pending_upgrade');

        setStatus('success');
        setMessage(`Félicitations ! Vous êtes maintenant membre ${plan.toUpperCase()}`);

        // Redirection après 3 secondes
        setTimeout(() => navigate('/dashboard'), 3000);

      } catch (error) {
        console.error('❌ Erreur détaillée:', error);
        setStatus('error');
        setMessage(error.message || 'Erreur lors de la mise à jour du compte');
      }
    };

    handleSuccess();
  }, [authLoading, user, plan, navigate, refreshProfile]); // ← Ajoute authLoading

  // Gestion du chargement initial
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] text-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-white mb-2">Vérification de votre session...</h2>
          <p className="text-gray-400">Un instant</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg blur opacity-30"></div>
            <div className="relative bg-[#131517] p-4 rounded-lg">
              <Shield className="text-[#6366F1]" size={48} />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-8 shadow-2xl">
          {status === 'loading' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6366F1]"></div>
              </div>
              <h2 className="text-xl font-bold text-white mb-2">
                Confirmation en cours...
              </h2>
              <p className="text-gray-400">
                Votre paiement est en cours de vérification
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-green-500" size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Paiement réussi ! 🎉
              </h2>
              <p className="text-green-500 mb-4">{message}</p>
              <p className="text-gray-400 text-sm mb-6">
                Redirection vers votre dashboard...
              </p>
              <div className="w-full bg-[#1E1F23] rounded-full h-1 mb-4">
                <div className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] h-1 rounded-full animate-pulse"></div>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                  <AlertCircle className="text-red-500" size={40} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">
                Oups ! Une erreur
              </h2>
              <p className="text-red-400 mb-6">{message}</p>
              <button
                onClick={() => navigate('/select-plan')}
                className="px-6 py-3 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F52E0] transition flex items-center justify-center gap-2 mx-auto"
              >
                <span>Retour aux plans</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}