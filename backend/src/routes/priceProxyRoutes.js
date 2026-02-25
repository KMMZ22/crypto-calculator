// backend/src/routes/priceProxyRoutes.js
const express = require('express');
const fetch = require('node-fetch');
const router = express.Router();

const TWELVE_DATA_KEY = process.env.TWELVE_DATA_KEY;

// Cache simple (optionnel)
const cache = {};

router.get('/price', async (req, res) => {
  try {
    const { symbol } = req.query;
    if (!symbol) {
      return res.status(400).json({ error: 'Symbole manquant' });
    }

    const cacheKey = symbol;
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 60000) {
      return res.json(cache[cacheKey].data);
    }

    const url = `https://api.twelvedata.com/price?symbol=${symbol}&apikey=${TWELVE_DATA_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'error') {
      throw new Error(data.message);
    }

    cache[cacheKey] = { data, timestamp: Date.now() };
    res.json(data);
  } catch (error) {
    console.error('❌ Erreur proxy Twelve Data:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;