// services/authService.js
import { createClerkClient } from '@clerk/backend';
import { PLANS } from '../config/plans.js';

const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

class AuthService {
    async getCurrentUser(userId) {
        try {
            const user = await clerkClient.users.getUser(userId);
            const privateMetadata = user.privateMetadata || {};
            
            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.primaryEmailAddress?.emailAddress,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    imageUrl: user.imageUrl,
                    subscription_plan: privateMetadata.subscription_plan || 'FREE',
                    subscription_status: privateMetadata.subscription_status || 'inactive',
                    billing_interval: privateMetadata.billing_interval,
                    credits: privateMetadata.credits || 10,
                    createdAt: user.createdAt
                }
            };
        } catch (error) {
            console.error('Auth service error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async checkFeatureAccess(userId, feature) {
        try {
            const user = await clerkClient.users.getUser(userId);
            const plan = user.privateMetadata?.subscription_plan || 'FREE';
            return PLANS[plan]?.features[feature] || false;
        } catch (error) {
            console.error('Feature check error:', error);
            return false;
        }
    }
}

export default new AuthService();