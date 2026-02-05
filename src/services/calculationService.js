export class CalculationService {
  constructor() {
    this.backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';
  }

  // Calcul de position size
  async calculatePosition(params) {
    try {
      // Essayer le backend d'abord
      const backendResult = await this.calculatePositionBackend(params);
      if (backendResult) {
        return { ...backendResult, source: 'backend' };
      }
    } catch (error) {
      console.log('Backend calculation failed, using frontend fallback');
    }

    // Fallback frontend
    return { 
      ...this.calculatePositionFrontend(params), 
      source: 'frontend' 
    };
  }

  async calculatePositionBackend({ capital, riskPercentage, entryPrice, stopLossPrice }) {
    try {
      const response = await fetch(`${this.backendUrl}/calculate/position`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ capital, riskPercentage, entryPrice, stopLossPrice })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          return data;
        }
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  calculatePositionFrontend({ capital, riskPercentage, entryPrice, stopLossPrice }) {
    const riskAmount = capital * (riskPercentage / 100);
    const priceDifference = Math.abs(entryPrice - stopLossPrice);
    const positionSize = riskAmount / priceDifference;

    return {
      success: true,
      riskAmount: Number(riskAmount.toFixed(2)),
      positionSize: Number(positionSize.toFixed(6)),
      positionValue: Number((positionSize * entryPrice).toFixed(2)),
      priceDifference: Number(priceDifference.toFixed(2)),
      stopLossPercent: Number((priceDifference / entryPrice * 100).toFixed(2))
    };
  }

  // Calcul P&L (frontend seulement pour l'instant)
  calculatePnL({ positionSize, entryPrice, exitPrice, leverage = 1, feesPercent = 0.1 }) {
    const priceDifference = exitPrice - entryPrice;
    const priceChangePercent = (priceDifference / entryPrice) * 100;
    
    // Profit brut
    const rawProfit = positionSize * (priceDifference / entryPrice) * leverage;
    
    // Frais
    const entryFees = positionSize * entryPrice * (feesPercent / 100);
    const exitFees = (positionSize * exitPrice) * (feesPercent / 100);
    const totalFees = entryFees + exitFees;
    
    // Profit net
    const netProfit = rawProfit - totalFees;
    
    // ROI
    const investment = positionSize * entryPrice;
    const roi = (netProfit / investment) * 100;
    
    // Exposition
    const totalExposure = positionSize * entryPrice * leverage;
    
    return {
      success: true,
      rawProfit: Number(rawProfit.toFixed(2)),
      totalFees: Number(totalFees.toFixed(2)),
      netProfit: Number(netProfit.toFixed(2)),
      roi: Number(roi.toFixed(2)),
      priceChangePercent: Number(priceChangePercent.toFixed(2)),
      totalExposure: Number(totalExposure.toFixed(2)),
      investment: Number(investment.toFixed(2)),
      isProfitable: netProfit > 0
    };
  }

  // Calcul DCA (Dollar Cost Averaging)
  calculateDCA(investments, prices) {
    let totalAmount = 0;
    let totalUnits = 0;
    
    investments.forEach((investment, index) => {
      totalAmount += investment;
      totalUnits += investment / prices[index];
    });
    
    const averagePrice = totalAmount / totalUnits;
    const currentPrice = prices[prices.length - 1];
    const profitLossPercent = ((currentPrice - averagePrice) / averagePrice) * 100;
    
    return {
      totalAmount: Number(totalAmount.toFixed(2)),
      totalUnits: Number(totalUnits.toFixed(6)),
      averagePrice: Number(averagePrice.toFixed(2)),
      currentPrice: Number(currentPrice.toFixed(2)),
      profitLossPercent: Number(profitLossPercent.toFixed(2)),
      currentValue: Number((totalUnits * currentPrice).toFixed(2))
    };
  }
}

// Instance singleton
export const calculationService = new CalculationService();