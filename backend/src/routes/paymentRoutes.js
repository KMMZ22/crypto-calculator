const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { stripe, PLAN_TO_PRICE_ID } = require('../config/stripe');
const { supabaseAdmin } = require('../config/supabase');
const {
  handleCheckoutCompleted,
  handleSubscriptionChange,
  handleSubscriptionDeleted
} = require('../services/paymentService');

// Create checkout session for subscription
router.post('/create-checkout', authenticate, async (req, res) => {
  try {
    const { plan, billingInterval = 'monthly' } = req.body;

    // Validation
    if (!plan || !['PRO', 'ELITE'].includes(plan)) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Valid plan (PRO or ELITE) is required'
      });
    }

    if (!['monthly', 'yearly'].includes(billingInterval)) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Billing interval must be monthly or yearly'
      });
    }

    // Get price ID
    const priceId = PLAN_TO_PRICE_ID[plan]?.[billingInterval];

    if (!priceId) {
      return res.status(400).json({
        error: 'PRICE_ERROR',
        message: 'Price not configured for this plan'
      });
    }

    // Get user email
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('email, stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: profile?.email || req.user.email,
      client_reference_id: req.user.id,
      metadata: {
        userId: req.user.id,
        plan: plan,
        billing_interval: billingInterval
      },
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/stripe-success?session_id={CHECKOUT_SESSION_ID}&plan=${plan}`,
      cancel_url: `${process.env.FRONTEND_URL}/select-plan`,
      allow_promotion_codes: true,
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel'
          }
        },
        metadata: {
          userId: req.user.id,
          plan: plan
        }
      }
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
      message: 'Checkout session created successfully'
    });

  } catch (error) {
    console.error('Checkout creation error:', error);
    res.status(500).json({
      error: 'CHECKOUT_ERROR',
      message: 'Error creating checkout session'
    });
  }
});

// Upgrade plan for existing PRO user
router.post('/upgrade-plan', authenticate, async (req, res) => {
  try {
    const { plan, billingInterval = 'monthly' } = req.body;

    if (plan !== 'ELITE') {
      return res.status(400).json({ error: 'ValidationError', message: 'Mise à niveau uniquement vers ELITE supportée pour le moment.' });
    }

    // Get user email & stripe customer id
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('subscription_plan, stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return res.status(400).json({ error: 'CustomerNotFound', message: 'Aucun abonnement Stripe trouvé.' });
    }

    if (profile.subscription_plan !== 'PRO') {
      return res.status(400).json({ error: 'InvalidPlan', message: 'Vous devez être sur le plan PRO pour effectuer cette mise à niveau.' });
    }

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1
    });

    if (subscriptions.data.length === 0) {
      return res.status(404).json({ error: 'SubscriptionNotFound', message: 'Abonnement actif introuvable.' });
    }

    const subscription = subscriptions.data[0];
    const subscriptionItemId = subscription.items.data[0].id;
    const newPriceId = PLAN_TO_PRICE_ID[plan]?.[billingInterval];

    if (!newPriceId) {
      return res.status(400).json({ error: 'PriceError', message: 'Prix introuvable pour ce plan.' });
    }

    // Update the subscription
    const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
      items: [{
        id: subscriptionItemId,
        price: newPriceId,
      }],
      proration_behavior: 'create_prorations',
      metadata: {
        userId: req.user.id,
        plan: plan
      }
    });

    res.json({
      success: true,
      message: 'Abonnement mis à jour avec succès.',
      subscription: updatedSubscription
    });

  } catch (error) {
    console.error('Upgrade plan error:', error);
    res.status(500).json({
      error: 'UpgradeError',
      message: 'Une erreur est survenue lors de la mise à niveau.'
    });
  }
});

// Create portal session for subscription management
router.post('/create-portal-session', authenticate, async (req, res) => {
  try {
    // Get user's Stripe customer ID
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('stripe_customer_id')
      .eq('id', req.user.id)
      .single();

    if (!profile?.stripe_customer_id) {
      return res.status(400).json({
        error: 'CUSTOMER_NOT_FOUND',
        message: 'No subscription found for this user'
      });
    }

    // Create portal session
    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({
      success: true,
      url: session.url,
      message: 'Portal session created successfully'
    });

  } catch (error) {
    console.error('Portal session error:', error);
    res.status(500).json({
      error: 'PORTAL_ERROR',
      message: 'Error creating portal session'
    });
  }
});

// Get user subscription details
router.get('/subscription', authenticate, async (req, res) => {
  try {
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('subscription_plan, stripe_customer_id, credits')
      .eq('id', req.user.id)
      .single();

    let subscriptionDetails = null;

    // If user has Stripe customer ID, get subscription from Stripe
    if (profile?.stripe_customer_id) {
      try {
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'active',
          limit: 1
        });

        if (subscriptions.data.length > 0) {
          const sub = subscriptions.data[0];
          subscriptionDetails = {
            id: sub.id,
            status: sub.status,
            plan: profile.subscription_plan,
            currentPeriodStart: new Date(sub.current_period_start * 1000),
            currentPeriodEnd: new Date(sub.current_period_end * 1000),
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            billingCycle: sub.items.data[0]?.plan?.interval || 'monthly'
          };
        }
      } catch (stripeError) {
        console.warn('Stripe subscription fetch failed:', stripeError.message);
      }
    }

    res.json({
      success: true,
      subscription: {
        plan: profile?.subscription_plan || 'FREE',
        credits: profile?.credits || 10,
        isActive: profile?.subscription_plan !== 'FREE',
        stripeCustomerId: profile?.stripe_customer_id,
        details: subscriptionDetails
      }
    });

  } catch (error) {
    console.error('Subscription fetch error:', error);
    res.status(500).json({
      error: 'SUBSCRIPTION_FETCH_ERROR',
      message: 'Error fetching subscription details'
    });
  }
});

// Get pricing plans
router.get('/plans', (req, res) => {
  const { PLANS_CONFIG } = require('../config/plans');

  res.json({
    success: true,
    plans: PLANS_CONFIG
  });
});

// Stripe webhook endpoint
router.post('/webhook',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    console.log(`✅ Webhook received: ${event.type}`);

    // Handle event
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionChange(event.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object);
        break;

      case 'invoice.paid':
        console.log(`💰 Invoice paid: ${event.data.object.id}`);
        break;

      case 'invoice.payment_failed':
        console.log(`❌ Payment failed: ${event.data.object.id}`);
        break;
    }

    res.json({ received: true });
  }
);

// Test webhook endpoint
router.get('/webhook-test', (req, res) => {
  res.json({
    message: 'Webhook endpoint is ready',
    instructions: 'Configure this URL in Stripe Dashboard:',
    url: `${req.protocol}://${req.get('host')}/api/payment/webhook`,
    note: 'Make sure to use the raw body parser for webhooks'
  });
});

module.exports = router;