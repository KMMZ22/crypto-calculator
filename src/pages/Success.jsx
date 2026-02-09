// src/pages/Success.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, Shield, ArrowRight } from 'lucide-react';

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      // Vérifier le statut du paiement
      verifyPayment(sessionId);
    } else {
      // Si pas de session_id, rediriger après 3s
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }
  }, []);

  const verifyPayment = async (sessionId) => {
    try {
      // Appeler ton backend pour vérifier
      const response = await fetch(`http://localhost:3000/api/check-session/${sessionId}`);
      const data = await response.json();
      
      if (data.status === 'paid') {
        console.log('✅ Paiement confirmé pour:', data.customerEmail);
        // Tu peux aussi appeler un webhook pour mettre à jour Clerk ici
      }
    } catch (error) {
      console.error('Erreur vérification:', error);
    } finally {
      setLoading(false);
      // Rediriger vers dashboard après 5 secondes
      setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Vérification de votre paiement...</p>
        </div>
      </div>
    );
  }

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
          </p>
        </div>
      </div>
    </div>
  );
};

export default Success;