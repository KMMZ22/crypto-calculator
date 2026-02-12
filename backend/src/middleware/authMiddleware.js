const { supabaseAdmin } = require('../config/supabase');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
      return res.status(401).json({ 
        error: 'AUTH_REQUIRED',
        message: 'No authorization token provided'
      });
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'AUTH_REQUIRED',
        message: 'Invalid authorization format. Use: Bearer <token>'
      });
    }
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      // Log l'erreur pour debug mais ne pas exposer les détails au client
      console.error('Token verification failed:', error?.message || 'No user found');
      
      return res.status(401).json({ 
        error: 'INVALID_TOKEN',
        message: 'Token is invalid or expired'
      });
    }
    
    // Get user profile - gérer le cas où le profil n'existe pas encore
    let profile = null;
    let profileError = null;
    
    try {
      const { data, error } = await supabaseAdmin
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle(); // 👈 Utilise maybeSingle() au lieu de single() pour éviter l'erreur "No rows found"
      
      profile = data;
      profileError = error;
    } catch (err) {
      console.error('Profile fetch error:', err.message);
    }
    
    // Create user object avec valeurs par défaut
    req.user = {
      id: user.id,
      email: user.email || '',
      subscription_plan: profile?.subscription_plan || 'FREE',
      credits: profile?.credits ?? 10, // Utilise ?? pour 0 crédits
      stripe_customer_id: profile?.stripe_customer_id || null,
      full_name: profile?.full_name || user.user_metadata?.full_name || '',
      created_at: profile?.created_at || new Date().toISOString(),
      profile: profile || {}
    };
    
    // Ajouter aussi au res.locals pour les templates (si jamais)
    res.locals.user = req.user;
    
    next();
  } catch (error) {
    console.error('🔥 Authentication middleware error:', error);
    res.status(500).json({ 
      error: 'AUTH_ERROR',
      message: 'Internal server error during authentication'
    });
  }
};

// Middleware optionnel pour vérifier les rôles/permissions
const requireRole = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'AUTH_REQUIRED',
        message: 'Authentication required'
      });
    }

    const userPlan = req.user.subscription_plan;
    
    if (roles.length > 0 && !roles.includes(userPlan) && userPlan !== 'ADMIN') {
      return res.status(403).json({
        error: 'FORBIDDEN',
        message: `This action requires one of these plans: ${roles.join(', ')}`,
        required_plans: roles,
        current_plan: userPlan
      });
    }

    next();
  };
};

// Middleware pour vérifier les crédits
const checkCredits = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: 'AUTH_REQUIRED',
        message: 'Authentication required'
      });
    }

    // Les utilisateurs ELITE et ADMIN ont des crédits illimités
    if (req.user.subscription_plan === 'ELITE' || req.user.subscription_plan === 'ADMIN') {
      return next();
    }

    if (req.user.credits <= 0) {
      return res.status(403).json({
        error: 'INSUFFICIENT_CREDITS',
        message: 'You have no credits left. Please upgrade your plan.',
        credits: req.user.credits,
        required_plan: 'PRO'
      });
    }

    next();
  } catch (error) {
    console.error('Credits check error:', error);
    res.status(500).json({
      error: 'CREDITS_CHECK_ERROR',
      message: 'Error checking credits'
    });
  }
};

module.exports = { 
  authenticate, 
  requireRole,
  checkCredits 
};