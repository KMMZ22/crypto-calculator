// middleware/planMiddleware.js
import { createClerkClient } from '@clerk/backend';

// Créer le client Clerk - Vérifie que CLERK_SECRET_KEY est dans .env
const clerkClient = createClerkClient({ 
  secretKey: process.env.CLERK_SECRET_KEY 
});

// Middleware pour vérifier le plan
export const requirePlan = (requiredPlan) => {
  return async (req, res, next) => {
    try {
      // Vérifier l'authentification
      if (!req.auth || !req.auth.userId) {
        return res.status(401).json({
          success: false,
          error: 'Authentication required'
        });
      }

      const userId = req.auth.userId;
      
      // Récupérer l'utilisateur depuis Clerk
      const user = await clerkClient.users.getUser(userId);
      
      // Récupérer le plan actuel (par défaut FREE)
      const currentPlan = user.privateMetadata?.subscription_plan || 'FREE';

      // Hiérarchie des plans
      const planHierarchy = { 'FREE': 0, 'PRO': 1, 'ELITE': 2 };
      
      // Vérifier si l'utilisateur a le plan requis
      if (planHierarchy[currentPlan] < planHierarchy[requiredPlan]) {
        return res.status(403).json({
          success: false,
          error: `${requiredPlan} plan required`,
          currentPlan,
          requiredPlan,
          upgradeUrl: `/api/payment/upgrade?plan=${requiredPlan}`
        });
      }

      // Ajouter l'utilisateur à la requête pour les routes suivantes
      req.user = {
        id: userId,
        plan: currentPlan
      };

      next();
    } catch (error) {
      console.error('Plan middleware error:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  };
};

// Middleware pour vérifier les limites d'usage
export const checkUsageLimits = async (req, res, next) => {
  try {
    if (!req.auth || !req.auth.userId) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    const userId = req.auth.userId;
    const user = await clerkClient.users.getUser(userId);
    const currentPlan = user.privateMetadata?.subscription_plan || 'FREE';
    
    // ELITE n'a pas de limites
    if (currentPlan !== 'ELITE') {
      const today = new Date().toISOString().split('T')[0];
      const usageKey = `usage_${today}`;
      
      // Récupérer l'usage quotidien
      let dailyUsage = 0;
      if (user.privateMetadata && user.privateMetadata[usageKey]) {
        dailyUsage = Number(user.privateMetadata[usageKey]);
      }
      
      // Définir la limite selon le plan
      const maxUsage = currentPlan === 'FREE' ? 10 : 100;
      
      // Vérifier si la limite est atteinte
      if (dailyUsage >= maxUsage) {
        return res.status(403).json({
          success: false,
          error: `Daily limit reached (${dailyUsage}/${maxUsage})`,
          upgradeUrl: '/api/payment/plans'
        });
      }
      
      // Incrémenter l'usage
      const newMetadata = {
        ...user.privateMetadata,
        [usageKey]: dailyUsage + 1
      };
      
      await clerkClient.users.updateUser(userId, {
        privateMetadata: newMetadata
      });
    }

    next();
  } catch (error) {
    console.error('Usage limit error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
};