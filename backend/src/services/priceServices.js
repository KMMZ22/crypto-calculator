const axios = require('axios');

/**
 * Get crypto prices from CoinGecko
 */
async function getCryptoPrices(symbols, currency = 'USD', usePremium = false) {
  try {
    const symbolList = symbols.split(',').map(s => s.trim().toLowerCase());
    
    // CoinGecko API logic removed by request.
    return getMockCryptoPrices(symbols, currency);
  } catch (error) {
    console.error('CoinGecko API error:', error.message);
    
    // Fallback to mock data
    return getMockCryptoPrices(symbols, currency);
  }
}

/**
 * Get mock crypto prices (fallback)
 */
function getMockCryptoPrices(symbols, currency = 'USD') {
  const symbolList = symbols.split(',').map(s => s.trim().toLowerCase());
  
  const mockPrices = {
    btc: {
      usd: 45000 + Math.random() * 1000,
      eur: 41000 + Math.random() * 900,
      gbp: 35000 + Math.random() * 800
    },
    eth: {
      usd: 2500 + Math.random() * 100,
      eur: 2300 + Math.random() * 90,
      gbp: 2000 + Math.random() * 80
    },
    bnb: {
      usd: 300 + Math.random() * 10,
      eur: 280 + Math.random() * 9,
      gbp: 240 + Math.random() * 8
    },
    sol: {
      usd: 100 + Math.random() * 5,
      eur: 92 + Math.random() * 4,
      gbp: 78 + Math.random() * 3
    },
    xrp: {
      usd: 0.5 + Math.random() * 0.1,
      eur: 0.46 + Math.random() * 0.09,
      gbp: 0.39 + Math.random() * 0.08
    }
  };
  
  const result = {};
  symbolList.forEach(symbol => {
    if (mockPrices[symbol]) {
      const price = mockPrices[symbol][currency.toLowerCase()] || mockPrices[symbol].usd;
      result[symbol] = {
        [currency.toLowerCase()]: price,
        source: 'mock',
        isRealTime: false
      };
    }
  });
  
  return {
    data: result,
    source: 'mock',
    isRealTime: false
  };
}

module.exports = {
  getCryptoPrices,
  getMockCryptoPrices
};