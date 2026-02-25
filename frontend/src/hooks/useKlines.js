// src/hooks/useKlines.js
// Fetch OHLCV klines depuis l'API publique Binance (pas de clé requise)
import { useState, useEffect, useRef } from 'react';

// Mapping timeframe UI → Binance interval
const INTERVAL_MAP = {
    '1H': '1h',
    '4H': '4h',
    '1D': '1d',
    '1W': '1w',
    '1M': '1M',
};

// Nombre de bougies à récupérer par timeframe
const LIMIT_MAP = {
    '1H': 120,
    '4H': 120,
    '1D': 200,
    '1W': 100,
    '1M': 60,
};

/**
 * @param {string} symbol  ex: 'BTCUSDT'
 * @param {string} timeframe  ex: '1D'
 */
export function useKlines(symbol = 'BTCUSDT', timeframe = '1D') {
    const [candles, setCandles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const abortRef = useRef(null);

    useEffect(() => {
        // Annuler la requête précédente si elle est encore en cours
        if (abortRef.current) abortRef.current.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        const fetchKlines = async () => {
            setLoading(true);
            setError(null);
            try {
                const interval = INTERVAL_MAP[timeframe] || '1d';
                const limit = LIMIT_MAP[timeframe] || 200;
                const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&limit=${limit}`;

                const res = await fetch(url, { signal: controller.signal });
                if (!res.ok) throw new Error(`Binance ${res.status}`);
                const raw = await res.json();

                // Format lightweight-charts : { time (Unix s), open, high, low, close, value (volume) }
                const formatted = raw.map(k => ({
                    time: Math.floor(k[0] / 1000),
                    open: parseFloat(k[1]),
                    high: parseFloat(k[2]),
                    low: parseFloat(k[3]),
                    close: parseFloat(k[4]),
                    volume: parseFloat(k[5]),
                }));

                setCandles(formatted);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('❌ useKlines error:', err);
                    setError(err.message);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        };

        fetchKlines();
        return () => controller.abort();
    }, [symbol, timeframe]);

    return { candles, loading, error };
}
