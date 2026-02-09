// backend/src/middleware/authMiddleware.js
const { supabaseAdmin } = require('../config/supabase');

// Middleware pour vérifier l'authentification
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        error: 'Token d\'authentification manquant' 
      });
    }
    
    // Vérifier le token avec Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Token invalide ou expiré' 
      });
    }
    
    // Récupérer le profil utilisateur
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Erreur profil utilisateur:', profileError);
    }
    
    // Ajouter les informations utilisateur à la requête
    req.user = {
      id: user.id,
      email: user.email,
      profile: profile || null
    };
    
    next();
  } catch (error) {
    console.error('Erreur authentification:', error);
    res.status(500).json({ error: 'Erreur d\'authentification' });
  }
};

// Middleware pour vérifier le plan d'abonnement
const checkPlan = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id;
      
      // Récupérer le plan de l'utilisateur
      const { data: profile, error } = await supabaseAdmin
        .from('user_profiles')
        .select('subscription_plan')
        .eq('id', userId)
        .single();
      
      if (error) {
        return res.status(500).json({ error: 'Erreur vérification plan' });
      }
      
      // Définir la hiérarchie des plans
      const planHierarchy = {
        'FREE': 0,
        'PRO': 1,
        'ELITE': 2
      };
      
      const userPlanLevel = planHierarchy[profile.subscription_plan] || 0;
      const requiredPlanLevel = planHierarchy[requiredPlan] || 0;
      
      if (userPlanLevel >= requiredPlanLevel) {
        next();
      } else {
        res.status(403).json({ 
          error: `Plan ${requiredPlan} requis. Votre plan actuel: ${profile.subscription_plan}` 
        });
      }
    } catch (error) {
      console.error('Erreur vérification plan:', error);
      res.status(500).json({ error: 'Erreur vérification plan' });
    }
  };
};

module.exports = { authenticate, checkPlan };