// backend/src/routes/economicCalendarFMP.js
const express = require('express');
const router = express.Router();

const cache = {};

router.get('/', async (req, res) => {
  try {
    const { from, to, country } = req.query;
    const cacheKey = `fmp-${from}-${to}-${country}`;

    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < 3600000) {
      return res.json(cache[cacheKey].data);
    }

    const apiToken = process.env.FMP_API_KEY;
    if (!apiToken) {
      return res.status(500).json({ error: 'Clé API FMP manquante' });
    }

    // Construction de l'URL pour le calendrier économique FMP
    const url = `https://financialmodelingprep.com/api/v3/economic_calendar?from=${from}&to=${to}&apikey=${apiToken}`;
    console.log('📡 Proxy FMP ->', url);

    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FMP HTTP error:', response.status, errorText);
      return res.status(500).json({ 
        error: `FMP a répondu avec le statut ${response.status}`,
        details: errorText.substring(0, 200),
        data: [] 
      });
    }

    const data = await response.json();

    // La réponse est un tableau d'événements
    let events = data || [];

    // Filtre par pays si nécessaire (FMP a un champ 'country' en majuscules)
    if (country && country !== 'all') {
      events = events.filter(event => event.country === country.toUpperCase());
    }

    // Transformation au format attendu par le frontend
    const transformedEvents = events.map(event => ({
      id: event.eventId || Math.random(),
      country: event.country,
      date: event.date.split('T')[0],
      time: event.time ? event.time.substring(0,5) : '--:--',
      title: event.event || event.description || 'Événement économique',
      importance: event.impact === 'High' ? 3 : event.impact === 'Medium' ? 2 : 1,
      forecast: event.forecast || '-',
      previous: event.previous || '-',
      actual: event.actual || '-',
      currency: event.currency || ''
    }));

    cache[cacheKey] = { data: transformedEvents, timestamp: Date.now() };
    res.json(transformedEvents);
  } catch (error) {
    console.error('❌ Erreur proxy FMP:', error);
    res.json({ error: error.message, data: [] });
  }
});

module.exports = router;