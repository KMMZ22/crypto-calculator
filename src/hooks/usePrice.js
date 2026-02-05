import { useState, useEffect, useCallback } from 'react';
import { priceApi } from '../services/priceApi';

export const usePrice = (symbol = 'BTCUSDT', autoRefresh = true) => {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [source, setSource] = useState('cache');

  const fetchPrice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newPrice = await priceApi.getPrice(symbol);
      setPrice(newPrice);
      
      // Vérifier la source (pour le debug)
      const cacheKey = `price_${symbol}`;
      const cached = priceApi.cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < 1000) {
        setSource('cache');
      } else {
        setSource('api');
      }
      
    } catch (err) {
      setError(err.message);
      console.error(`Error fetching ${symbol} price:`, err);
    } finally {
      setLoading(false);
    }
  }, [symbol]);

  useEffect(() => {
    if (!symbol) return;
    
    fetchPrice();
    
    if (autoRefresh) {
      const interval = setInterval(fetchPrice, 15000); // 15 secondes
      return () => clearInterval(interval);
    }
  }, [symbol, autoRefresh, fetchPrice]);

  return { price, loading, error, source, refresh: fetchPrice };
};

export const useMultiplePrices = (symbols, autoRefresh = true) => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrices = useCallback(async () => {
    try {
      setLoading(true);
      const newPrices = await priceApi.getMultiplePrices(symbols);
      setPrices(newPrices);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching multiple prices:', err);
    } finally {
      setLoading(false);
    }
  }, [symbols]);

  useEffect(() => {
    if (!symbols || symbols.length === 0) return;
    
    fetchPrices();
    
    if (autoRefresh) {
      const interval = setInterval(fetchPrices, 15000);
      return () => clearInterval(interval);
    }
  }, [JSON.stringify(symbols), autoRefresh, fetchPrices]);

  return { prices, loading, error, refresh: fetchPrices };
};

// Hook pour vérifier le backend
export const useBackendStatus = () => {
  const [status, setStatus] = useState({ available: false, checking: true });

  const checkBackend = useCallback(async () => {
    setStatus(prev => ({ ...prev, checking: true }));
    
    try {
      const isAvailable = await priceApi.checkBackend();
      setStatus({ 
        available: isAvailable, 
        checking: false,
        lastChecked: new Date().toISOString()
      });
    } catch {
      setStatus({ 
        available: false, 
        checking: false,
        lastChecked: new Date().toISOString()
      });
    }
  }, []);

  useEffect(() => {
    checkBackend();
    const interval = setInterval(checkBackend, 60000); // Vérifier toutes les minutes
    return () => clearInterval(interval);
  }, [checkBackend]);

  return { ...status, refresh: checkBackend };
};