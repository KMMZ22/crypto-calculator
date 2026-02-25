// backend/src/routes/economicCalendarRoutes.js
const express = require('express');
const router = express.Router();

// Cache simple en mémoire (optionnel)
const cache = {};

router.get('/', async (req, res) => {
  try {
    const { from, to, country } = req.query;
    const cacheKey = `${from}-${to}-${country}`;

    // Vérifier le cache (durée 1 heure)
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 3600000) {
      return res.json(cache[cacheKey].data);
    }

    const apiToken = process.env.EOD_API_KEY;
    if (!apiToken) {
      return res.status(500).json({ error: 'Clé API EOD manquante' });
    }

    let url = `https://eodhistoricaldata.com/api/economic-calendar?api_token=${apiToken}&from=${from}&to=${to}`;
    if (country && country !== 'all') {
      url += `&country=${country}`;
    }

    const response = await fetch(url);
    const data = await response.json();

    // Stocker en cache
    cache[cacheKey] = { data, timestamp: Date.now() };

    res.json(data);
  } catch (error) {
    console.error('❌ Erreur proxy EOD:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;