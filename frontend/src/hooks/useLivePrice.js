import { useState, useEffect } from 'react';
import { priceApi } from '../services/priceApi';

export function useLivePrice(symbol = 'BTCUSDT', interval = 10000) {
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrice = async () => {
    try {
      setLoading(true);
      const newPrice = await priceApi.getPrice(symbol);
      setPrice(newPrice);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching live price:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrice();
    
    // Mettre à jour périodiquement
    const intervalId = setInterval(fetchPrice, interval);
    
    return () => clearInterval(intervalId);
  }, [symbol, interval]);

  return { price, loading, error, refresh: fetchPrice };
}