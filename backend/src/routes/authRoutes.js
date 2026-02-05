import express from 'express';
import authService from '../services/authService.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;
        
        const result = await authService.register(email, password, username);
        
        if (result.success) {
            res.status(201).json(result);
        } else {
            res.status(400).json(result);
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const result = await authService.login(email, password);
        
        if (result.success) {
            res.json(result);
        } else {
            res.status(401).json(result);
        }
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/auth/logout
router.post('/logout', authenticate, async (req, res) => {
    try {
        const result = await authService.logout();
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req, res) => {
    try {
        const result = await authService.getCurrentUser(req.user);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/auth/upgrade/elite
router.post('/upgrade/elite', authenticate, async (req, res) => {
    try {
        const result = await authService.upgradeToElite(req.user.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/auth/plans
router.get('/plans', async (req, res) => {
    try {
        const { data: plans, error } = await supabase
            .from('plan_features')
            .select('*')
            .eq('is_active', true)
            .order('display_order');

        if (error) throw error;

        res.json({
            success: true,
            plans
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;