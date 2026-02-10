const axios = require('axios');

/**
 * Get economic calendar events from Financial Modeling Prep
 */
async function getEconomicCalendar(from, to, country = 'US') {
  try {
    const apiKey = process.env.FMP_API_KEY;
    
    if (!apiKey) {
      return getMockEconomicCalendar(from, to, country);
    }
    
    const response = await axios.get('https://financialmodelingprep.com/api/v3/economic_calendar', {
      params: {
        from: from || new Date().toISOString().split('T')[0],
        to: to || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        apikey: apiKey
      }
    });
    
    return {
      events: response.data,
      source: 'fmp',
      count: response.data.length
    };
    
  } catch (error) {
    console.error('FMP API error:', error.message);
    return getMockEconomicCalendar(from, to, country);
  }
}

/**
 * Get mock economic calendar (fallback)
 */
function getMockEconomicCalendar(from, to, country = 'US') {
  const events = [
    {
      event: 'Federal Funds Rate',
      country: 'US',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      importance: 'high',
      previous: '5.50%',
      forecast: '5.50%',
      actual: null
    },
    {
      event: 'CPI Inflation Rate',
      country: 'EU',
      date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
      importance: 'high',
      previous: '2.4%',
      forecast: '2.2%',
      actual: null
    },
    {
      event: 'Non-Farm Payrolls',
      country: 'US',
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      importance: 'high',
      previous: '199K',
      forecast: '180K',
      actual: null
    }
  ];
  
  // Filter by country if specified
  let filteredEvents = events;
  if (country !== 'all') {
    filteredEvents = events.filter(event => event.country === country.toUpperCase());
  }
  
  return {
    events: filteredEvents,
    source: 'mock',
    count: filteredEvents.length
  };
}

module.exports = {
  getEconomicCalendar,
  getMockEconomicCalendar
};