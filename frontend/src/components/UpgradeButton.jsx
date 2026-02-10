import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Crown, Zap, Check, Loader2 } from 'lucide-react';

// Initialiser Stripe

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
      // 1. Récupérer l'utilisateur actuel
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        navigate('/auth');
        return;
      }

      
      // 3. ID du prix selon le plan
      const priceId = plan === 'pro' 
        ? import.meta.env.VITE_STRIPE_PRICE_PRO_MONTHLY
        : import.meta.env.VITE_STRIPE_PRICE_ELITE_MONTHLY;
      
      if (!priceId) {
        throw new Error('Configuration Stripe manquante');
      }
      
      // 4. Charger Stripe
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe non chargé');
      
      // 5. Rediriger vers Stripe Checkout
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}&success=true`,
        cancelUrl: `${window.location.origin}/pricing?canceled=true`,
        customerEmail: user.email,
        clientReferenceId: user.id,
        metadata: {
          userId: user.id,
          plan: plan,
          userEmail: user.email
        }
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