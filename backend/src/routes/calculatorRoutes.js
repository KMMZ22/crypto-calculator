import express from 'express';

const router = express.Router();

// POST /api/calculate/position
router.post('/position', (req, res) => {
    try {
        const { capital, riskPercentage, entryPrice, stopLossPrice } = req.body;
        
        // Validation
        if (!capital || !riskPercentage || !entryPrice || !stopLossPrice) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: capital, riskPercentage, entryPrice, stopLossPrice'
            });
        }
        
        const cap = parseFloat(capital);
        const risk = parseFloat(riskPercentage);
        const entry = parseFloat(entryPrice);
        const stop = parseFloat(stopLossPrice);
        
        // Calculs
        const riskAmount = cap * (risk / 100);
        const priceDifference = Math.abs(entry - stop);
        const positionSize = riskAmount / priceDifference;
        const positionValue = positionSize * entry;
        const stopLossPercent = (priceDifference / entry) * 100;
        const capitalPercentage = (positionValue / cap) * 100;
        
        res.json({
            success: true,
            riskAmount: Number(riskAmount.toFixed(2)),
            positionSize: Number(positionSize.toFixed(6)),
            positionValue: Number(positionValue.toFixed(2)),
            priceDifference: Number(priceDifference.toFixed(2)),
            stopLossPercent: Number(stopLossPercent.toFixed(2)),
            capitalPercentage: Number(capitalPercentage.toFixed(2)),
            leverageRequired: Number((positionValue / cap).toFixed(2)),
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/calculate/pnl
router.post('/pnl', (req, res) => {
    try {
        const { positionSize, entryPrice, exitPrice, leverage = 1, feesPercent = 0.1 } = req.body;
        
        const posSize = parseFloat(positionSize);
        const entry = parseFloat(entryPrice);
        const exit = parseFloat(exitPrice);
        const lev = parseFloat(leverage);
        const fees = parseFloat(feesPercent);
        
        const priceChangePercent = ((exit - entry) / entry) * 100;
        const rawProfit = posSize * ((exit - entry) / entry) * lev;
        
        const entryFees = posSize * entry * (fees / 100);
        const exitFees = posSize * exit * (fees / 100);
        const totalFees = entryFees + exitFees;
        
        const netProfit = rawProfit - totalFees;
        const investment = posSize * entry;
        const roi = (netProfit / investment) * 100;
        const totalExposure = posSize * entry * lev;
        
        res.json({
            success: true,
            rawProfit: Number(rawProfit.toFixed(2)),
            totalFees: Number(totalFees.toFixed(2)),
            netProfit: Number(netProfit.toFixed(2)),
            roi: Number(roi.toFixed(2)),
            priceChangePercent: Number(priceChangePercent.toFixed(2)),
            totalExposure: Number(totalExposure.toFixed(2)),
            investment: Number(investment.toFixed(2)),
            isProfitable: netProfit > 0,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

// POST /api/calculate/dca
router.post('/dca', (req, res) => {
    try {
        const { investments, prices } = req.body;
        
        if (!Array.isArray(investments) || !Array.isArray(prices) || investments.length !== prices.length) {
            return res.status(400).json({
                success: false,
                error: 'Investments and prices arrays are required and must be same length'
            });
        }
        
        let totalAmount = 0;
        let totalUnits = 0;
        
        investments.forEach((investment, index) => {
            totalAmount += parseFloat(investment);
            totalUnits += parseFloat(investment) / parseFloat(prices[index]);
        });
        
        const averagePrice = totalAmount / totalUnits;
        const currentPrice = parseFloat(prices[prices.length - 1]);
        const profitLossPercent = ((currentPrice - averagePrice) / averagePrice) * 100;
        const currentValue = totalUnits * currentPrice;
        
        res.json({
            success: true,
            totalAmount: Number(totalAmount.toFixed(2)),
            totalUnits: Number(totalUnits.toFixed(6)),
            averagePrice: Number(averagePrice.toFixed(2)),
            currentPrice: Number(currentPrice.toFixed(2)),
            profitLossPercent: Number(profitLossPercent.toFixed(2)),
            currentValue: Number(currentValue.toFixed(2)),
            isProfitable: currentValue > totalAmount,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

export default router;