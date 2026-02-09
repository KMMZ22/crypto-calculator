import axios from 'axios';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 60 }); // Cache de 60 secondes

class PriceService {
    async getCurrentPrice(symbol) {
        try {
            const cacheKey = `price_${symbol}`;
            const cached = cache.get(cacheKey);
            
            if (cached) {
                return cached;
            }
            
            const response = await axios.get('https://api.binance.com/api/v3/ticker/price', {
                params: { symbol: symbol.toUpperCase() }
            });
            
            const result = {
                success: true,
                symbol: response.data.symbol,
                price: parseFloat(response.data.price),
                timestamp: new Date().toISOString()
            };
            
            cache.set(cacheKey, result);
            return result;
            
        } catch (error) {
            console.error('Price service error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
}

export default new PriceService();