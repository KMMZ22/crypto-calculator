import express from 'express';
import axios from 'axios';

const router = express.Router();

// GET /api/economic-calendar
router.get('/', async (req, res) => {
    try {
        const { from, to, country = 'US' } = req.query;
        
        // Utiliser Financial Modeling Prep API
        const response = await axios.get('https://financialmodelingprep.com/api/v3/economic_calendar', {
            params: {
                from: from || new Date().toISOString().split('T')[0],
                to: to || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                apikey: process.env.FMP_API_KEY || 'demo'
            }
        });
        
        const events = response.data.filter(event => 
            event.country === country
        );
        
        res.json({
            success: true,
            events,
            count: events.length,
            country,
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