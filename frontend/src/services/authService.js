// src/services/authService.js - VERSION PRODUCTION CORRIGÉE
import { supabase } from '../lib/supabase';

const authService = {
    // =====================================================
    // INSCRIPTION
    // =====================================================
    signup: async (email, password, username) => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        username: username || email.split('@')[0],
                        subscription_plan: 'FREE'
                        // ❌ RETIRÉ credits: 10 (car géré par ai_credits)
                    }
                }
            });

            if (error) throw error;
            
            // ✅ Créer automatiquement l'entrée dans ai_credits
            if (data.user) {
                await supabase
                    .from('ai_credits')
                    .insert({
                        user_id: data.user.id,
                        credits_remaining: 10,
                        monthly_limit: 10
                    });
            }
            
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Erreur signup:', error);
            return { success: false, error: error.message };
        }
    },

    // =====================================================
    // CONNEXION
    // =====================================================
    login: async (email, password) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;
            return { success: true, user: data.user };
        } catch (error) {
            console.error('❌ Erreur login:', error);
            return { success: false, error: error.message };
        }
    },

    // =====================================================
    // DÉCONNEXION
    // =====================================================
    logout: async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('❌ Erreur logout:', error);
            return { success: false, error: error.message };
        }
    },

    // =====================================================
    // RÉCUPÉRER LE PROFIL
    // =====================================================
    getCurrentUser: async () => {
        try {
            // ✅ Vérifier d'abord la session
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError || !session) {
                return { success: false, error: 'Non connecté' };
            }

            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();  // ✅ maybeSingle au lieu de single

            if (profileError) throw profileError;

            // ✅ maybeSingle pour les crédits aussi
            const { data: credits, error: creditsError } = await supabase
                .from('ai_credits')
                .select('credits_remaining')
                .eq('user_id', session.user.id)
                .maybeSingle();

            if (creditsError && creditsError.code !== 'PGRST116') throw creditsError;

            return {
                success: true,
                user: {
                    id: session.user.id,
                    email: session.user.email,
                    username: profile?.username || session.user.email?.split('@')[0],
                    subscription_plan: profile?.subscription_plan || 'FREE',
                    capital: profile?.capital || 10000,
                    credits: credits?.credits_remaining || 0
                }
            };
        } catch (error) {
            console.error('❌ Erreur getCurrentUser:', error);
            return { success: false, error: error.message };
        }
    },

    // =====================================================
    // UPGRADE PLANS (VERSION ROBUSTE)
    // =====================================================
    upgradeToElite: async (userId) => {
        try {
            if (!userId) {
                return { success: false, error: 'ID utilisateur manquant' };
            }

            // ✅ Vérifier que la session est toujours valide
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                return { success: false, error: 'Session expirée' };
            }

            // Mettre à jour le profil
            const { error: profileError } = await supabase
                .from('profiles')
                .update({ subscription_plan: 'elite' })
                .eq('id', userId);

            if (profileError) throw profileError;

            // Gérer les crédits (upsert)
            const { error: creditsError } = await supabase
                .from('ai_credits')
                .upsert({ 
                    user_id: userId,
                    credits_remaining: 50,
                    monthly_limit: 50
                }, { onConflict: 'user_id' });  // ✅ Gère les conflits

            if (creditsError) throw creditsError;

            return { success: true, plan: 'elite', credits: 50 };
        } catch (error) {
            console.error('❌ Erreur upgradeToElite:', error);
            return { success: false, error: error.message };
        }
    },

    upgradeToPro: async (userId) => {
        try {
            if (!userId) {
                return { success: false, error: 'ID utilisateur manquant' };
            }

            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                return { success: false, error: 'Session expirée' };
            }

            const { error } = await supabase
                .from('profiles')
                .update({ subscription_plan: 'pro' })
                .eq('id', userId);

            if (error) throw error;
            
            // ✅ Créer les crédits si nécessaire (pour les anciens users)
            await supabase
                .from('ai_credits')
                .upsert({ 
                    user_id: userId,
                    credits_remaining: 20,
                    monthly_limit: 20
                }, { onConflict: 'user_id' });

            return { success: true, plan: 'pro' };
        } catch (error) {
            console.error('❌ Erreur upgradeToPro:', error);
            return { success: false, error: error.message };
        }
    },

    // =====================================================
    // GESTION DES CRÉDITS (AMÉLIORÉE)
    // =====================================================
    updateCredits: async (userId, creditsChange) => {
        try {
            if (!userId) {
                return { success: false, error: 'ID utilisateur manquant' };
            }

            // Récupérer les crédits actuels
            const { data: current, error: fetchError } = await supabase
                .from('ai_credits')
                .select('credits_remaining')
                .eq('user_id', userId)
                .maybeSingle();

            if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

            const newCredits = Math.max(0, (current?.credits_remaining || 0) + creditsChange);

            // Mettre à jour
            const { error: updateError } = await supabase
                .from('ai_credits')
                .upsert({ 
                    user_id: userId,
                    credits_remaining: newCredits
                }, { onConflict: 'user_id' });

            if (updateError) throw updateError;
            
            return { success: true, newCredits };
        } catch (error) {
            console.error('❌ Erreur updateCredits:', error);
            return { success: false, error: error.message };
        }
    },

    getCredits: async (userId) => {
        try {
            const { data, error } = await supabase
                .from('ai_credits')
                .select('credits_remaining')
                .eq('user_id', userId)
                .maybeSingle();  // ✅ maybeSingle

            if (error && error.code !== 'PGRST116') throw error;
            
            return { success: true, credits: data?.credits_remaining || 0 };
        } catch (error) {
            console.error('❌ Erreur getCredits:', error);
            return { success: false, error: error.message, credits: 0 };
        }
    }
};

export default authService;