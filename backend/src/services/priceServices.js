import ccxt from 'ccxt';
import NodeCache from 'node-cache';

// Cache pour performance
const cache = new NodeCache({ stdTTL: 10, checkperiod: 120 });

class AdvancedPriceService {
    constructor() {
        this.exchanges = {};
        this.initExchanges();
    }

    initExchanges() {
        try {
            // Binance avec credentials optionnels
            this.exchanges.binance = new ccxt.binance({
                apiKey: process.env.BINANCE_API_KEY || '',
                secret: process.env.BINANCE_API_SECRET || '',
                enableRateLimit: true,
                timeout: 10000,
                options: {
                    defaultType: 'spot',
                    adjustForTimeDifference: true
                }
            });
            console.log('✅ Binance API initialisée');
        } catch (error) {
            console.warn('⚠️ Binance init warning:', error.message);
        }

        try {
            // Bybit
            this.exchanges.bybit = new ccxt.bybit({
                apiKey: process.env.BYBIT_API_KEY || '',
                secret: process.env.BYBIT_API_SECRET || '',
                enableRateLimit: true,
                timeout: 10000
            });
            console.log('✅ Bybit API initialisée');
        } catch (error) {
            console.warn('⚠️ Bybit init warning:', error.message);
        }
    }

    /**
     * Récupère le prix d'un symbole avec fallback
     */
    async getPrice(symbol, exchangePreference = 'binance') {
        const cacheKey = `price:${symbol}:${exchangePreference}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            let price = null;
            let source = '';

            // Essayer l'échange préféré d'abord
            if (this.exchanges[exchangePreference]) {
                try {
                    const ticker = await this.exchanges[exchangePreference].fetchTicker(symbol);
                    price = ticker.last;
                    source = exchangePreference;
                    console.log(`💰 ${symbol}: $${price} (${source})`);
                } catch (error) {
                    console.warn(`${exchangePreference} failed for ${symbol}:`, error.message);
                }
            }

            // Fallback vers d'autres exchanges
            if (!price) {
                const otherExchanges = Object.keys(this.exchanges).filter(e => e !== exchangePreference);
                for (const exchange of otherExchanges) {
                    try {
                        const ticker = await this.exchanges[exchange].fetchTicker(symbol);
                        price = ticker.last;
                        source = exchange;
                        console.log(`🔄 ${symbol} from ${exchange} fallback: $${price}`);
                        break;
                    } catch (error) {
                        continue;
                    }
                }
            }

            // Si tous les exchanges échouent, utiliser des APIs publiques
            if (!price) {
                price = await this.fetchFromPublicAPI(symbol);
                source = 'public';
            }

            if (price) {
                const result = { price, source, symbol, timestamp: new Date().toISOString() };
                cache.set(cacheKey, result);
                return result;
            }

            throw new Error(`Could not fetch price for ${symbol}`);

        } catch (error) {
            console.error(`❌ Price fetch error for ${symbol}:`, error.message);
            
            // Fallback mock
            const mockPrice = this.getMockPrice(symbol);
            return {
                price: mockPrice,
                source: 'mock',
                symbol,
                timestamp: new Date().toISOString(),
                isMock: true
            };
        }
    }

    /**
     * APIs publiques sans clé (fallback)
     */
    async fetchFromPublicAPI(symbol) {
        try {
            // Binance public API (no key needed)
            const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`, {
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                return parseFloat(data.price);
            }
        } catch (error) {
            console.log('Binance public API failed, trying Bybit...');
        }

        try {
            // Bybit public API
            const formattedSymbol = symbol.replace('USDT', 'USD');
            const response = await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${formattedSymbol}`, {
                timeout: 5000
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.result && data.result[0]) {
                    return parseFloat(data.result[0].last_price);
                }
            }
        } catch (error) {
            console.log('Bybit public API failed');
        }

        return null;
    }

    /**
     * Récupère plusieurs prix en batch
     */
    async getMultiplePrices(symbols) {
        const results = {};
        const promises = symbols.map(async (symbol) => {
            try {
                const priceData = await this.getPrice(symbol);
                results[symbol] = priceData;
            } catch (error) {
                results[symbol] = {
                    price: this.getMockPrice(symbol),
                    source: 'error',
                    symbol,
                    error: error.message
                };
            }
        });

        await Promise.all(promises);
        return results;
    }

    /**
     * Récupère le order book
     */
    async getOrderBook(symbol, limit = 20) {
        const cacheKey = `orderbook:${symbol}:${limit}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            let orderBook = null;
            
            // Essayer Binance d'abord
            if (this.exchanges.binance) {
                orderBook = await this.exchanges.binance.fetchOrderBook(symbol, limit);
            }
            
            if (!orderBook && this.exchanges.bybit) {
                orderBook = await this.exchanges.bybit.fetchOrderBook(symbol, limit);
            }

            if (orderBook) {
                cache.set(cacheKey, orderBook, 5); // Cache court pour order book
                return orderBook;
            }
        } catch (error) {
            console.error(`Order book error for ${symbol}:`, error.message);
        }

        return null;
    }

    /**
     * Récupère les 24h stats
     */
    async get24hStats(symbol) {
        const cacheKey = `24hstats:${symbol}`;
        const cached = cache.get(cacheKey);
        if (cached) return cached;

        try {
            let stats = null;
            
            if (this.exchanges.binance) {
                const ticker = await this.exchanges.binance.fetchTicker(symbol);
                stats = {
                    high: ticker.high,
                    low: ticker.low,
                    volume: ticker.quoteVolume,
                    change: ticker.percentage,
                    changeAmount: ticker.change
                };
            }

            if (stats) {
                cache.set(cacheKey, stats, 30); // 30 secondes cache
                return stats;
            }
        } catch (error) {
            console.error(`24h stats error for ${symbol}:`, error.message);
        }

        return null;
    }

    /**
     * Liste des symboles supportés
     */
    async getAvailableSymbols(exchange = 'binance') {
        if (this.exchanges[exchange]) {
            try {
                await this.exchanges[exchange].loadMarkets();
                const symbols = Object.keys(this.exchanges[exchange].markets)
                    .filter(s => s.includes('USDT'))
                    .slice(0, 50); // Limiter à 50
                return symbols;
            } catch (error) {
                console.error(`Error loading markets for ${exchange}:`, error.message);
            }
        }
        
        // Fallback
        return [
            'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
            'ADAUSDT', 'DOGEUSDT', 'DOTUSDT', 'MATICUSDT', 'AVAXUSDT'
        ];
    }

    /**
     * Prix mock pour développement
     */
    getMockPrice(symbol) {
        const basePrices = {
            'BTCUSDT': 45000,
            'ETHUSDT': 2500,
            'BNBUSDT': 300,
            'SOLUSDT': 100,
            'XRPUSDT': 0.5,
            'ADAUSDT': 0.4,
            'DOGEUSDT': 0.08,
            'DOTUSDT': 7,
            'MATICUSDT': 0.8,
            'AVAXUSDT': 35
        };
        
        const base = basePrices[symbol] || 100;
        // Ajouter un peu de variation réaliste
        const variation = (Math.random() * 0.02) - 0.01; // ±1%
        return base * (1 + variation);
    }

    /**
     * Vider le cache
     */
    clearCache() {
        cache.flushAll();
        console.log('🧹 Cache cleared');
    }
}

export default new AdvancedPriceService();