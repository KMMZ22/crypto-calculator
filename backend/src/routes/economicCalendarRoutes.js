import express from 'express';

const router = express.Router();

// GET /api/economic-calendar
router.get('/', (req, res) => {
    try {
        const { country } = req.query;
        
        // Données mock pour la démo
        const events = [
            {
                id: '1',
                title: 'US CPI Inflation Rate',
                country: 'US',
                date: new Date().toISOString().split('T')[0],
                time: '14:30',
                importance: 3,
                actual: '3.4%',
                forecast: '3.2%',
                previous: '3.1%',
                currency: 'USD',
                description: 'Consumer Price Index for United States',
                source: 'demo'
            },
            {
                id: '2',
                title: 'EU Interest Rate Decision',
                country: 'EU',
                date: new Date().toISOString().split('T')[0],
                time: '13:45',
                importance: 3,
                actual: '4.50%',
                forecast: '4.50%',
                previous: '4.50%',
                currency: 'EUR',
                description: 'European Central Bank Monetary Policy Decision',
                source: 'demo'
            },
            {
                id: '3',
                title: 'FED Chair Powell Speech',
                country: 'US',
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                time: '16:00',
                importance: 3,
                currency: 'USD',
                description: 'Federal Reserve Chair speech on monetary policy',
                source: 'demo'
            }
        ];
        
        // Filtrer par pays si spécifié
        let filteredEvents = events;
        if (country && country !== 'all') {
            filteredEvents = events.filter(event => 
                event.country === country.toUpperCase()
            );
        }
        
        res.json({
            success: true,
            events: filteredEvents,
            count: filteredEvents.length,
            from: new Date().toISOString().split('T')[0],
            to: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// GET /api/economic-calendar/upcoming
router.get('/upcoming', (req, res) => {
    try {
        const events = [
            {
                id: '4',
                title: 'US Non-Farm Payrolls',
                country: 'US',
                date: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
                time: '13:30',
                importance: 3,
                forecast: '180K',
                previous: '199K',
                currency: 'USD',
                description: 'US Employment Report',
                source: 'demo'
            },
            {
                id: '5',
                title: 'Japan Unemployment Rate',
                country: 'JP',
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                time: '00:30',
                importance: 2,
                forecast: '2.5%',
                previous: '2.6%',
                currency: 'JPY',
                description: 'Unemployment rate for Japan',
                source: 'demo'
            }
        ];
        
        res.json({
            success: true,
            events,
            count: events.length,
            timeframe: 'next_48_hours',
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