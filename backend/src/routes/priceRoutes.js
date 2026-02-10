const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { checkFeatureAccess } = require('../middleware/planMiddleware');
const axios = require('axios');

// Get crypto prices (FREE: delayed, PRO/ELITE: real-time)
router.get('/crypto', authenticate, checkFeatureAccess('realTimePrices'), async (req, res) => {
  try {
    const { symbols = 'BTC,ETH,BNB,SOL,XRP', currency = 'USD' } = req.query;
    
    // For FREE users, use public API with rate limiting
    // For PRO/ELITE, use premium API with real-time data
    const usePremiumApi = req.user.subscription_plan !== 'FREE';
    
    let prices = {};
    
    if (usePremiumApi && process.env.COINGECKO_API_KEY) {
      // Use CoinGecko Pro API
      const symbolList = symbols.split(',').map(s => s.trim().toLowerCase());
      
      try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
          params: {
            ids: symbolList.join(','),
            vs_currencies: currency.toLowerCase(),
            precision: 'full'
          },
          headers: {
            'x-cg-pro-api-key': process.env.COINGECKO_API_KEY
          }
        });
        
        prices = response.data;
      } catch (apiError) {
        console.warn('Premium API failed, falling back to free API:', apiError.message);
        // Fall back to free API
      }
    }
    
    // Free API fallback (CoinGecko free tier)
    if (Object.keys(prices).length === 0) {
      const symbolList = symbols.split(',').map(s => s.trim().toLowerCase());
      
      // Simple mock for now - in production, implement actual API calls
      const mockPrices = {
        btc: { usd: 45000 + Math.random() * 1000 },
        eth: { usd: 2500 + Math.random() * 100 },
        bnb: { usd: 300 + Math.random() * 10 },
        sol: { usd: 100 + Math.random() * 5 },
        xrp: { usd: 0.5 + Math.random() * 0.1 }
      };
      
      const result = {};
      symbolList.forEach(symbol => {
        if (mockPrices[symbol]) {
          result[symbol] = {
            [currency.toLowerCase()]: mockPrices[symbol][currency.toLowerCase()] || mockPrices[symbol].usd,
            source: 'mock', // In production: 'coingecko'
            isRealTime: false
          };
        }
      });
      
      prices = result;
    }
    
    res.json({
      success: true,
      prices: prices,
      currency: currency,
      isRealTime: usePremiumApi,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Price fetch error:', error);
    res.status(500).json({
      error: 'PRICE_FETCH_ERROR',
      message: 'Error fetching crypto prices'
    });
  }
});

// Get price history
router.get('/history/:symbol', authenticate, checkFeatureAccess('realTimePrices'), async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days = 7, currency = 'USD' } = req.query;
    
    // Mock historical data - in production, use CoinGecko API
    const history = [];
    const now = Date.now();
    const basePrice = symbol.toLowerCase() === 'btc' ? 45000 : 
                     symbol.toLowerCase() === 'eth' ? 2500 : 100;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(now - (i * 24 * 60 * 60 * 1000));
      const price = basePrice + (Math.random() - 0.5) * 1000;
      
      history.push({
        timestamp: date.toISOString(),
        price: Number(price.toFixed(2)),
        volume: Math.random() * 1000000
      });
    }
    
    res.json({
      success: true,
      symbol: symbol.toUpperCase(),
      currency: currency,
      history: history,
      days: parseInt(days),
      source: 'mock' // In production: 'coingecko'
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'HISTORY_FETCH_ERROR',
      message: 'Error fetching price history'
    });
  }
});

// Get multiple crypto prices with details
router.get('/multiple', authenticate, checkFeatureAccess('realTimePrices'), async (req, res) => {
  try {
    const { symbols = 'BTC,ETH,BNB' } = req.query;
    
    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());
    
    // Mock data - replace with actual API calls
    const cryptoData = {
      BTC: {
        price: 45234.56,
        change24h: 2.34,
        marketCap: 885234567890,
        volume24h: 23456789012,
        high24h: 45500.12,
        low24h: 44890.45
      },
      ETH: {
        price: 2534.78,
        change24h: 1.23,
        marketCap: 304567890123,
        volume24h: 12345678901,
        high24h: 2560.34,
        low24h: 2490.12
      },
      BNB: {
        price: 312.45,
        change24h: -0.56,
        marketCap: 45678901234,
        volume24h: 3456789012,
        high24h: 318.90,
        low24h: 308.34
      }
    };
    
    const result = {};
    symbolList.forEach(symbol => {
      if (cryptoData[symbol]) {
        result[symbol] = cryptoData[symbol];
      }
    });
    
    res.json({
      success: true,
      data: result,
      count: Object.keys(result).length,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Multiple prices error:', error);
    res.status(500).json({
      error: 'PRICES_FETCH_ERROR',
      message: 'Error fetching multiple crypto prices'
    });
  }
});

module.exports = router;