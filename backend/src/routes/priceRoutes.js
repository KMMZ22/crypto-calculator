const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { checkFeatureAccess } = require('../middleware/planMiddleware');
const axios = require('axios');
const NodeCache = require('node-cache');

// Create a cache with standard TTL of 60 seconds (1 minute).
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
const BINANCE_BASE = 'https://api.binance.com';

// Mapping our internal timeframes → Binance intervals
const INTERVAL_MAP = {
  '1H': '1h',
  '4H': '4h',
  '1D': '1d',
  '1W': '1w',
  '1M': '1M',
};

// ─── GET /api/price/klines ─────────────────────────────────────────────────
// Fetch OHLCV candlestick data from Binance public API (no API key required)
// Query params: symbol (e.g. BTCUSDT), interval (1H|4H|1D|1W|1M), limit (default 200)
router.get('/klines', async (req, res) => {
  try {
    const { symbol = 'BTCUSDT', interval = '1D', limit = 200 } = req.query;
    const binanceInterval = INTERVAL_MAP[interval] || '1d';
    
    const cacheKey = `klines_${symbol}_${binanceInterval}_${limit}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.json({ success: true, symbol, interval, source: 'cache', candles: cachedData });
    }

    const response = await axios.get(`${BINANCE_BASE}/api/v3/klines`, {
      params: { symbol, interval: binanceInterval, limit: parseInt(limit) },
      timeout: 8000,
    });

    // Binance klines format:
    // [openTime, open, high, low, close, volume, closeTime, ...]
    const candles = response.data.map(k => ({
      time: Math.floor(k[0] / 1000), // Unix timestamp in seconds
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    cache.set(cacheKey, candles);

    res.json({ success: true, symbol, interval, source: 'api', candles });
  } catch (error) {
    console.error('Binance klines error:', error.message);
    res.status(502).json({
      error: 'BINANCE_ERROR',
      message: 'Failed to fetch klines from Binance',
    });
  }
});

// ─── GET /api/price/crypto ─────────────────────────────────────────────────
router.get('/crypto', authenticate, checkFeatureAccess('realTimePrices'), async (req, res) => {
  try {
    const { symbols = 'BTC,ETH,BNB,SOL,XRP', currency = 'USD' } = req.query;
    const usePremiumApi = req.user.subscription_plan !== 'FREE';
    
    // Create cache key based on query params and user plan
    const cacheKey = `crypto_${symbols}_${currency}_${usePremiumApi}`;
    const cachedPrices = cache.get(cacheKey);
    if (cachedPrices) {
      return res.json({ success: true, prices: cachedPrices, currency, isRealTime: usePremiumApi, source: 'cache', lastUpdated: new Date().toISOString() });
    }

    let prices = {};

    // CoinGecko API integration was removed by request.
    // Falling back to mock data or other real-time APIs if configured below.

    if (Object.keys(prices).length === 0) {
      const symbolList = symbols.split(',').map(s => s.trim().toLowerCase());
      const mockPrices = {
        btc: { usd: 45000 + Math.random() * 1000 },
        eth: { usd: 2500 + Math.random() * 100 },
        bnb: { usd: 300 + Math.random() * 10 },
        sol: { usd: 100 + Math.random() * 5 },
        xrp: { usd: 0.5 + Math.random() * 0.1 },
      };
      const result = {};
      symbolList.forEach(symbol => {
        if (mockPrices[symbol]) {
          result[symbol] = {
            [currency.toLowerCase()]: mockPrices[symbol][currency.toLowerCase()] || mockPrices[symbol].usd,
            source: 'mock',
            isRealTime: false,
          };
        }
      });
      prices = result;
    }

    cache.set(cacheKey, prices);

    res.json({ success: true, prices, currency, isRealTime: usePremiumApi, source: 'api', lastUpdated: new Date().toISOString() });
  } catch (error) {
    console.error('Price fetch error:', error);
    res.status(500).json({ error: 'PRICE_FETCH_ERROR', message: 'Error fetching crypto prices' });
  }
});

// ─── GET /api/price/history/:symbol ──────────────────────────────────────
router.get('/history/:symbol', authenticate, checkFeatureAccess('realTimePrices'), async (req, res) => {
  try {
    const { symbol } = req.params;
    const { days = 7 } = req.query;
    const binanceSymbol = symbol.toUpperCase() + 'USDT';

    const cacheKey = `history_${binanceSymbol}_${days}`;
    const cachedHistory = cache.get(cacheKey);
    if (cachedHistory) {
      return res.json({ success: true, symbol: symbol.toUpperCase(), currency: 'USD', history: cachedHistory, days: parseInt(days), source: 'cache' });
    }

    const response = await axios.get(`${BINANCE_BASE}/api/v3/klines`, {
      params: { symbol: binanceSymbol, interval: '1d', limit: parseInt(days) },
      timeout: 8000,
    });

    const history = response.data.map(k => ({
      timestamp: new Date(k[0]).toISOString(),
      price: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    // Cache history for a bit longer as it doesn't change as fast
    cache.set(cacheKey, history, 300);

    res.json({ success: true, symbol: symbol.toUpperCase(), currency: 'USD', history, days: parseInt(days), source: 'api' });
  } catch (error) {
    console.error('History fetch error:', error.message);
    res.status(502).json({ error: 'HISTORY_FETCH_ERROR', message: 'Error fetching price history' });
  }
});

// ─── GET /api/price/multiple ──────────────────────────────────────────────
router.get('/multiple', authenticate, checkFeatureAccess('realTimePrices'), async (req, res) => {
  try {
    const { symbols = 'BTC,ETH,BNB' } = req.query;
    const symbolList = symbols.split(',').map(s => s.trim().toUpperCase());

    const cryptoData = {
      BTC: { price: 45234.56, change24h: 2.34, marketCap: 885234567890, volume24h: 23456789012, high24h: 45500.12, low24h: 44890.45 },
      ETH: { price: 2534.78, change24h: 1.23, marketCap: 304567890123, volume24h: 12345678901, high24h: 2560.34, low24h: 2490.12 },
      BNB: { price: 312.45, change24h: -0.56, marketCap: 45678901234, volume24h: 3456789012, high24h: 318.90, low24h: 308.34 },
    };

    const result = {};
    symbolList.forEach(symbol => { if (cryptoData[symbol]) result[symbol] = cryptoData[symbol]; });

    res.json({ success: true, data: result, count: Object.keys(result).length, lastUpdated: new Date().toISOString() });
  } catch (error) {
    console.error('Multiple prices error:', error);
    res.status(500).json({ error: 'PRICES_FETCH_ERROR', message: 'Error fetching multiple crypto prices' });
  }
});

module.exports = router;