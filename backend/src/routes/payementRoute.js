// routes/paymentRoutes.js
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/express';
import paymentService from '../services/paymentService.js';
import { PLANS } from '../config/plans.js';
import stripe from '../config/stripe.js';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

const router = express.Router();

// ... reste du code inchangé jusqu'à la route /upgrade ...

// POST /api/payment/upgrade
router.post('/upgrade', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const { plan, billing_interval = 'month' } = req.body;
        const userId = req.auth.userId;

        if (!['PRO', 'ELITE'].includes(plan)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid plan'
            });
        }

        // Récupérer l'utilisateur depuis Clerk
        const user = await clerkClient.users.getUser(userId);
        const currentPlan = user.privateMetadata?.subscription_plan || 'FREE';

        // Empêcher le downgrade
        const planHierarchy = { 'FREE': 0, 'PRO': 1, 'ELITE': 2 };
        if (planHierarchy[plan] <= planHierarchy[currentPlan]) {
            return res.status(400).json({
                success: false,
                error: `Already on ${currentPlan} plan or higher`
            });
        }

        // Récupérer le prix Stripe
        const priceKey = `stripe_price_id_${billing_interval}`;
        const priceId = PLANS[plan][priceKey];
        
        if (!priceId) {
            return res.status(400).json({
                success: false,
                error: 'Price not available'
            });
        }

        const result = await paymentService.createCheckoutSession(
            userId, 
            priceId, 
            plan, 
            billing_interval
        );
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        console.error('Upgrade error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ... reste du code ...

// POST /api/payment/webhook
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];
    
    let event;
    
    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Traiter l'événement
    try {
        await paymentService.handleWebhookEvent(event);
        res.json({ received: true });
    } catch (error) {
        console.error('Webhook processing error:', error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/payment/portal
router.get('/portal', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;
        const result = await paymentService.createCustomerPortal(userId);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(400).json(result);
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;