const { supabaseAdmin } = require('../config/supabase');
const { PLANS_CONFIG } = require('../config/plans');

// Check credits and daily limits
const checkCredits = async (req, res, next) => {
  try {
    const userId = req.user.id;
    
    // PRO or ELITE → no credit check
    if (req.user.subscription_plan !== 'FREE') {
      req.user.remainingCredits = 'unlimited';
      return next();
    }
    
    // FREE plan: check credits
    if (req.user.credits <= 0) {
      return res.status(403).json({
        error: 'INSUFFICIENT_CREDITS',
        message: 'You have no credits remaining',
        solution: 'Upgrade to PRO or ELITE for unlimited calculations',
        upgradeUrl: '/pricing',
        currentPlan: 'FREE'
      });
    }
    
    // FREE plan: check daily limit
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabaseAdmin
      .from('calculations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);
    
    if (error) throw error;
    
    if ((count || 0) >= 5) { // FREE daily limit: 5 calculations
      return res.status(403).json({
        error: 'DAILY_LIMIT_EXCEEDED',
        message: 'Daily calculation limit reached (5 calculations/day)',
        limit: 5,
        used: count || 0,
        solution: 'Upgrade to PRO for 50 calculations/day or ELITE for unlimited'
      });
    }
    
    // Deduct one credit
    const { error: updateError } = await supabaseAdmin
      .from('user_profiles')
      .update({ credits: req.user.credits - 1 })
      .eq('id', userId);
    
    if (updateError) throw updateError;
    
    req.user.remainingCredits = req.user.credits - 1;
    req.user.dailyRemaining = 5 - (count || 0) - 1;
    
    next();
  } catch (error) {
    console.error('Credit check error:', error);
    res.status(500).json({
      error: 'CREDIT_CHECK_FAILED',
      message: 'Error checking user credits'
    });
  }
};

// Check feature access
const checkFeatureAccess = (featureName) => {
  return async (req, res, next) => {
    try {
      const userPlan = req.user.subscription_plan;
      const planConfig = PLANS_CONFIG[userPlan];
      
      if (!planConfig) {
        return res.status(500).json({
          error: 'INVALID_PLAN',
          message: 'User has an invalid subscription plan'
        });
      }
      
      const hasAccess = planConfig.features[featureName];
      
      if (!hasAccess) {
        // Find minimum required plan
        let requiredPlan = 'PRO';
        if (featureName === 'apiAccess' || featureName === 'prioritySupport') {
          requiredPlan = 'ELITE';
        }
        
        return res.status(403).json({
          error: 'FEATURE_NOT_AVAILABLE',
          message: `This feature requires ${requiredPlan} plan`,
          currentPlan: userPlan,
          requiredPlan: requiredPlan,
          feature: featureName
        });
      }
      
      next();
    } catch (error) {
      console.error('Feature check error:', error);
      res.status(500).json({
        error: 'FEATURE_CHECK_FAILED',
        message: 'Error checking feature access'
      });
    }
  };
};

// Elite-only access
const checkEliteAccess = (req, res, next) => {
  if (req.user.subscription_plan !== 'ELITE') {
    return res.status(403).json({
      error: 'ELITE_ACCESS_REQUIRED',
      message: 'This feature is only available for ELITE subscribers',
      currentPlan: req.user.subscription_plan,
      requiredPlan: 'ELITE'
    });
  }
  next();
};

module.exports = {
  checkCredits,
  checkFeatureAccess,
  checkEliteAccess
};