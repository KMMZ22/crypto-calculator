// services/paymentService.js
import stripe from '../config/stripe.js';
import { createClerkClient } from '@clerk/backend';

const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

class PaymentService {
    async createCheckoutSession(userId, priceId, plan, billingInterval) {
        try {
            const user = await clerkClient.users.getUser(userId);
            
            const session = await stripe.checkout.sessions.create({
                customer_email: user.primaryEmailAddress?.emailAddress,
                client_reference_id: userId,
                metadata: {
                    userId,
                    plan: plan,
                    billing_interval: billingInterval
                },
                line_items: [
                    {
                        price: priceId,
                        quantity: 1,
                    },
                ],
                mode: 'subscription',
                success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: `${process.env.FRONTEND_URL}/pricing`,
                billing_address_collection: 'required',
            });

            return {
                success: true,
                sessionId: session.id,
                url: session.url
            };
        } catch (error) {
            console.error('Stripe checkout error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    // ... reste du code inchangé ...
}

export default new PaymentService();