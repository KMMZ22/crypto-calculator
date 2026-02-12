const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authenticate, requireRole, checkCredits } = require('../middleware/authMiddleware');

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, full_name } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Email and password are required'
      });
    }
    
    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || ''
        }
      }
    });
    
    if (authError) {
      return res.status(400).json({
        error: 'REGISTRATION_FAILED',
        message: authError.message
      });
    }
    
    // Create user profile
    const { error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        id: authData.user.id,
        email: email,
        full_name: full_name || '',
        subscription_plan: 'FREE',
        credits: 10,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    
    if (profileError) {
      console.error('Profile creation error:', profileError);
    }
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: authData.user.id,
        email: authData.user.email,
        subscription_plan: 'FREE',
        credits: 10,
        full_name: full_name || ''
      }
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'REGISTRATION_ERROR',
      message: 'Internal server error during registration'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Email and password are required'
      });
    }
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) {
      return res.status(401).json({
        error: 'LOGIN_FAILED',
        message: 'Invalid email or password'
      });
    }
    
    // Get user profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle(); // CHANGÉ: .single() → .maybeSingle()
    
    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }
    
    // Update last login
    await supabaseAdmin
      .from('user_profiles')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', data.user.id)
      .maybeSingle();
    
    res.json({
      success: true,
      message: 'Login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        subscription_plan: profile?.subscription_plan || 'FREE',
        credits: profile?.credits || 10,
        full_name: profile?.full_name || ''
      }
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'LOGIN_ERROR',
      message: 'Internal server error during login'
    });
  }
});

// Get current user (protected)
router.get('/me', authenticate, async (req, res) => {
  try {
    // Déjà fait dans le middleware authenticate
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        subscription_plan: req.user.subscription_plan,
        credits: req.user.credits,
        full_name: req.user.full_name,
        stripe_customer_id: req.user.stripe_customer_id,
        created_at: req.user.created_at
      }
    });
    
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      error: 'USER_FETCH_ERROR',
      message: 'Error fetching user data'
    });
  }
});

// Logout
router.post('/logout', authenticate, async (req, res) => {
  try {
    await supabase.auth.signOut();
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
    
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'LOGOUT_ERROR',
      message: 'Error during logout'
    });
  }
});

// Update profile
router.put('/profile', authenticate, async (req, res) => {
  try {
    const { full_name } = req.body;
    
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({
        full_name: full_name || '',
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({
      error: 'PROFILE_UPDATE_ERROR',
      message: 'Error updating profile'
    });
  }
});

// ============================================
// ✅ NOUVELLES ROUTES UTILISANT requireRole ET checkCredits
// ============================================

// 🔒 RÉSERVÉ ADMIN - Gérer les utilisateurs
router.get('/admin/users', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    
    if (error) throw error;
    
    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Admin users fetch error:', error);
    res.status(500).json({
      error: 'ADMIN_FETCH_ERROR',
      message: 'Error fetching users'
    });
  }
});

// 🔒 RÉSERVÉ ADMIN - Modifier le plan d'un utilisateur
router.put('/admin/users/:userId/plan', authenticate, requireRole(['ADMIN']), async (req, res) => {
  try {
    const { userId } = req.params;
    const { subscription_plan, credits } = req.body;
    
    const updates = {};
    if (subscription_plan) updates.subscription_plan = subscription_plan;
    if (credits !== undefined) updates.credits = credits;
    updates.updated_at = new Date().toISOString();
    
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update(updates)
      .eq('id', userId);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: 'User plan updated successfully'
    });
  } catch (error) {
    console.error('Admin update error:', error);
    res.status(500).json({
      error: 'ADMIN_UPDATE_ERROR',
      message: 'Error updating user plan'
    });
  }
});

// 💎 RÉSERVÉ ELITE - Accès aux fonctionnalités avancées
router.get('/elite/insights', authenticate, requireRole(['ELITE', 'ADMIN']), async (req, res) => {
  try {
    // Simulation de données ELITE
    res.json({
      success: true,
      insights: {
        market_sentiment: 'bullish',
        top_picks: ['BTC', 'ETH', 'SOL'],
        risk_score: 42,
        ai_recommendations: [
          'Consider reducing leverage on BTC positions',
          'ETH showing strong support at $2100'
        ]
      }
    });
  } catch (error) {
    console.error('Elite insights error:', error);
    res.status(500).json({
      error: 'ELITE_INSIGHTS_ERROR',
      message: 'Error fetching elite insights'
    });
  }
});

// 🎯 EXEMPLE D'UTILISATION DE checkCredits
router.post('/calculate', authenticate, checkCredits, async (req, res) => {
  try {
    // Simulation d'un calcul qui consomme 1 crédit
    const { entryPrice, stopLoss, positionSize } = req.body;
    
    // Décrémenter les crédits
    const newCredits = Math.max(0, req.user.credits - 1);
    
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id);
    
    if (error) throw error;
    
    // Résultat du calcul
    const riskAmount = positionSize * (Math.abs(entryPrice - stopLoss) / entryPrice);
    
    res.json({
      success: true,
      calculation: {
        risk_amount: riskAmount,
        risk_percentage: (riskAmount / positionSize) * 100,
        credits_remaining: newCredits
      },
      message: newCredits === 0 ? '⚠️ Plus de crédits. Passez à PRO pour continuer.' : undefined
    });
    
  } catch (error) {
    console.error('Calculation error:', error);
    res.status(500).json({
      error: 'CALCULATION_ERROR',
      message: 'Error performing calculation'
    });
  }
});

// 🔄 Vérifier les crédits restants
router.get('/credits', authenticate, async (req, res) => {
  res.json({
    success: true,
    credits: req.user.credits,
    plan: req.user.subscription_plan,
    is_unlimited: ['ELITE', 'ADMIN'].includes(req.user.subscription_plan)
  });
});

// ⚡ Route pour recharger des crédits (simulation)
router.post('/credits/purchase', authenticate, requireRole(['FREE', 'PRO']), async (req, res) => {
  try {
    const { amount } = req.body; // Nombre de crédits à ajouter
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Valid amount required'
      });
    }
    
    const newCredits = req.user.credits + amount;
    
    const { error } = await supabaseAdmin
      .from('user_profiles')
      .update({ 
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', req.user.id);
    
    if (error) throw error;
    
    res.json({
      success: true,
      message: `${amount} crédits ajoutés avec succès`,
      credits: newCredits
    });
    
  } catch (error) {
    console.error('Credits purchase error:', error);
    res.status(500).json({
      error: 'PURCHASE_ERROR',
      message: 'Error purchasing credits'
    });
  }
});

module.exports = router;