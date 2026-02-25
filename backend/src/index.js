const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// ====================
// IMPORT SUPABASE
// ====================
const { supabase, supabaseAdmin, testConnection } = require('./config/supabase');

// ====================
// IMPORTS ROUTES
// ====================
const authRoutes = require('./routes/authRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const priceRoutes = require('./routes/priceRoutes');
const eliteRoutes = require('./routes/eliteRoutes');
const priceProxyRoutes = require('./routes/priceProxyRoutes');      // Proxy Twelve Data pour les prix
const economicCalendarFMP = require('./routes/economicCalendarFMP');
const chartAnalysisRoutes = require('./routes/chartAnalysisRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

// ====================
// MIDDLEWARE
// ====================

// Security
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://localhost:5173',
    process.env.FRONTEND_URL || 'http://localhost:3001'
  ],
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' },
  skip: (req) => req.path.includes('/api/price/binance') || req.path.includes('/api/binance')
});

app.use('/api/', apiLimiter);

// ====================
// MIDDLEWARE SUPABASE
// ====================
app.use((req, res, next) => {
  req.supabase = supabase;
  req.supabaseAdmin = supabaseAdmin;
  next();
});

// ====================
// ROUTES
// ====================

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'crypto-calculator-api',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    supabase: 'connected'
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({
    message: 'Crypto Calculator API is running',
    version: '1.0.0',
    supabase: 'connected',
    endpoints: {
      auth: '/api/auth',
      calculator: '/api/calculator',
      payment: '/api/payment',
      price: '/api/price',
      elite: '/api/elite',
      economicCalendar: '/api/economic-calendar',
      priceProxy: '/api/price-proxy',
      binance: '/api/binance/:symbol'
    }
  });
});

// Route de test Supabase
app.get('/api/test-supabase', async (req, res) => {
  try {
    const isConnected = await testConnection();
    res.json({
      success: isConnected,
      message: isConnected ? 'Supabase connecté avec succès' : 'Supabase non connecté',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      hint: 'Vérifie la configuration Supabase'
    });
  }
});

// Route Binance directe (mock)
app.get('/api/binance/:symbol', (req, res) => {
  const { symbol } = req.params;
  const mockPrices = {
    'BTCUSDT': 43000 + Math.random() * 2000,
    'ETHUSDT': 2200 + Math.random() * 100,
    'BNBUSDT': 310 + Math.random() * 10,
    'SOLUSDT': 100 + Math.random() * 5,
    'ADAUSDT': 0.5 + Math.random() * 0.1,
    'DEFAULT': 100 + Math.random() * 10
  };
  const price = mockPrices[symbol] || mockPrices.DEFAULT;
  res.json({
    symbol,
    price: parseFloat(price.toFixed(2)),
    timestamp: new Date().toISOString(),
    source: 'mock'
  });
});

// ====================
// MONTAGE DES ROUTES API
// ====================
app.use('/api/auth', authRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/elite', eliteRoutes);
app.use('/api/price-proxy', priceProxyRoutes);
app.use('/api/economic-calendar', economicCalendarFMP);
app.use('/api/chart-analysis', chartAnalysisRoutes);
// ====================
// ERROR HANDLING
// ====================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('🔥 Server error:', err);
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error'
    : err.message;
  const response = {
    error: message,
    statusCode: statusCode
  };
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.stack = err.stack;
  }
  res.status(statusCode).json(response);
});

// ====================
// START SERVER
// ====================

app.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════╗
║     🚀 CRYPTO CALCULATOR API STARTED     ║
╠══════════════════════════════════════════╣
║  📍 Port: ${PORT}                          ║
║  🌍 Env: ${process.env.NODE_ENV || 'development'}          ║
║  🔐 Supabase: ✅ CONNECTED                ║
║  🔗 Health: http://localhost:${PORT}/health║
║  📊 Status: http://localhost:${PORT}/api/status║
║  🧪 Test DB: http://localhost:${PORT}/api/test-supabase║
║  💰 Binance: http://localhost:${PORT}/api/binance/BTCUSDT║
╚══════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});