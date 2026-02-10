import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyzeTrade, getMarketConditions, getTradeHistory } from '../services/aiAdvisorService';
import { supabase } from '../lib/supabase';
import RiskScoreGauge from '../components/ai/RiskScoreGauge';
import SetupAnalysis from '../components/ai/SetupAnalysis';
import TradeHistory from '../components/ai/TradeHistory';
import MarketConditions from '../components/ai/MarketConditions';
import ElitePlanGuard from '../components/ElitePlanGuard';

const AIAdvisor = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [formData, setFormData] = useState({
    symbol: 'BTCUSDT',
    entryPrice: '',
    stopLoss: '',
    takeProfit: '',
    positionSize: '',
    riskCapital: '',
    timeframe: '1h',
    strategy: 'swing'
  });

  useEffect(() => {
    loadUserHistory();
    loadMarketData();
  }, [user]);

  const loadUserHistory = async () => {
    if (!user) return;
    const history = await getTradeHistory(user.id);
    setUserHistory(history);
  };

  const loadMarketData = async () => {
    const data = await getMarketConditions('BTCUSDT');
    setMarketData(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const result = await analyzeTrade(user.id, formData);
      setAnalysis(result);
      
      // Log l'analyse dans Supabase
      await supabase.from('ai_analyses').insert({
        user_id: user.id,
        symbol: formData.symbol,
        risk_reward_ratio: result.riskRewardRatio,
        confidence_score: result.confidenceScore,
        recommendation: result.recommendation.status,
        metadata: {
          entry_price: formData.entryPrice,
          stop_loss: formData.stopLoss,
          take_profit: formData.takeProfit,
          analysis_details: result
        }
      });

    } catch (error) {
      console.error('Erreur analyse:', error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <ElitePlanGuard>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-950 text-white p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
              🤖 AI Trading Advisor
            </h1>
            <p className="text-gray-400 mt-2">
              Votre mentor virtuel 24/7 - Analysez vos setups avec intelligence artificielle
            </p>
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-300">
              <div className="px-3 py-1 bg-gradient-to-r from-purple-900/50 to-purple-700/30 rounded-full border border-purple-500/30">
                ⭐ Exclusif Plan ELITE
              </div>
              <div className="px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700">
                🎯 50 analyses/mois
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche - Formulaire */}
            <div className="lg:col-span-2 space-y-6">
              {/* Carte formulaire */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-semibold mb-6">📊 Analyse de Setup Trading</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Paire de trading</label>
                      <select 
                        name="symbol"
                        value={formData.symbol}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="BTCUSDT">BTC/USDT</option>
                        <option value="ETHUSDT">ETH/USDT</option>
                        <option value="SOLUSDT">SOL/USDT</option>
                        <option value="ADAUSDT">ADA/USDT</option>
                        <option value="DOTUSDT">DOT/USDT</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Timeframe</label>
                      <select 
                        name="timeframe"
                        value={formData.timeframe}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="15m">15m (Scalping)</option>
                        <option value="1h">1h (Day Trading)</option>
                        <option value="4h">4h (Swing Trading)</option>
                        <option value="1d">1d (Position Trading)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Prix d'entrée ($)</label>
                      <input
                        type="number"
                        name="entryPrice"
                        value={formData.entryPrice}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="42000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Stop-Loss ($)</label>
                      <input
                        type="number"
                        name="stopLoss"
                        value={formData.stopLoss}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="41000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Take-Profit ($)</label>
                      <input
                        type="number"
                        name="takeProfit"
                        value={formData.takeProfit}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="44000"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">Capital à risquer ($)</label>
                      <input
                        type="number"
                        name="riskCapital"
                        value={formData.riskCapital}
                        onChange={handleInputChange}
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="1000"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Stratégie</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {['scalp', 'day', 'swing', 'position'].map((strat) => (
                        <button
                          key={strat}
                          type="button"
                          onClick={() => setFormData({...formData, strategy: strat})}
                          className={`py-2 rounded-lg transition-all ${formData.strategy === strat 
                            ? 'bg-gradient-to-r from-purple-600 to-cyan-500' 
                            : 'bg-gray-800 hover:bg-gray-700'}`}
                        >
                          {strat.charAt(0).toUpperCase() + strat.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-3"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Analyse en cours...
                      </>
                    ) : (
                      <>
                        <span className="text-xl">🧠</span>
                        Analyser le Setup avec l'IA
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Résultats de l'analyse */}
              {analysis && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                  <h2 className="text-xl font-semibold mb-6">📈 Résultats de l'Analyse</h2>
                  <SetupAnalysis analysis={analysis} />
                </div>
              )}

              {/* Historique des analyses */}
              {userHistory.length > 0 && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                  <h2 className="text-xl font-semibold mb-6">📋 Historique de vos Analyses</h2>
                  <TradeHistory history={userHistory} />
                </div>
              )}
            </div>

            {/* Colonne droite - Dashboard */}
            <div className="space-y-6">
              {/* Score de confiance */}
              {analysis && (
                <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                  <h2 className="text-xl font-semibold mb-6">🎯 Score de Confiance</h2>
                  <RiskScoreGauge score={analysis.confidenceScore} />
                </div>
              )}

              {/* Conditions marché */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-semibold mb-6">🌡️ Conditions du Marché</h2>
                {marketData ? (
                  <MarketConditions data={marketData} />
                ) : (
                  <div className="animate-pulse">Chargement des données marché...</div>
                )}
              </div>

              {/* Règles métier */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6">
                <h2 className="text-xl font-semibold mb-4">📚 Règles de l'AI Advisor</h2>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500"></div>
                    <span><strong>R:R ≥ 2</strong> - Setup excellent ✅</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 w-2 h-2 rounded-full bg-yellow-500"></div>
                    <span><strong>R:R ≥ 1</strong> - Acceptable, améliorer TP ⚠️</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500"></div>
                    <span><strong>R:R &lt; 1</strong> - Risqué, reconsidérer ❌</span>
                  </li>
                  <li className="flex items-start gap-2 text-xs text-gray-400 mt-4">
                    <div className="mt-1">ℹ️</div>
                    <span>L'IA analyse aussi: volatilité, volume, corrélations et votre historique</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElitePlanGuard>
  );
};

export default AIAdvisor;