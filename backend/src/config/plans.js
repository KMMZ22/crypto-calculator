const PLANS_CONFIG = {
    FREE: {
      name: 'FREE',
      price: 0,
      credits: 10,
      dailyLimit: 5,
      features: {
        positionCalculator: true,
        basicPnl: true,
        dcaCalculator: true,
        realTimePrices: false,
        economicCalendar: false,
        advancedCalculations: false,
        apiAccess: false,
        prioritySupport: false,
        customIndicators: false,
        portfolioTracking: false,
        riskManagement: false
      }
    },
    
    PRO: {
      name: 'PRO',
      price: {
        monthly: 19,
        yearly: 199
      },
      credits: 'unlimited',
      dailyLimit: 50,
      features: {
        positionCalculator: true,
        basicPnl: true,
        dcaCalculator: true,
        realTimePrices: true,
        economicCalendar: true,
        advancedCalculations: true,
        apiAccess: false,
        prioritySupport: false,
        customIndicators: false,
        portfolioTracking: true,
        riskManagement: false
      }
    },
    
    ELITE: {
      name: 'ELITE',
      price: {
        monthly: 49,
        yearly: 499
      },
      credits: 'unlimited',
      dailyLimit: 'unlimited',
      features: {
        positionCalculator: true,
        basicPnl: true,
        dcaCalculator: true,
        realTimePrices: true,
        economicCalendar: true,
        advancedCalculations: true,
        apiAccess: true,
        prioritySupport: true,
        customIndicators: true,
        portfolioTracking: true,
        riskManagement: true
      }
    }
  };
  
  module.exports = { PLANS_CONFIG };