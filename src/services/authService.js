// /src/services/authService.js
import { supabase } from '../lib/supabase'

export const authService = {
  // Inscription
  signUp: async (email, password, userData = {}) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData // username, full_name, etc.
      }
    })
    
    // Si inscription réussie, créer le profil
    if (data?.user && !error) {
      await createUserProfile(data.user.id, email, userData)
    }
    
    return { data, error }
  },
  
  // Connexion
  signIn: async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password })
  },
  
  // Connexion avec Google
  signInWithGoogle: async () => {
    return await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`
      }
    })
  },
  
  // Déconnexion
  signOut: async () => {
    return await supabase.auth.signOut()
  },
  
  // Récupérer la session
  getSession: async () => {
    return await supabase.auth.getSession()
  },
  
  // Récupérer l'utilisateur courant
  getUser: async () => {
    return await supabase.auth.getUser()
  },
  
  // Écouter les changements d'authentification
  onAuthStateChange: (callback) => {
    return supabase.auth.onAuthStateChange(callback)
  },
  
  // Réinitialiser le mot de passe
  resetPassword: async (email) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })
  },
  
  // Mettre à jour le mot de passe
  updatePassword: async (newPassword) => {
    return await supabase.auth.updateUser({ password: newPassword })
  },
  
  // Mettre à jour le profil
  updateProfile: async (userId, updates) => {
    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
  },
  
  // Récupérer le profil
  getProfile: async (userId) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    return { data, error }
  },

  // Mettre à jour le plan utilisateur (après paiement Stripe)
  updateUserPlan: async (userId, plan, { customerId, subscriptionId, currentPeriodEnd } = {}) => {
    const planLower = (plan || 'free').toLowerCase()
    const updates = {
      subscription_plan: planLower,
      subscription_tier: planLower
    }
    if (customerId) updates.stripe_customer_id = customerId
    if (subscriptionId) updates.stripe_subscription_id = subscriptionId
    if (currentPeriodEnd) updates.subscription_period_end = currentPeriodEnd?.toISOString?.() || currentPeriodEnd

    return await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
  }
}

// Fonction pour créer un profil utilisateur
async function createUserProfile(userId, email, userData = {}) {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([{
        id: userId,
        email: email,
        username: userData.username || email.split('@')[0],
        full_name: userData.full_name || '',
        subscription_plan: 'free',
        credits: 10
      }])
    
    if (error) throw error
    
    // Créer aussi les crédits IA
    await supabase
      .from('ai_credits')
      .insert([{
        user_id: userId,
        remaining_credits: 50
      }])
    
    return { data, error }
  } catch (error) {
    console.error('Error creating user profile:', error)
    return { data: null, error }
  }
}