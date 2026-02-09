// routes/calculatorRoutes.js
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/express';
import { getAuthUser } from '../middleware/authMiddleware.js';
import authService from '../services/authService.js';

const router = express.Router();

// POST /api/calculate/position - Protégé et vérifie les crédits
router.post('/position', ClerkExpressRequireAuth(), getAuthUser, async (req, res) => {
    try {
        // Vérifier les crédits pour les utilisateurs FREE
        if (req.user.subscription_plan === 'FREE') {
            const hasAccess = await authService.checkFeatureAccess(req.user.id, 'calculations_per_day');
            if (!hasAccess) {
                // Vérifier et consommer un crédit
                if (req.user.credits <= 0) {
                    return res.status(403).json({
                        success: false,
                        error: 'Daily calculation limit reached. Upgrade to ELITE for unlimited calculations.',
                        upgradeUrl: '/api/auth/upgrade/elite'
                    });
                }
                // Utiliser un crédit
                await authService.updateCredits(req.user.id, -1);
            }
        }

        // ... reste du code de calcul ...
        const { capital, riskPercentage, entryPrice, stopLossPrice } = req.body;
        
        // Calculs...
        
        res.json({
            success: true,
            credits_remaining: req.user.credits - 1,
            // ... autres résultats
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// ... autres routes