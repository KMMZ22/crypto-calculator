import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const useTradeGuard = () => {
  const { user, profile } = useAuth();
  
  const createCalculatorService = (userId) => ({
    async calculatePosition(params) {
      const calculationData = {
        user_id: userId,
        calculation_type: 'position',
        ...params
      };
      
      const { data, error } = await supabase
        .from('trading_calculations')
        .insert(calculationData)
        .select();
      
      if (error) throw error;
      return data[0];
    },
  });
  
  const canUseFeature = (feature) => {
    if (!profile) return false;
    
    const featureAccess = {
      'ia_advisor': profile.subscription_tier === 'elite',
      'backtesting': profile.subscription_tier === 'elite',
      'export_csv': profile.subscription_tier === 'pro' || profile.subscription_tier === 'elite',
      'real_time_prices': profile.subscription_tier === 'pro' || profile.subscription_tier === 'elite',
      'multiple_positions': profile.subscription_tier !== 'free'
    };
    
    return featureAccess[feature] || false;
  };
  
  const calculator = user ? createCalculatorService(user.id) : null;
  
  return {
    user,
    profile,
    calculator,
    canUseFeature,
    isAuthenticated: !!user
  };
};