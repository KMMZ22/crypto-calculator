const express = require('express');
const router = express.Router();
const { supabase, supabaseAdmin } = require('../config/supabase');
const { authenticate } = require('../middleware/authMiddleware');

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
        credits: 10
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
        credits: 10
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
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();
    
    // Update last login
    await supabaseAdmin
      .from('user_profiles')
      .update({ last_login: new Date().toISOString() })
      .eq('id', data.user.id);
    
    res.json({
      success: true,
      message: 'Login successful',
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        subscription_plan: profile?.subscription_plan || 'FREE',
        credits: profile?.credits || 10,
        full_name: profile?.full_name
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
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', req.user.id)
      .single();
    
    res.json({
      success: true,
      user: {
        id: req.user.id,
        email: req.user.email,
        subscription_plan: profile?.subscription_plan || 'FREE',
        credits: profile?.credits || 10,
        full_name: profile?.full_name,
        stripe_customer_id: profile?.stripe_customer_id,
        created_at: profile?.created_at
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
    const token = req.headers.authorization?.split(' ')[1];
    
    if (token) {
      await supabase.auth.signOut();
    }
    
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

module.exports = router;