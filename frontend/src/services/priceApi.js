export class PriceAPI {
  constructor() {
    this.cache = new Map();
    this.cacheDuration = 10000; // 10 secondes
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
    this.useBackend = true; // Bascule entre backend et direct
  }

  async getPrice(symbol = 'BTCUSDT') {
    const cacheKey = `price_${symbol}`;
    const cached = this.cache.get(cacheKey);
    
    // Retourner le cache si valide
    if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
      return cached.price;
    }

    try {
      let price;
      
      // Essayer le backend d'abord
      if (this.useBackend) {
        try {
          const backendPrice = await this.fetchFromBackend(symbol);
          if (backendPrice) {
            price = backendPrice;
          }
        } catch (backendError) {
          console.log('Backend unavailable, falling back to direct APIs');
        }
      }
      
      // Si backend échoue ou désactivé, utiliser les APIs directes
      if (!price) {
        price = await this.fetchFromBinance(symbol) || 
                await this.fetchFromBybit(symbol) || 
                await this.fetchFromCoinGecko(symbol);
      }
      
      if (price) {
        this.cache.set(cacheKey, { price, timestamp: Date.now() });
        return price;
      }
    } catch (error) {
      console.error('Error fetching price:', error);
    }

    // Fallback mock
    return this.getFallbackPrice(symbol);
  }

  // NOUVELLE MÉTHODE : Récupérer via le backend
  async fetchFromBackend(symbol) {
    try {
      // Essayer Binance via backend
      const response = await fetch(`${this.backendUrl}/binance/${symbol}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data.price;
        }
      }
      
      // Si Binance échoue, essayer Bybit via backend
      const bybitResponse = await fetch(`${this.backendUrl}/bybit/${symbol}`);
      if (bybitResponse.ok) {
        const data = await bybitResponse.json();
        if (data.success) {
          return data.price;
        }
      }
      
      return null;
    } catch (error) {
      console.error('Backend fetch error:', error);
      return null;
    }
  }

  // Tes méthodes existantes (inchangées)
  async fetchFromBinance(symbol) {
    try {
      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${symbol}`);
      if (response.ok) {
        const data = await response.json();
        return parseFloat(data.price);
      }
    } catch (error) {
      // Silently fail
    }
    return null;
  }

  async fetchFromBybit(symbol) {
    try {
      // CORRECTION: Bybit format est différent
      // Pour BTCUSDT -> BTCUSD (enlève le T) pour l'API v2
      const formattedSymbol = symbol.replace('USDT', 'USD');
      const response = await fetch(`https://api.bybit.com/v2/public/tickers?symbol=${formattedSymbol}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.result && data.result[0]) {
          return parseFloat(data.result[0].last_price);
        }
      }
    } catch (error) {
      // Silently fail
    }
    return null;
  }

  async fetchFromCoinGecko(symbol) {
    try {
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

  getFallbackPrice(symbol) {
    const mockPrices = {
      'BTCUSDT': 50000 + (Math.random() * 1000 - 500),
      'ETHUSDT': 2500 + (Math.random() * 100 - 50),
      'SOLUSDT': 100 + (Math.random() * 10 - 5),
      'ADAUSDT': 0.5 + (Math.random() * 0.1 - 0.05),
      'XRPUSDT': 0.6 + (Math.random() * 0.05 - 0.025),
    };
    
    const fallbackPrice = mockPrices[symbol] || 50000;
    // CORRECTION: Utiliser la même clé de cache que getPrice
    const cacheKey = `price_${symbol}`;
    this.cache.set(cacheKey, { price: fallbackPrice, timestamp: Date.now() });
    return fallbackPrice;
  }

  // Récupérer plusieurs prix
  async getMultiplePrices(symbols) {
    const promises = symbols.map(symbol => this.getPrice(symbol));
    const results = await Promise.allSettled(promises);
    
    return results.reduce((acc, result, index) => {
      if (result.status === 'fulfilled') {
        acc[symbols[index]] = result.value;
      } else {
        // En cas d'erreur, utiliser le fallback
        acc[symbols[index]] = this.getFallbackPrice(symbols[index]);
      }
      return acc;
    }, {});
  }

  // Vérifier si le backend est disponible
  async checkBackend() {
    try {
      const response = await fetch(`${this.backendUrl}/health`);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Méthode utilitaire pour vider le cache
  clearCache() {
    this.cache.clear();
  }

  // Méthode pour désactiver/activer le backend
  setUseBackend(useBackend) {
    this.useBackend = useBackend;
  }
}

// Instance singleton
export const priceApi = new PriceAPI();
// Dans src/services/priceApi.js - AJOUTEZ ces fonctions exportées :

// Fonction pour getMarketVolatility (nécessaire pour AI Advisor)
export const getMarketVolatility = async (symbol = 'BTC/USD', timeframe = '1h') => {
  try {
    const priceApi = new PriceAPI();
    // Obtenir le prix actuel
    const currentPrice = await priceApi.getPrice(symbol.replace('/', ''));
    
    // Simulation de volatilité basée sur le timeframe
    // En production, utilisez une vraie API de volatilité
    const baseVolatility = {
      'BTC/USD': 0.045,
      'ETH/USD': 0.038,
      'SOL/USD': 0.062,
      'EUR/USD': 0.008,
      'AAPL': 0.015
    };
    
    let volatility = baseVolatility[symbol] || 0.025;
    
    // Ajuster selon le timeframe
    const timeframeMultiplier = {
      '15m': 0.5,
      '1h': 1,
      '4h': 1.5,
      '1d': 2,
      '1w': 3
    };
    
    volatility *= (timeframeMultiplier[timeframe] || 1);
    
    return {
      volatility: parseFloat(volatility.toFixed(4)),
      currentPrice: currentPrice || 0,
      timeframe,
      symbol,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting market volatility:', error);
    return {
      volatility: 0.025,
      currentPrice: 0,
      timeframe,
      symbol,
      timestamp: new Date().toISOString(),
      error: true
    };
  }
};

// Fonction pour getPriceData
export const getPriceData = async (symbol = 'BTC/USD') => {
  try {
    const priceApi = new PriceAPI();
    const formattedSymbol = symbol.replace('/', '');
    const price = await priceApi.getPrice(formattedSymbol);
    
    // Simuler un changement sur 24h
    const change24h = (Math.random() * 10 - 5) / 100; // -5% à +5%
    
    return {
      price: price || 0,
      change24h: parseFloat(change24h.toFixed(4)),
      symbol,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting price data:', error);
    return {
      price: 0,
      change24h: 0,
      symbol,
      timestamp: new Date().toISOString(),
      error: true
    };
  }
};

// Fonction pour getVolumeData
export const getVolumeData = async (symbol = 'BTC/USD') => {
  try {
    // Volumes simulés (en millions)
    const baseVolumes = {
      'BTC/USD': 25000,
      'ETH/USD': 12000,
      'SOL/USD': 3500,
      'EUR/USD': 1500000,
      'AAPL': 8500
    };
    
    const baseVolume = baseVolumes[symbol] || 1000;
    // Variation aléatoire de ±20%
    const volume = baseVolume * (0.8 + Math.random() * 0.4);
    
    return {
      volume: parseFloat(volume.toFixed(2)),
      symbol,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error getting volume data:', error);
    return {
      volume: 1000,
      symbol,
      timestamp: new Date().toISOString(),
      error: true
    };
  }
};

// Exportez aussi l'instance priceApi pour compatibilité
export const PriceApiService = new PriceAPI();

// Fonctions utilitaires supplémentaires
export const getMarketConditions = async (symbol = 'BTC/USD') => {
  const [priceData, volatilityData, volumeData] = await Promise.all([
    getPriceData(symbol),
    getMarketVolatility(symbol),
    getVolumeData(symbol)
  ]);
  
  return {
    ...priceData,
    ...volatilityData,
    ...volumeData,
    condition: volatilityData.volatility > 0.05 ? 'volatile' : 
               volatilityData.volatility < 0.01 ? 'calm' : 'normal'
  };
};

// Export par défaut pour compatibilité
export default {
  PriceAPI,
  priceApi,
  getMarketVolatility,
  getPriceData,
  getVolumeData,
  getMarketConditions
};