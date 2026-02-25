import { supabase } from '../lib/supabase';

class AIAdvisorService {
  constructor() {
    this.ELITE_LIMIT = 50; // Analyses par mois pour le plan ELITE
  }

  /**
   * Vérifie si l'utilisateur a des analyses disponibles
   */
  async checkUsageLimit(userId) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('ai_analyses')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', startOfMonth.toISOString());

    if (error) {
      console.error('Erreur vérification limite:', error);
      return { allowed: true, remaining: this.ELITE_LIMIT }; // Fail open
    }

    const used = data.length;
    const remaining = Math.max(0, this.ELITE_LIMIT - used);
    
    return {
      allowed: used < this.ELITE_LIMIT,
      used,
      remaining,
      limit: this.ELITE_LIMIT
    };
  }

  /**
   * Analyse complète d'un setup trading
   */
  async analyzeTrade(userId, tradeData) {
    // 1. Vérifier la limite d'usage
    const usage = await this.checkUsageLimit(userId);
    if (!usage.allowed) {
      throw new Error(`Limite atteinte: ${usage.used}/${usage.limit} analyses ce mois.`);
    }

    // 2. Calculer les métriques de base
    const entry = parseFloat(tradeData.entryPrice);
    const stopLoss = parseFloat(tradeData.stopLoss);
    const takeProfit = parseFloat(tradeData.takeProfit);
    const riskCapital = parseFloat(tradeData.riskCapital);

    // Validation des inputs
    if (entry <= 0 || stopLoss <= 0 || takeProfit <= 0 || riskCapital <= 0) {
      throw new Error('Les prix et le capital doivent être positifs');
    }

    // 3. Calcul du Risk/Reward Ratio
    const riskPerUnit = Math.abs(entry - stopLoss);
    const rewardPerUnit = Math.abs(takeProfit - entry);
    const riskRewardRatio = rewardPerUnit / riskPerUnit;

    // 4. Récupérer les données marché
    const marketConditions = await this.getMarketConditions(
      tradeData.symbol, 
      tradeData.timeframe
    );

    // 5. Récupérer l'historique utilisateur
    const userHistory = await this.getUserTradingHistory(userId, tradeData.symbol);

    // 6. Calculer le score de confiance
    const confidenceScore = this.calculateConfidenceScore({
      riskRewardRatio,
      stopLossDistance: riskPerUnit / entry * 100, // en pourcentage
      marketVolatility: marketConditions.volatility,
      marketVolume: marketConditions.volume,
      userWinRate: userHistory.winRate,
      userAvgRr: userHistory.averageRiskReward,
      timeframe: tradeData.timeframe,
      strategy: tradeData.strategy
    });

    // 7. Générer la recommandation
    const recommendation = this.generateRecommendation(riskRewardRatio, confidenceScore);

    // 8. Vérifier les alertes
    const alerts = this.checkAlerts({
      riskRewardRatio,
      confidenceScore,
      userHistory,
      marketConditions,
      symbol: tradeData.symbol
    });

    // 9. Calculer la taille de position optimale
    const optimalPositionSize = this.calculateOptimalPositionSize(
      riskCapital,
      riskPerUnit,
      entry,
      marketConditions.volatility
    );

    return {
      riskRewardRatio: parseFloat(riskRewardRatio.toFixed(2)),
      confidenceScore: Math.round(confidenceScore),
      recommendation,
      alerts,
      metrics: {
        stopLossDistancePercent: parseFloat(((riskPerUnit / entry) * 100).toFixed(2)),
        potentialProfit: parseFloat(((rewardPerUnit / entry) * 100).toFixed(2)),
        potentialLoss: parseFloat(((riskPerUnit / entry) * 100).toFixed(2)),
        optimalPositionSize,
        requiredWinRate: parseFloat(((1 / (1 + riskRewardRatio)) * 100).toFixed(1))
      },
      marketConditions,
      userHistory: {
        totalTrades: userHistory.totalTrades,
        winRate: parseFloat((userHistory.winRate * 100).toFixed(1)),
        averageRiskReward: parseFloat(userHistory.averageRiskReward.toFixed(2))
      }
    };
  }

  /**
   * Calcule le score de confiance (0-100)
   */
  calculateConfidenceScore(factors) {
    let score = 50; // Score de base

    // Facteur 1: Risk/Reward Ratio (poids: 40%)
    const rrScore = Math.min(100, factors.riskRewardRatio * 25);
    score += rrScore * 0.4;

    // Facteur 2: Distance Stop-Loss (poids: 20%)
    // Stop-Loss trop serré (<1%) = pénalité, idéal 2-5%
    let slScore = 100;
    if (factors.stopLossDistance < 1) slScore = 30;
    else if (factors.stopLossDistance > 10) slScore = 60;
    score += slScore * 0.2;

    // Facteur 3: Volatilité marché (poids: 15%)
    // Volatilité modérée = bon, trop élevée = risque
    const volScore = Math.max(0, 100 - (factors.marketVolatility * 2));
    score += volScore * 0.15;

    // Facteur 4: Historique utilisateur (poids: 15%)
    const historyScore = (factors.userWinRate * 100) * 0.5 + 
                         (Math.min(3, factors.userAvgRr) * 20);
    score += historyScore * 0.15;

    // Facteur 5: Timeframe & Stratégie (poids: 10%)
    const strategyScore = this.getStrategyScore(factors.timeframe, factors.strategy);
    score += strategyScore * 0.1;

    // Normaliser entre 0 et 100
    return Math.min(100, Math.max(0, score));
  }

  getStrategyScore(timeframe, strategy) {
    const strategyMatrix = {
      '15m': { scalp: 90, day: 60, swing: 30, position: 10 },
      '1h': { scalp: 70, day: 90, swing: 60, position: 30 },
      '4h': { scalp: 30, day: 70, swing: 90, position: 70 },
      '1d': { scalp: 10, day: 40, swing: 80, position: 90 }
    };
    return strategyMatrix[timeframe]?.[strategy] || 50;
  }

  /**
   * Génère la recommandation selon les règles métier
   */
  generateRecommendation(riskRewardRatio, confidenceScore) {
    let status, message, color;

    if (riskRewardRatio >= 2 && confidenceScore >= 70) {
      status = 'EXCELLENT';
      message = 'Setup optimal - Trade fortement recommandé';
      color = 'green';
    } else if (riskRewardRatio >= 1.5 && confidenceScore >= 60) {
      status = 'BON';
      message = 'Setup solide - Trade recommandé avec gestion rigoureuse';
      color = 'lime';
    } else if (riskRewardRatio >= 1 && confidenceScore >= 50) {
      status = 'ACCEPTABLE';
      message = 'Setup acceptable - Améliorer le Take-Profit si possible';
      color = 'yellow';
    } else if (riskRewardRatio < 1) {
      status = 'RISQUÉ';
      message = 'Risk/Reward défavorable - Reconsidérer le trade';
      color = 'red';
    } else {
      status = 'NEUTRE';
      message = 'Analyse approfondie requise - Facteurs contradictoires';
      color = 'gray';
    }

    return { status, message, color, icon: this.getRecommendationIcon(status) };
  }

  getRecommendationIcon(status) {
    const icons = {
      'EXCELLENT': '✅',
      'BON': '👍',
      'ACCEPTABLE': '⚠️',
      'RISQUÉ': '❌',
      'NEUTRE': '🔍'
    };
    return icons[status] || '❓';
  }

  /**
   * Vérifie les alertes intelligentes
   */
  checkAlerts(factors) {
    const alerts = [];

    // Alerte 1: Risk/Reward trop faible
    if (factors.riskRewardRatio < 0.8) {
      alerts.push({
        type: 'HIGH_RISK',
        message: 'Risk/Reward très faible (<0.8) - Probabilité de succès trop basse',
        severity: 'high'
      });
    }

    // Alerte 2: Confiance faible malgré bon R:R
    if (factors.riskRewardRatio > 1.5 && factors.confidenceScore < 40) {
      alerts.push({
        type: 'CONFIDENCE_MISMATCH',
        message: 'R:R bon mais faible confiance - Vérifier les conditions marché',
        severity: 'medium'
      });
    }

    // Alerte 3: Trop de trades sur le même actif (à implémenter avec historique)
    if (factors.userHistory?.recentTradesOnSymbol > 5) {
      alerts.push({
        type: 'OVER_EXPOSURE',
        message: `Sur-exposition détectée: ${factors.userHistory.recentTradesOnSymbol} trades récents sur ${factors.symbol}`,
        severity: 'medium'
      });
    }

    // Alerte 4: Volatilité excessive
    if (factors.marketConditions?.volatility > 5) {
      alerts.push({
        type: 'HIGH_VOLATILITY',
        message: 'Volatilité élevée - Stop-Loss pourrait être touché prématurément',
        severity: 'medium'
      });
    }

    return alerts;
  }

  /**
   * Calcule la taille de position optimale
   */
  calculateOptimalPositionSize(riskCapital, riskPerUnit, entryPrice, volatility) {
    // Risk % du capital (1-2% typique)
    const riskPercent = Math.min(2, Math.max(0.5, 2 - (volatility / 10)));
    const maxRiskAmount = riskCapital * (riskPercent / 100);
    
    // Taille basée sur le stop-loss
    const positionSize = maxRiskAmount / riskPerUnit;
    
    // Ajuster pour la liquidité (arrondir)
    const roundedSize = Math.floor(positionSize * 1000) / 1000;
    
    return {
      size: roundedSize,
      usdValue: parseFloat((roundedSize * entryPrice).toFixed(2)),
      riskPercent,
      maxRiskAmount: parseFloat(maxRiskAmount.toFixed(2))
    };
  }

  /**
   * Récupère les conditions du marché
   */
  async getMarketConditions(symbol, timeframe = '1h') {
    try {
      const [priceData, volatility, volume] = await Promise.all([
        getPriceData(symbol),
        getMarketVolatility(symbol, timeframe),
        getVolumeData(symbol)
      ]);

      return {
        symbol,
        currentPrice: priceData.price,
        change24h: priceData.change24h || 0,
        volatility: volatility || 2.5,
        volume: volume || 1000000,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Erreur récupération conditions marché:', error);
      // Valeurs par défaut en cas d'erreur
      return {
        symbol,
        currentPrice: 0,
        change24h: 0,
        volatility: 2.5,
        volume: 1000000,
        timestamp: new Date().toISOString(),
        error: true
      };
    }
  }

  /**
   * Récupère l'historique trading de l'utilisateur
   */
  async getUserTradingHistory(userId, symbol = null) {
    try {
      let query = supabase
        .from('trades')
        .select('*')
        .eq('user_id', userId);

      if (symbol) {
        query = query.eq('symbol', symbol);
      }

      const { data, error } = await query;

      if (error || !data || data.length === 0) {
        return {
          totalTrades: 0,
          winRate: 0.5,
          averageRiskReward: 1.2,
          recentTradesOnSymbol: 0
        };
      }

      const winningTrades = data.filter(t => t.pnl_amount > 0);
      const winRate = winningTrades.length / data.length;

      // Calculer le R:R moyen (simplifié)
      const avgRiskReward = data.reduce((acc, trade) => {
        if (trade.entry_price && trade.stop_loss && trade.take_profit) {
          const risk = Math.abs(trade.entry_price - trade.stop_loss);
          const reward = Math.abs(trade.take_profit - trade.entry_price);
          return acc + (reward / risk);
        }
        return acc;
      }, 0) / data.length;

      // Nombre de trades récents sur le même symbole (30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const recentTradesOnSymbol = symbol ? 
        data.filter(t => 
          t.symbol === symbol && 
          new Date(t.created_at) > thirtyDaysAgo
        ).length : 0;

      return {
        totalTrades: data.length,
        winRate,
        averageRiskReward: avgRiskReward || 1.2,
        recentTradesOnSymbol
      };
    } catch (error) {
      console.error('Erreur historique utilisateur:', error);
      return {
        totalTrades: 0,
        winRate: 0.5,
        averageRiskReward: 1.2,
        recentTradesOnSymbol: 0
      };
    }
  }

  /**
   * Récupère l'historique des analyses AI
   */
  async getTradeHistory(userId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('ai_analyses')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(analysis => ({
        id: analysis.id,
        symbol: analysis.symbol,
        riskRewardRatio: analysis.risk_reward_ratio,
        confidenceScore: analysis.confidence_score,
        recommendation: analysis.recommendation,
        createdAt: analysis.created_at,
        success: analysis.metadata?.success_rate || null
      }));
    } catch (error) {
      console.error('Erreur récupération historique:', error);
      return [];
    }
  }
}

// Singleton instance
export const aiAdvisorService = new AIAdvisorService();

// Fonctions exportées pour compatibilité
export const analyzeTrade = (userId, tradeData) => 
  aiAdvisorService.analyzeTrade(userId, tradeData);

export const getMarketConditions = (symbol, timeframe) => 
  aiAdvisorService.getMarketConditions(symbol, timeframe);

export const getTradeHistory = (userId, limit) => 
  aiAdvisorService.getTradeHistory(userId, limit);

export const checkUsageLimit = (userId) => 
  aiAdvisorService.checkUsageLimit(userId);