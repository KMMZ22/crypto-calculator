// routes/authRoutes.js
import express from 'express';
import { ClerkExpressRequireAuth } from '@clerk/express';
import authService from '../services/authService.js';

const router = express.Router();

// GET /api/auth/me
router.get('/me', ClerkExpressRequireAuth(), async (req, res) => {
    try {
        const userId = req.auth.userId;
        const result = await authService.getCurrentUser(userId);
        res.json(result);
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;