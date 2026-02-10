const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const { checkCredits, checkFeatureAccess } = require('../middleware/planMiddleware');
const { saveCalculation, getCalculationHistory } = require('../services/calculationService');

// Position sizing calculator
router.post('/position', authenticate, checkCredits, async (req, res) => {
  try {
    const { capital, riskPercentage, entryPrice, stopLossPrice, leverage = 1 } = req.body;
    
    // Validation
    if (!capital || !riskPercentage || !entryPrice || !stopLossPrice) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields: capital, riskPercentage, entryPrice, stopLossPrice'
      });
    }
    
    if (riskPercentage <= 0 || riskPercentage > 100) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Risk percentage must be between 0.01 and 100'
      });
    }
    
    // Calculations
    const riskAmount = capital * (riskPercentage / 100);
    const priceDifference = Math.abs(entryPrice - stopLossPrice);
    let positionSize = riskAmount / priceDifference;
    
    // Apply leverage
    if (leverage > 1) {
      positionSize = positionSize * leverage;
    }
    
    // Prepare result
    const result = {
      positionSize: Number(positionSize.toFixed(6)),
      riskAmount: Number(riskAmount.toFixed(2)),
      riskPercentage: Number(riskPercentage.toFixed(2)),
      leverage: leverage,
      entryPrice: Number(entryPrice.toFixed(2)),
      stopLossPrice: Number(stopLossPrice.toFixed(2)),
      capital: Number(capital.toFixed(2)),
      riskRewardRatio: 0 // Can be calculated if takeProfit is provided
    };
    
    // Save calculation
    await saveCalculation(req.user.id, 'position', req.body, result);
    
    // Response
    res.json({
      success: true,
      calculation: result,
      creditsRemaining: req.user.remainingCredits,
      dailyRemaining: req.user.dailyRemaining,
      message: 'Position sizing calculation completed'
    });
    
  } catch (error) {
    console.error('Position calculation error:', error);
    res.status(500).json({
      error: 'CALCULATION_ERROR',
      message: 'Error during position calculation'
    });
  }
});

// P&L Calculator
router.post('/pnl', authenticate, checkCredits, async (req, res) => {
  try {
    const { entryPrice, exitPrice, positionSize, feesPercentage = 0.1, isLong = true } = req.body;
    
    // Validation
    if (!entryPrice || !exitPrice || !positionSize) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields: entryPrice, exitPrice, positionSize'
      });
    }
    
    // Calculations
    const priceDifference = exitPrice - entryPrice;
    const profitLoss = isLong ? priceDifference * positionSize : -priceDifference * positionSize;
    const entryFees = (positionSize * entryPrice * feesPercentage / 100);
    const exitFees = (positionSize * exitPrice * feesPercentage / 100);
    const totalFees = entryFees + exitFees;
    const netProfitLoss = profitLoss - totalFees;
    const roiPercentage = (netProfitLoss / (positionSize * entryPrice)) * 100;
    
    const result = {
      profitLoss: Number(profitLoss.toFixed(2)),
      netProfitLoss: Number(netProfitLoss.toFixed(2)),
      fees: Number(totalFees.toFixed(2)),
      entryFees: Number(entryFees.toFixed(2)),
      exitFees: Number(exitFees.toFixed(2)),
      roiPercentage: Number(roiPercentage.toFixed(2)),
      positionSize: Number(positionSize.toFixed(6)),
      entryPrice: Number(entryPrice.toFixed(2)),
      exitPrice: Number(exitPrice.toFixed(2)),
      isLong: isLong,
      totalInvestment: Number((positionSize * entryPrice).toFixed(2))
    };
    
    // Save calculation
    await saveCalculation(req.user.id, 'pnl', req.body, result);
    
    res.json({
      success: true,
      calculation: result,
      creditsRemaining: req.user.remainingCredits,
      message: 'P&L calculation completed'
    });
    
  } catch (error) {
    console.error('PNL calculation error:', error);
    res.status(500).json({
      error: 'CALCULATION_ERROR',
      message: 'Error during P&L calculation'
    });
  }
});

// DCA Calculator
router.post('/dca', authenticate, checkCredits, async (req, res) => {
  try {
    const { totalInvestment, numberOfPurchases, priceSeries } = req.body;
    
    // Validation
    if (!totalInvestment || !numberOfPurchases || !priceSeries) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'Missing required fields: totalInvestment, numberOfPurchases, priceSeries'
      });
    }
    
    if (priceSeries.length !== numberOfPurchases) {
      return res.status(400).json({
        error: 'VALIDATION_ERROR',
        message: 'priceSeries length must match numberOfPurchases'
      });
    }
    
    // DCA Calculations
    const investmentPerPurchase = totalInvestment / numberOfPurchases;
    let totalCoins = 0;
    const purchases = [];
    
    priceSeries.forEach((price, index) => {
      const coins = investmentPerPurchase / price;
      totalCoins += coins;
      purchases.push({
        purchaseNumber: index + 1,
        price: Number(price.toFixed(2)),
        investment: Number(investmentPerPurchase.toFixed(2)),
        coins: Number(coins.toFixed(6)),
        cumulativeCoins: Number(totalCoins.toFixed(6))
      });
    });
    
    const averagePrice = totalInvestment / totalCoins;
    const finalValue = totalCoins * priceSeries[priceSeries.length - 1];
    const profitLoss = finalValue - totalInvestment;
    const roiPercentage = (profitLoss / totalInvestment) * 100;
    
    const result = {
      totalInvestment: Number(totalInvestment.toFixed(2)),
      numberOfPurchases: numberOfPurchases,
      investmentPerPurchase: Number(investmentPerPurchase.toFixed(2)),
      totalCoins: Number(totalCoins.toFixed(6)),
      averagePrice: Number(averagePrice.toFixed(2)),
      finalValue: Number(finalValue.toFixed(2)),
      profitLoss: Number(profitLoss.toFixed(2)),
      roiPercentage: Number(roiPercentage.toFixed(2)),
      purchases: purchases
    };
    
    // Save calculation
    await saveCalculation(req.user.id, 'dca', req.body, result);
    
    res.json({
      success: true,
      calculation: result,
      creditsRemaining: req.user.remainingCredits,
      message: 'DCA calculation completed'
    });
    
  } catch (error) {
    console.error('DCA calculation error:', error);
    res.status(500).json({
      error: 'CALCULATION_ERROR',
      message: 'Error during DCA calculation'
    });
  }
});

// Get calculation history
router.get('/history', authenticate, async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    
    const history = await getCalculationHistory(
      req.user.id, 
      parseInt(limit), 
      parseInt(offset)
    );
    
    res.json({
      success: true,
      history: history,
      total: history.length,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({
      error: 'HISTORY_FETCH_ERROR',
      message: 'Error fetching calculation history'
    });
  }
});

// Get calculation stats
router.get('/stats', authenticate, async (req, res) => {
  try {
    const { supabaseAdmin } = require('../config/supabase');
    
    // Total calculations
    const { count: totalCount, error: countError } = await supabaseAdmin
      .from('calculations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id);
    
    if (countError) throw countError;
    
    // Calculations by type
    const { data: byType, error: typeError } = await supabaseAdmin
      .from('calculations')
      .select('calculation_type')
      .eq('user_id', req.user.id);
    
    if (typeError) throw typeError;
    
    const typeCounts = {};
    (byType || []).forEach(calc => {
      typeCounts[calc.calculation_type] = (typeCounts[calc.calculation_type] || 0) + 1;
    });
    
    // Today's calculations
    const today = new Date().toISOString().split('T')[0];
    const { count: todayCount, error: todayError } = await supabaseAdmin
      .from('calculations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', req.user.id)
      .gte('created_at', `${today}T00:00:00.000Z`)
      .lte('created_at', `${today}T23:59:59.999Z`);
    
    if (todayError) throw todayError;
    
    res.json({
      success: true,
      stats: {
        totalCalculations: totalCount || 0,
        calculationsByType: typeCounts,
        todayCalculations: todayCount || 0,
        userPlan: req.user.subscription_plan,
        dailyLimit: req.user.subscription_plan === 'FREE' ? 5 : 
                   req.user.subscription_plan === 'PRO' ? 50 : 'unlimited'
      }
    });
    
  } catch (error) {
    console.error('Stats fetch error:', error);
    res.status(500).json({
      error: 'STATS_FETCH_ERROR',
      message: 'Error fetching calculation stats'
    });
  }
});

module.exports = router;