import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonction pour vérifier et mettre à jour le plan utilisateur
export const subscriptionService = {
  async checkUserPlan(userId) {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('plan, status, current_period_end')
        .eq('user_id', userId)
        .maybeSingle(); // Utilise maybeSingle au lieu de single
      
      if (error || !data) {
        return { plan: 'free', status: 'inactive' };
      }
      
      return data;
    } catch (error) {
      console.error('Erreur vérification plan:', error);
      return { plan: 'free', status: 'error' };
    }
  },
  
  async updateUserPlan(userId, plan, stripeData = {}) {
    try {
      // 1. Mettre à jour la table user_subscriptions
      const { error: subError } = await supabase
        .from('user_subscriptions')
        .upsert({
          user_id: userId,
          plan: plan,
          status: 'active',
          stripe_customer_id: stripeData.customerId,
          stripe_subscription_id: stripeData.subscriptionId,
          current_period_end: stripeData.currentPeriodEnd,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });
      
      if (subError) throw subError;
      
      // 2. Mettre à jour les user_metadata (accessible depuis le frontend)
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          plan: plan,
          plan_status: 'active',
          stripe_customer_id: stripeData.customerId,
          upgraded_at: new Date().toISOString()
        }
      });
      
      if (userError) throw userError;
      
      return { success: true };
    } catch (error) {
      console.error('Erreur mise à jour plan:', error);
      return { success: false, error };
    }
  }
};