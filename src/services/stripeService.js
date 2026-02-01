import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const stripeService = {
  // Rediriger vers la page de paiement
  async redirectToCheckout(priceId, userEmail) {
    const stripe = await stripePromise;
    
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      successUrl: `${window.location.origin}/dashboard?success=true`,
      cancelUrl: `${window.location.origin}/dashboard?canceled=true`,
      customerEmail: userEmail,
    });
    
    if (error) {
      console.error('Stripe error:', error);
    }
  },

  // Vérifier le statut d'abonnement
  async checkSubscriptionStatus(userId) {
    // À implémenter avec ton backend
    // ou avec Stripe webhooks + Supabase
  }
};