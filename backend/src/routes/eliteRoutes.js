import express from 'express';
import { authenticate, requireElite } from '../middleware/authMiddleware.js';
import aiAdvisorService from '../services/aiAdvisorService.js';
import backtestingService from '../services/backtestingService.js';

const router = express.Router();

// Toutes les routes ELITE nécessitent une authentification
router.use(authenticate);
router.use(requireElite);

// GET /api/elite/features
router.get('/features', async (req, res) => {
    try {
        const { data: plan } = await supabase
            .from('plan_features')
            .select('*')
            .eq('plan', 'ELITE')
            .single();

        res.json({
            success: true,
            plan,
            user_id: req.user.id,
            access_granted: true
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/elite/ai-analyze
router.post('/ai-analyze', async (req, res) => {
    try {
        // Vérifier et consommer des crédits
        const { data: credits } = await supabase
            .from('ai_credits')
            .select('credits_remaining')
            .eq('user_id', req.user.id)
            .single();

        if (!credits || credits.credits_remaining <= 0) {
            return res.status(403).json({
                success: false,
                error: 'Insufficient AI credits',
                required: 1,
                available: credits?.credits_remaining || 0
            });
        }

        // Consommer un crédit
        await supabase
            .from('ai_credits')
            .update({
                credits_used: supabase.raw('credits_used + 1'),
                credits_remaining: supabase.raw('credits_remaining - 1'),
                updated_at: new Date().toISOString()
            })
            .eq('user_id', req.user.id);

        const analysis = await aiAdvisorService.analyzeTradeSetup(req.body);
        
        res.json({
            success: true,
            ...analysis,
            credits_used: 1,
            credits_remaining: credits.credits_remaining - 1
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/elite/backtest
router.post('/backtest', async (req, res) => {
    try {
        const results = await backtestingService.backtestStrategy(
            req.body.strategy,
            req.body.symbol,
            req.body.period,
            req.body.initialCapital
        );
        
        res.json({
            success: true,
            ...results
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/elite/credits
router.get('/credits', async (req, res) => {
    try {
        const { data: credits } = await supabase
            .from('ai_credits')
            .select('*')
            .eq('user_id', req.user.id)
            .single();

        res.json({
            success: true,
            credits: credits || {
                credits_used: 0,
                credits_remaining: 1000,
                last_reset_date: new Date().toISOString().split('T')[0]
            }
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;