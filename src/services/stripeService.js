// src/services/stripeService.js
import { supabase } from '../lib/supabase';

export const stripeService = {
  /**
   * 🔒 Créer une session de paiement sécurisée (via Edge Function)
   * @param {string} plan - 'PRO' ou 'ELITE'
   * @param {string} userId - ID Supabase de l'utilisateur
   * @param {string} userEmail - Email de l'utilisateur
   */
  async createCheckoutSession(plan, userId, userEmail) {
    try {
      console.log(`🔄 Creating checkout session for plan: ${plan}`);

      // Vérifier que le plan existe
      const planInfo = STRIPE_PLANS[plan.toUpperCase()];
      if (!planInfo) {
        throw new Error(`Plan invalide: ${plan}`);
      }

      // Appeler l'Edge Function Supabase
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: {
          plan: plan.toUpperCase(),
          userId,
          userEmail,
          successUrl: `${window.location.origin}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/select-plan?canceled=true`
        }
      });

      if (error) {
        console.error('❌ Edge function error:', error);
        throw error;
      }

      if (!data || !data.sessionId) {
        throw new Error('Session ID non retourné par le serveur');
      }

      console.log('✅ Checkout session created:', data.sessionId);

      // Rediriger vers Stripe Checkout
      const stripe = await stripePromise;
      const { error: redirectError } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (redirectError) {
        console.error('❌ Redirect error:', redirectError);
        throw redirectError;
      }

      return { success: true };

    } catch (error) {
      console.error('❌ Stripe checkout error:', error);
      return { 
        success: false, 
        error: error.message || 'Une erreur est survenue lors du paiement'
      };
    }
  },

  /**
   * ✅ Vérifier le statut d'une session de paiement
   * @param {string} sessionId - ID de la session Stripe
   */
  async verifyCheckoutSession(sessionId) {
    try {
      console.log('🔍 Verifying session:', sessionId);

      const { data, error } = await supabase.functions.invoke('verify-checkout-session', {
        body: { sessionId }
      });

      if (error) throw error;

      console.log('✅ Session verified:', data);

      return { 
        success: true, 
        data: {
          plan: data.plan,
          customerId: data.customerId,
          subscriptionId: data.subscriptionId,
          currentPeriodEnd: data.currentPeriodEnd
        }
      };

    } catch (error) {
      console.error('❌ Session verification error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 🔧 Créer une session du portail client Stripe
   * @param {string} customerId - ID du client Stripe
   */
  async createPortalSession(customerId) {
    try {
      console.log('🔄 Creating portal session for customer:', customerId);

      if (!customerId) {
        throw new Error('Customer ID manquant');
      }

      const { data, error } = await supabase.functions.invoke('create-portal-session', {
        body: {
          customerId,
          returnUrl: `${window.location.origin}/dashboard`
        }
      });

      if (error) throw error;

      if (!data || !data.url) {
        throw new Error('URL du portail non retournée');
      }

      console.log('✅ Portal session created');

      // Rediriger vers le portail Stripe
      window.location.href = data.url;

      return { success: true };

    } catch (error) {
      console.error('❌ Portal session error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 📊 Vérifier le statut d'abonnement actuel
   * @param {string} userId - ID Supabase de l'utilisateur
   */
  async checkSubscriptionStatus(userId) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (!data) {
        return { 
          success: true, 
          subscription: null,
          status: 'FREE' 
        };
      }

      // Vérifier si l'abonnement est expiré
      const isExpired = data.current_period_end 
        ? new Date(data.current_period_end) < new Date()
        : false;

      return {
        success: true,
        subscription: {
          plan: data.plan,
          status: isExpired ? 'expired' : data.status,
          customerId: data.stripe_customer_id,
          subscriptionId: data.stripe_subscription_id,
          currentPeriodEnd: data.current_period_end,
          isActive: data.status === 'active' && !isExpired
        }
      };

    } catch (error) {
      console.error('❌ Subscription check error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * 🔄 Annuler un abonnement
   * @param {string} subscriptionId - ID de l'abonnement Stripe
   */
  async cancelSubscription(subscriptionId) {
    try {
      const { data, error } = await supabase.functions.invoke('cancel-subscription', {
        body: { subscriptionId }
      });

      if (error) throw error;

      return { success: true, data };

    } catch (error) {
      console.error('❌ Cancellation error:', error);
      return { success: false, error: error.message };
    }
  }
};

// Export des plans pour utilisation ailleurs
export { STRIPE_PLANS };