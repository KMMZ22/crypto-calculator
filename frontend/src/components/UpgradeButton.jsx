import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Crown, Zap, Check, Loader2 } from 'lucide-react';

// Initialiser Stripe
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || import.meta.env.VITE_STRIPE_PUBLIC_KEY);
const UpgradeButton = ({
  plan = 'pro',
  variant = 'default',
  size = 'md',
  showIcon = true,
  className = '',
  children
}) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpgrade = async () => {
    setLoading(true);

    try {
      // 1. Récupérer l'utilisateur actuel (avec retry pour couvrir le délai d'inscription)
      let user = null;
      let userError = null;

      for (let attempt = 0; attempt < 3; attempt++) {
        const { data, error } = await supabase.auth.getUser();
        user = data?.user;
        userError = error;

        if (user && !userError) break; // Utilisateur trouvé !

        // Attendre 500ms avant de réessayer
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      if (userError || !user) {
        alert("Vous devez être entièrement connecté pour procéder au paiement. Assurez-vous d'avoir confirmé votre email.");
        navigate('/login');
        return;
      }


      // 3. Appeler le backend pour créer la session Checkout
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3002';
      const response = await fetch(`${apiUrl}/api/payment/create-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan: plan.toUpperCase() })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors de la création de la session');
      }

      const sessionId = responseData.sessionId;

      // 4. Charger Stripe et rediriger
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe non chargé');

      // 5. Rediriger vers Stripe Checkout en utilisant uniquement le sessionId
      const { error } = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (error) throw error;

    } catch (error) {
      console.error('Erreur Upgrade:', error);
      alert(`Erreur: ${error.message}. Vérifie ta configuration Stripe.`);
    } finally {
      setLoading(false);
    }
  };

  // Styles variants
  const variants = {
    default: plan === 'pro'
      ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
      : 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white',
    outline: plan === 'pro'
      ? 'border-2 border-green-500 text-green-500 hover:bg-green-500/10'
      : 'border-2 border-purple-500 text-purple-500 hover:bg-purple-500/10',
    ghost: 'bg-gray-800 hover:bg-gray-700 text-gray-300'
  };

  // Tailles
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Texte par défaut
  const defaultText = {
    pro: 'Passer à PRO',
    elite: 'Choisir ELITE'
  };

  return (
    <button
      onClick={handleUpgrade}
      disabled={loading}
      className={`
        rounded-lg font-bold transition-all duration-300
        flex items-center justify-center gap-2
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${variant === 'default' ? 'shadow-lg hover:shadow-xl' : ''}
        ${className}
      `}
    >
      {loading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Traitement...</span>
        </>
      ) : (
        <>
          {showIcon && (plan === 'elite' ? <Crown size={20} /> : <Zap size={20} />)}
          <span>{children || defaultText[plan]}</span>
        </>
      )}
    </button>
  );
};

export default UpgradeButton;