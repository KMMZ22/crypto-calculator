// src/services/stripeConfig.js

// Initialiser Stripe avec votre clé publique

// Configuration des plans avec leurs Price IDs
export const STRIPE_PLANS = {
  PRO: {
    name: 'TradeGuard Pro',
    priceId: import.meta.env.VITE_STRIPE_PRICE_PRO,
    price: 19,
    currency: 'EUR',
    interval: 'month',
    features: [
      '10 positions simultanées',
      'Prix API temps réel',
      'Exports PDF/CSV',
      'DCA & Break-even'
    ]
  },
  ELITE: {
    name: 'TradeGuard Elite',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ELITE,
    price: 49,
    currency: 'EUR',
    interval: 'month',
    features: [
      'Positions illimitées',
      'IA Advisor complet',
      'Backtesting avancé',
      '1000 crédits IA/mois',
      'Support prioritaire'
    ]
  }
};

// Helper pour obtenir les infos d'un plan
export const getPlanInfo = (planId) => {
  return STRIPE_PLANS[planId.toUpperCase()] || null;
};