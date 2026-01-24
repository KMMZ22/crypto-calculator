export class PriceAPI {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 10000; // 10 secondes
  }

  async getPrice(symbol = 'BTCUSDT') {
    const cacheKey = `price_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    // Retourner le cache si valide
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.price;
    }

    try {
      // Essayer différentes APIs en cascade
      const price = await this.fetchFromBinance(symbol) || 
                    await this.fetchFromBybit(symbol) || 
                    await this.fetchFromCoinGecko(symbol);
      
      if (price) {
        this.cache.set(cacheKey, { price, timestamp: Date.now() });
        return price;
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }

    // Fallback à une valeur mockée si les APIs échouent
    const mockPrices = {
      'BTCUSDT': 50000 + (Math.random() * 1000 - 500),
      'ETHUSDT': 2500 + (Math.random() * 100 - 50),
      'SOLUSDT': 100 + (Math.random() * 10 - 5),
      'ADAUSDT': 0.5 + (Math.random() * 0.1 - 0.05),
      'XRPUSDT': 0.6 + (Math.random() * 0.05 - 0.025),
    };
    
    const fallbackPrice = mockPrices[symbol] || 50000;
    this.cache.set(cacheKey, { price: fallbackPrice, timestamp: Date.now() });
    return fallbackPrice;
  }

  async fetchFromBinance(symbol) {
    try {
      // Binance public API (pas besoin de clé)
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      if (response.ok) {
        const data = await response.json();
        return parseFloat(data.price);
      }
    } catch (error) {
      // Silently fail, try next API
    }
    return null;
  }

  async fetchFromBybit(symbol) {
    try {
      // Bybit public API
      const formattedSymbol = symbol.replace('USDT', 'USDT');
      const response = await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${formattedSymbol}`);
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result[0]) {
          return parseFloat(data.result[0].last_price);
        }
      }
    } catch (error) {
      // Silently fail, try next API
    }
    return null;
  }

  async fetchFromCoinGecko(symbol) {
    try {
      // CoinGecko nécessite un mapping symbol -> coin ID
      const coinMap = {
        'BTCUSDT': 'bitcoin',
        'ETHUSDT': 'ethereum',
        'SOLUSDT': 'solana',
        'ADAUSDT': 'cardano',
        'XRPUSDT': 'ripple',
      };
      
      const coinId = coinMap[symbol];
      if (coinId) {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`
        );
        if (response.ok) {
          const data = await response.json();
          return data[coinId]?.usd || null;
        }
      }
    } catch (error) {
      // Silently fail
    }
    return null;
  }

  // Récupérer plusieurs prix en même temps
  async getMultiplePrices(symbols) {
    const promises = symbols.map(symbol => this.getPrice(symbol));
    const results = await Promise.allSettled(promises);
    
    return results.reduce((acc, result, index) => {
      if (result.status === 'fulfilled') {
        acc[symbols[index]] = result.value;
      }
      return acc;
    }, {});
  }
}

// Instance singleton
export const priceApi = new PriceAPI();