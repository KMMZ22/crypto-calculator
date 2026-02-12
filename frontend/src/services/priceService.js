// src/services/priceService.js
export class PriceService {
    async getCurrentPrice(symbol) {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/ticker/price?symbol=${symbol.toUpperCase()}`
        );
        
        if (!response.ok) {
          throw new Error('Erreur API Binance');
        }
        
        const data = await response.json();
        
        return {
          success: true,
          symbol: data.symbol,
          price: parseFloat(data.price),
          timestamp: new Date().toISOString()
        };
        
      } catch (error) {
        console.error('Price service error:', error);
        return {
          success: false,
          error: error.message,
          price: 0 // Valeur par défaut
        };
      }
    }
  
    // Cache simple en mémoire
    cache = new Map();
    
    async getCachedPrice(symbol, ttl = 60000) {
      const cacheKey = `price_${symbol}`;
      const cached = this.cache.get(cacheKey);
      
      if (cached && (Date.now() - cached.timestamp < ttl)) {
        return cached.data;
      }
      
      const result = await this.getCurrentPrice(symbol);
      
      if (result.success) {
        this.cache.set(cacheKey, {
          data: result,
          timestamp: Date.now()
        });
      }
      
      return result;
    }
  }
  
  export default new PriceService();