import express from 'express';

const router = express.Router();

// GET /api/price/:symbol
router.get('/:symbol', async (req, res) => {
    try {
        const { symbol } = req.params;
        const upperSymbol = symbol.toUpperCase();
        
        // 1. Essayer Binance
        try {
            const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${upperSymbol}`);
            if (response.ok) {
                const data = await response.json();
                return res.json({
                    success: true,
                    symbol: upperSymbol,
                    price: parseFloat(data.price),
                    source: 'binance',
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.log('Binance failed, trying Bybit...');
        }
        
        // 2. Essayer Bybit
        try {
            const bybitSymbol = upperSymbol.replace('USDT', 'USD');
            const response = await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${bybitSymbol}`);
            if (response.ok) {
                const data = await response.json();
                if (data.result && data.result[0]) {
                    return res.json({
                        success: true,
                        symbol: upperSymbol,
                        price: parseFloat(data.result[0].last_price),
                        source: 'bybit',
                        timestamp: new Date().toISOString()
                    });
                }
            }
        } catch (error) {
            console.log('Bybit failed, using fallback...');
        }
        
        // 3. Fallback mock
        const mockPrices = {
            'BTCUSDT': 45000,
            'ETHUSDT': 2500,
            'SOLUSDT': 100,
            'BNBUSDT': 300,
            'XRPUSDT': 0.6,
            'ADAUSDT': 0.4
        };
        
        res.json({
            success: true,
            symbol: upperSymbol,
            price: mockPrices[upperSymbol] || 100,
            source: 'mock',
            timestamp: new Date().toISOString(),
            isMock: true
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/price/batch
router.post('/batch', async (req, res) => {
    try {
        const { symbols } = req.body;
        
        if (!symbols || !Array.isArray(symbols)) {
            return res.status(400).json({
                success: false,
                error: 'Symbols array is required'
            });
        }
        
        const prices = {};
        const limitedSymbols = symbols.slice(0, 5); // Limite à 5 pour la démo
        
        for (const symbol of limitedSymbols) {
            try {
                const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`);
                if (response.ok) {
                    const data = await response.json();
                    prices[symbol] = parseFloat(data.price);
                }
            } catch {
                const mockPrices = {
                    'BTCUSDT': 45000,
                    'ETHUSDT': 2500,
                    'SOLUSDT': 100
                };
                prices[symbol] = mockPrices[symbol] || 100;
            }
        }
        
        res.json({
            success: true,
            prices,
            count: Object.keys(prices).length,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;