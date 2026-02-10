const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const calculatorRoutes = require('./routes/calculatorRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const priceRoutes = require('./routes/priceRoutes');
const eliteRoutes = require('./routes/eliteRoutes');
const economicCalendarRoutes = require('./routes/economicCalendarRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// ====================
// MIDDLEWARE
// ====================

// Security
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});

app.use('/api/', apiLimiter);

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
    environment: process.env.NODE_ENV || 'development'
  });
});

// API status
app.get('/api/status', (req, res) => {
  res.json({ 
    message: 'Crypto Calculator API is running',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      calculator: '/api/calculator',
      payment: '/api/payment',
      price: '/api/price',
      elite: '/api/elite',
      economicCalendar: '/api/economic-calendar'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/calculator', calculatorRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/price', priceRoutes);
app.use('/api/elite', eliteRoutes);
app.use('/api/economic-calendar', economicCalendarRoutes);

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
  
  // Add stack trace in development
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
╔══════════════════════════════════════╗
║  🚀 CRYPTO CALCULATOR API STARTED    ║
╠══════════════════════════════════════╣
║  📍 Port: ${PORT}                      ║
║  🌍 Env: ${process.env.NODE_ENV || 'development'}                         ║
║  🔗 Health: http://localhost:${PORT}/health  ║
║  📊 Status: http://localhost:${PORT}/api/status ║
╚══════════════════════════════════════╝
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