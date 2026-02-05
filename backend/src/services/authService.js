import { supabase } from '../../supabase.js';

class AuthService {
    async register(email, password, username = null) {
        try {
            // 1. Créer l'utilisateur dans Supabase Auth
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username || email.split('@')[0],
                        subscription_plan: 'FREE'
                    }
                }
            });

            if (authError) throw authError;

            // 2. Créer le profil utilisateur
            const { error: profileError } = await supabase
                .from('user_profiles')
                .insert({
                    id: authData.user.id,
                    email: authData.user.email,
                    username: username || email.split('@')[0],
                    subscription_plan: 'FREE',
                    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
                    credits: 10
                });

            if (profileError) throw profileError;

            // 3. Créer les crédits IA
            await supabase
                .from('ai_credits')
                .insert({
                    user_id: authData.user.id,
                    credits_remaining: 10
                });

            return {
                success: true,
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    subscription_plan: 'FREE',
                    trial_ends_at: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
                },
                session: authData.session
            };

        } catch (error) {
            console.error('Registration error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async login(email, password) {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            // Récupérer le profil complet
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*')
                .eq('id', data.user.id)
                .single();

            return {
                success: true,
                user: {
                    ...data.user,
                    ...profile
                },
                session: data.session
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async logout() {
        const { error } = await supabase.auth.signOut();
        return { success: !error, error };
    }

    async getCurrentUser(session) {
        try {
            const { data: { user }, error } = await supabase.auth.getUser(session.access_token);
            
            if (error || !user) {
                return { success: false, error: 'Not authenticated' };
            }

            // Récupérer le profil
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('*, subscriptions(status, plan, current_period_end)')
                .eq('id', user.id)
                .single();

            // Récupérer les crédits IA
            const { data: credits } = await supabase
                .from('ai_credits')
                .select('credits_remaining')
                .eq('user_id', user.id)
                .single();

            return {
                success: true,
                user: {
                    ...user,
                    ...profile,
                    ai_credits: credits?.credits_remaining || 0
                }
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async upgradeToElite(userId, paymentMethod = 'demo') {
        try {
            // En production: intégrer avec Stripe
            // Pour la démo: simuler l'upgrade
            
            const subscriptionExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

            // Mettre à jour le profil
            const { error: profileError } = await supabase
                .from('user_profiles')
                .update({
                    subscription_plan: 'ELITE',
                    subscription_status: 'active',
                    subscription_expires_at: subscriptionExpires.toISOString(),
                    credits: 1000,
                    updated_at: new Date().toISOString()
                })
                .eq('id', userId);

            if (profileError) throw profileError;

            // Créer l'abonnement
            const { error: subError } = await supabase
                .from('subscriptions')
                .insert({
                    user_id: userId,
                    plan: 'ELITE',
                    status: 'active',
                    current_period_start: new Date().toISOString(),
                    current_period_end: subscriptionExpires.toISOString()
                });

            if (subError) throw subError;

            // Mettre à jour les crédits IA
            await supabase
                .from('ai_credits')
                .update({
                    credits_remaining: 1000,
                    updated_at: new Date().toISOString()
                })
                .eq('user_id', userId);

            return {
                success: true,
                message: 'Upgraded to ELITE plan successfully',
                expires_at: subscriptionExpires.toISOString()
            };

        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    async checkFeatureAccess(userId, feature) {
        try {
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('subscription_plan')
                .eq('id', userId)
                .single();

            if (!profile) return false;

            // Récupérer les features du plan
            const { data: plan } = await supabase
                .from('plan_features')
                .select('features')
                .eq('plan', profile.subscription_plan)
                .single();

            return plan?.features[feature] || false;

        } catch (error) {
            console.error('Feature check error:', error);
            return false;
        }
    }
}

export default new AuthService();