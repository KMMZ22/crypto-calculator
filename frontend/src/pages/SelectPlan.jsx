// Dans ton SelectPlan.jsx existant - AJOUTER CES CHANGEMENTS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Shield, Check, ArrowRight, Zap, TrendingUp, Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext'; // AJOUTER CET IMPORT

// Initialiser Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function SelectPlan() {
  const navigate = useNavigate();
  const { user } = useAuth(); // AJOUTER POUR AVOIR L'UTILISATEUR
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loading, setLoading] = useState(false);

  // METTRE À JOUR TON ARRAY DE PLANS AVEC LES priceId Stripe
  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '$0',
      period: '/mois',
      description: 'Pour découvrir TradeGuard',
      features: [
        '1 position simultanée',
        'Calculs basiques',
        'R:R calculator',
        'Interface simple'
      ],
      notIncluded: [
        'Prix live',
        'Historique',
        'Export PDF/CSV'
      ],
      stripePriceId: null // Gratuit = pas de priceId
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: '/mois',
      popular: true,
      description: 'Pour les traders sérieux',
      features: [
        '10 positions simultanées',
        'Prix live API',
        'Historique illimité',
        'Export PDF/CSV',
        'Tous calculateurs avancés',
        'Alertes email',
        'Support prioritaire'
      ],
      notIncluded: [],
      stripePriceId: 'price_pro_monthly' // REMPLACER PAR TON VRAI ID
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '$49',
      period: '/mois',
      description: 'Pour les professionnels',
      features: [
        'Tout Pro +',
        'Positions illimitées',
        'AI Trade Advisor (50/mois)',
        'Backtesting avancé',
        'API access',
        'White-label',
        'Support VIP 24/7'
      ],
      notIncluded: [],
      stripePriceId: 'price_elite_monthly' // REMPLACER PAR TON VRAI ID
    }
  ];

  const handleSelectPlan = async (planId, stripePriceId) => {
    setLoading(true);
    
    // SI PLAN GRATUIT
    if (planId === 'free') {
      console.log('Plan gratuit sélectionné');
      // Rediriger directement
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // SI PLAN PAYANT - REDIRIGER VERS STRIPE
    try {
      const selectedPlan = plans.find(p => p.id === planId);
      
      // 1. Créer une session Checkout via ton backend
      const response = await fetch('http://localhost:3000/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: stripePriceId,
          customerEmail: user?.email || 'user@email.com',
          clerkUserId: user?.id,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/select-plan`
        })
      });

      if (!response.ok) {
        throw new Error('Erreur création session Stripe');
      }

      const { sessionId } = await response.json();
      
      // 2. Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        alert(`Erreur Stripe: ${error.message}`);
        setLoading(false);
      }
      
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors du processus de paiement');
      setLoading(false);
    }
  };

  // MODIFIER LE BOUTON D'APPEL À L'ACTION
  // Remplace cette partie dans ton JSX :
  {/* 
    ANCIEN :
    <button onClick={() => handleSelectPlan(selectedPlan)}>
    
    NOUVEAU :
    <button onClick={() => handleSelectPlan(selectedPlan, plans.find(p => p.id === selectedPlan)?.stripePriceId)}>
  */}
}