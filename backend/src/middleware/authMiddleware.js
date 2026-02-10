const { supabaseAdmin } = require('../config/supabase');

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Authentication required',
        message: 'No authorization token provided'
      });
    }
    
    // Verify token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Token is invalid or expired'
      });
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    // Create user object
    req.user = {
      id: user.id,
      email: user.email,
      subscription_plan: profile?.subscription_plan || 'FREE',
      credits: profile?.credits || 10,
      stripe_customer_id: profile?.stripe_customer_id,
      profile: profile || {}
    };
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      message: 'Internal server error during authentication'
    });
  }
};

module.exports = { authenticate };