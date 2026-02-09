import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/express';
import { requirePlan } from '../middleware/planMiddleware.js';

const router = express.Router();

// GET /api/elite/features
router.get('/features', ClerkExpressRequireAuth(), requirePlan('ELITE'), async (req, res) => {
    try {
        res.json({
            success: true,
            features: [
                'AI Trading Predictions',
                'Custom Strategy Builder',
                'Advanced Risk Analytics',
                'Priority API Access',
                '24/7 Premium Support',
                'Historical Data Analysis',
                'Multi-exchange Arbitrage',
                'Portfolio Optimization'
            ],
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;