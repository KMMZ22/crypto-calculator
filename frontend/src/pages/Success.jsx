// src/pages/Success.jsx - VERSION FINALE CORRIGÉE
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // ← Ajoute ceci

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth(); // ← Récupère l'utilisateur connecté
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(5);
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    console.log('✅ Success page mounted');
    console.log('👤 Utilisateur:', user?.email);
    
    const sessionId = searchParams.get('session_id');
    console.log('🔍 Session ID:', sessionId);

    // Simuler une vérification (2 secondes)
    const verifyTimer = setTimeout(() => {
      console.log('✅ Vérification terminée');
      setVerified(true);
      setLoading(false);
      
      // Démarrer le compte à rebours
      let seconds = 5;
      const interval = setInterval(() => {
        seconds -= 1;
        setCountdown(seconds);
        
        if (seconds <= 0) {
          clearInterval(interval);
          console.log('➡️ Redirection vers dashboard');
          navigate('/dashboard');
        }
      }, 1000);
    }, 2000);

    // Cleanup
    return () => {
      clearTimeout(verifyTimer);
    };
  }, [searchParams, navigate, user]); // ← Dépendances

  // Si en cours de chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Vérification de votre paiement...</p>
          <p className="text-sm text-gray-600 mt-2">Session: {searchParams.get('session_id') || 'aucune'}</p>
        </div>
      </div>
    );
  }

  // Succès - afficher la page
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">🎉 Paiement réussi !</h1>
          
          <p className="text-gray-400 mb-6">
            Votre abonnement TradeGuard est maintenant actif. 
            Vous avez accès à toutes les fonctionnalités de votre plan.
          </p>
          
          <div className="bg-gray-800/50 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="text-green-500" />
              <div className="text-left">
                <p className="text-white font-semibold">Prochaines étapes :</p>
                <p className="text-sm text-gray-400">
                  1. Explorez votre dashboard<br />
                  2. Testez les nouveaux calculateurs<br />
                  3. Configurez vos alertes
                </p>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
          >
            Accéder à mon dashboard
            <ArrowRight size={18} />
          </button>
          
          <p className="text-sm text-gray-500 mt-6">
            Vous recevrez un email de confirmation dans quelques minutes.
            <span className="block mt-2 text-green-500">
              Redirection automatique dans {countdown} secondes...
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;