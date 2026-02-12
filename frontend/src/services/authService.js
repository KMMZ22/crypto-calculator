// services/authService.js
import { supabase } from '../lib/supabase';

class AuthService {
    // Inscription via Clerk (le frontend gère l'UI)
    async register(userData) {
        try {
            // Clerk gère l'inscription côté frontend
            // On peut juste créer des métadonnées utilisateur
            return {
                success: true,
                message: 'User registration handled by Clerk frontend'
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Connexion via Clerk (frontend aussi)
    async login() {
        return {
            success: true,
            message: 'Login handled by Clerk frontend components'
        };
    }

    // Déconnexion
    async logout() {
        return {
            success: true,
            message: 'Logout handled by Clerk frontend'
        };
    }

    // Récupérer l'utilisateur courant
    async getCurrentUser(userId) {
        try {
            const user = await clerkClient.users.getUser(userId);
            
            // Récupérer les métadonnées personnalisées
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
                    credits: privateMetadata.credits || 10,
                    trial_ends_at: privateMetadata.trial_ends_at,
                    createdAt: user.createdAt
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Mettre à jour vers ELITE
    async upgradeToElite(userId) {
        try {
            // Mettre à jour les métadonnées privées de l'utilisateur
            await clerkClient.users.updateUser(userId, {
                privateMetadata: {
                    subscription_plan: 'ELITE',
                    subscription_status: 'active',
                    subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
                    credits: 1000,
                    updated_at: new Date().toISOString()
                }
            });

            // En production: intégrer avec Stripe ici
            // Pour la démo: simuler l'upgrade

            return {
                success: true,
                message: 'Upgraded to ELITE plan successfully',
                expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    // Vérifier l'accès aux fonctionnalités
    async checkFeatureAccess(userId, feature) {
        try {
            const user = await clerkClient.users.getUser(userId);
            const privateMetadata = user.privateMetadata || {};
            const plan = privateMetadata.subscription_plan || 'FREE';

            // Définir les features par plan
            const planFeatures = {
                'FREE': {
                    basic_calculator: true,
                    price_data: true,
                    calculations_per_day: 3
                },
                'ELITE': {
                    all_calculators: true,
                    advanced_metrics: true,
                    unlimited_calculations: true,
                    ai_predictions: true,
                    custom_strategies: true,
                    api_access: true
                }
            };

            return planFeatures[plan]?.[feature] || false;
        } catch (error) {
            console.error('Feature check error:', error);
            return false;
        }
    }

    // Mettre à jour les crédits
    async updateCredits(userId, creditsChange) {
        try {
            const user = await clerkClient.users.getUser(userId);
            const currentCredits = user.privateMetadata?.credits || 0;
            const newCredits = Math.max(0, currentCredits + creditsChange);

            await clerkClient.users.updateUser(userId, {
                privateMetadata: {
                    ...user.privateMetadata,
                    credits: newCredits
                }
            });

            return { success: true, newCredits };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

export default new AuthService();