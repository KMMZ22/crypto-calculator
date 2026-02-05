import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import priceRoutes from './routes/priceRoutes.js';
import economicCalendarRoutes from './routes/economicCalendarRoutes.js';
import calculatorRoutes from './routes/calculatorRoutes.js';
import eliteRoutes from './routes/eliteRoutes.js'; // Ajout pour ELITE

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3001';

// Middleware
app.use(helmet());
app.use(cors({ 
    origin: FRONTEND_URL, 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes principales
app.use('/api/price', priceRoutes);
app.use('/api/economic-calendar', economicCalendarRoutes);
app.use('/api/calculate', calculatorRoutes);
app.use('/api/elite', eliteRoutes); // Routes ELITE

// Health check améliorée
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'TradeGuard Crypto Calculator API',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        services: {
            price: 'active',
            calendar: 'active',
            calculator: 'active',
            elite: 'active',
            status: 'operational'
        },
        endpoints: {
            price: '/api/price/:symbol',
            calendar: '/api/economic-calendar',
            calculator: '/api/calculate/position',
            elite: '/api/elite/features',
            docs: 'Coming soon...'
        }
    });
});

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'TradeGuard Crypto Calculator API',
        version: '2.0.0',
        documentation: 'Available at /api/health',
        endpoints: [
            '/api/health - Health check',
            '/api/price/:symbol - Get cryptocurrency price',
            '/api/calculate/position - Calculate position size',
            '/api/elite/features - ELITE features (demo)'
        ]
    });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route not found',
        path: req.originalUrl,
        availableRoutes: [
            'GET /api/health',
            'GET /api/price/:symbol',
            'POST /api/calculate/position',
            'GET /api/elite/features'
        ]
    });
});

// Gestionnaire d'erreurs global
app.use((err, req, res, next) => {
    console.error('❌ Server Error:', err);
    
    res.status(err.status || 500).json({
        success: false,
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`\n🚀 TradeGuard Backend démarré !`);
    console.log(`================================`);
    console.log(`📍 Port: ${PORT}`);
    console.log(`🌍 Frontend: ${FRONTEND_URL}`);
    console.log(`\n📡 Endpoints disponibles:`);
    console.log(`   ✅ Health: http://localhost:${PORT}/api/health`);
    console.log(`   💰 Price: http://localhost:${PORT}/api/price/BTCUSDT`);
    console.log(`   📊 Calculate: POST http://localhost:${PORT}/api/calculate/position`);
    console.log(`   🏆 Elite: http://localhost:${PORT}/api/elite/features`);
    console.log(`\n⚡ Mode: ${process.env.NODE_ENV || 'development'}`);
    console.log(`================================\n`);
});