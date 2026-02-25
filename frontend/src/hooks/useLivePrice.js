// src/hooks/useLivePrice.js
import { useState, useEffect, useRef } from 'react';

// URL de base de votre backend (proxy)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002';

export function useLivePrice(symbol = 'BTCUSDT', interval = 60000) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const cacheRef = useRef({ symbol: null, price: null, timestamp: 0 });

  const fetchPrice = async (force = false) => {
    const now = Date.now();

    // Utilisation du cache si valide et non forcé
    if (!force && cacheRef.current.symbol === symbol && cacheRef.current.timestamp + 60000 > now) {
      setPrice(cacheRef.current.price);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let newPrice = null;
      let source = '';

      // --- Binance pour les cryptos (paires USDT) ---
      if (symbol.endsWith('USDT')) {
        try {
          const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
          if (response.ok) {
            const data = await response.json();
            newPrice = parseFloat(data.price);
            source = 'Binance';
          } else {
            console.warn(`Binance returned ${response.status} for ${symbol}`);
          }
        } catch (e) {
          console.warn('Binance fetch error:', e);
        }
      } else {
        // --- Actions et Forex via Twelve Data (proxy backend) ---
        try {
          const url = `${API_BASE_URL}/api/price-proxy/price?symbol=${symbol}`;
          const response = await fetch(url);
          const data = await response.json();
          
          if (data.price) {
            newPrice = parseFloat(data.price);
            source = 'TwelveData';
          } else if (data.error) {
            throw new Error(data.error);
          } else {
            // Si la réponse ne contient pas de prix, on considère que l'actif n'est pas supporté
            console.warn(`Aucun prix trouvé pour ${symbol} via TwelveData`);
          }
        } catch (e) {
          console.warn('TwelveData error:', e);
          setError(e.message);
        }
      }

      // Mise à jour du cache et de l'état si un prix a été obtenu
      if (newPrice !== null) {
        cacheRef.current = { symbol, price: newPrice, timestamp: now };
        setPrice(newPrice);
        console.log(`✅ Prix via ${source}:`, newPrice);
      } else {
        // Si aucun prix n'a été obtenu, on garde l'état à null
        setPrice(null);
      }
    } catch (err) {
      setError(err.message);
      console.error('❌ Erreur dans fetchPrice:', err);
    } finally {
      setLoading(false);
    }
  };

  // Effet pour récupérer le prix initial et lancer l'intervalle
  useEffect(() => {
    // Si le symbole change, on invalide le cache
    if (cacheRef.current.symbol !== symbol) {
      cacheRef.current = { symbol: null, price: null, timestamp: 0 };
    }
    fetchPrice();
    const intervalId = setInterval(() => fetchPrice(), interval);
    return () => clearInterval(intervalId);
  }, [symbol, interval]);

  return { price, loading, error, refresh: () => fetchPrice(true) };
}