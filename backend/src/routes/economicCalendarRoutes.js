const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { checkFeatureAccess } = require('../middleware/planMiddleware');
const axios = require('axios');

// Get economic calendar events
router.get('/events', authenticate, checkFeatureAccess('economicCalendar'), async (req, res) => {
  try {
    const { from, to, country = 'US', importance = 'high' } = req.query;
    
    const startDate = from || new Date().toISOString().split('T')[0];
    const endDate = to || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    
    // Mock economic events - in production, use Financial Modeling Prep API
    const mockEvents = [
      {
        id: 'evt_001',
        country: 'US',
        event: 'Federal Funds Rate',
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        importance: 'high',
        previous: '5.50%',
        forecast: '5.50%',
        actual: null,
        impact: 'High',
        description: 'Federal Open Market Committee interest rate decision'
      },
      {
        id: 'evt_002',
        country: 'EU',
        event: 'CPI Inflation Rate',
        date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        importance: 'high',
        previous: '2.4%',
        forecast: '2.2%',
        actual: null,
        impact: 'Medium',
        description: 'Consumer Price Index year-over-year'
      },
      {
        id: 'evt_003',
        country: 'US',
        event: 'Non-Farm Payrolls',
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        importance: 'high',
        previous: '199K',
        forecast: '180K',
        actual: null,
        impact: 'High',
        description: 'Change in number of employed people'
      },
      {
        id: 'evt_004',
        country: 'JP',
        event: 'Bank of Japan Policy Rate',
        date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
        importance: 'medium',
        previous: '-0.10%',
        forecast: '-0.10%',
        actual: null,
        impact: 'Medium',
        description: 'Bank of Japan monetary policy meeting'
      }
    ];
    
    // Filter events
    let filteredEvents = mockEvents;
    
    if (country !== 'all') {
      filteredEvents = filteredEvents.filter(event => 
        event.country === country.toUpperCase()
      );
    }
    
    if (importance !== 'all') {
      filteredEvents = filteredEvents.filter(event => 
        event.importance === importance
      );
    }
    
    res.json({
      success: true,
      events: filteredEvents,
      period: {
        from: startDate,
        to: endDate
      },
      filters: {
        country,
        importance
      },
      count: filteredEvents.length,
      source: 'mock' // In production: 'fmp' or 'tradingeconomics'
    });
    
  } catch (error) {
    console.error('Economic calendar error:', error);
    res.status(500).json({
      error: 'CALENDAR_ERROR',
      message: 'Error fetching economic calendar'
    });
  }
});

// Get specific event details
router.get('/events/:id', authenticate, checkFeatureAccess('economicCalendar'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Mock event details
    const eventDetails = {
      id: id,
      country: 'US',
      event: 'Federal Funds Rate',
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      importance: 'high',
      previous: '5.50%',
      forecast: '5.50%',
      actual: null,
      impact: 'High',
      description: 'Federal Open Market Committee interest rate decision',
      fullDescription: 'The Federal Open Market Committee announces its decision on the target range for the federal funds rate. This is the primary tool the Fed uses to influence economic conditions.',
      historicalData: [
        { date: '2023-12', value: '5.50%' },
        { date: '2023-11', value: '5.50%' },
        { date: '2023-10', value: '5.50%' },
        { date: '2023-09', value: '5.50%' },
        { date: '2023-07', value: '5.25%' }
      ],
      marketExpectations: {
        hold: 92.5,
        hike25bps: 7.5,
        cut25bps: 0
      },
      relatedAssets: ['USD', 'SPY', 'TLT', 'GLD'],
      volatilityExpectation: 'High'
    };
    
    res.json({
      success: true,
      event: eventDetails,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Event details error:', error);
    res.status(500).json({
      error: 'EVENT_DETAILS_ERROR',
      message: 'Error fetching event details'
    });
  }
});

// Get crypto-specific events
router.get('/crypto-events', authenticate, checkFeatureAccess('economicCalendar'), async (req, res) => {
  try {
    const { type = 'all' } = req.query;
    
    // Mock crypto events
    const cryptoEvents = [
      {
        id: 'crypto_001',
        type: 'network',
        event: 'Bitcoin Halving',
        date: '2024-04-15T00:00:00.000Z',
        importance: 'very-high',
        description: 'Bitcoin block reward halves from 6.25 BTC to 3.125 BTC',
        impact: 'Supply reduction, historically bullish',
        countdown: Math.floor((new Date('2024-04-15').getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      },
      {
        id: 'crypto_002',
        type: 'regulatory',
        event: 'SEC ETF Decision Deadline',
        date: '2024-01-10T00:00:00.000Z',
        importance: 'high',
        description: 'SEC decision deadline for spot Bitcoin ETF applications',
        impact: 'Potential institutional adoption catalyst'
      },
      {
        id: 'crypto_003',
        type: 'upgrade',
        event: 'Ethereum Dencun Upgrade',
        date: '2024-03-13T00:00:00.000Z',
        importance: 'high',
        description: 'Proto-danksharding implementation to reduce L2 costs',
        impact: 'Lower transaction fees for Layer 2 solutions'
      },
      {
        id: 'crypto_004',
        type: 'unlock',
        event: 'Aptos Token Unlock',
        date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        importance: 'medium',
        description: '24.84M APT tokens ($150M) unlocked',
        impact: 'Potential selling pressure'
      }
    ];
    
    let filteredEvents = cryptoEvents;
    
    if (type !== 'all') {
      filteredEvents = filteredEvents.filter(event => event.type === type);
    }
    
    res.json({
      success: true,
      events: filteredEvents,
      count: filteredEvents.length,
      lastUpdated: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Crypto events error:', error);
    res.status(500).json({
      error: 'CRYPTO_EVENTS_ERROR',
      message: 'Error fetching crypto events'
    });
  }
});

module.exports = router;