import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, AlertTriangle, BarChart3, ArrowLeft, Brain, Crown, Calculator as CalculatorIcon } from 'lucide-react'; // CHANGEMENT ICI
import { useNavigate } from 'react-router-dom';
import { useLivePrice } from '../hooks/useLivePrice';
import { tradeStorage } from '../utils/storage';

export default function Calculator() {
  const navigate = useNavigate();
  
  // SIMPLE: Gestion du plan utilisateur
  const [userPlan, setUserPlan] = useState('FREE'); // 'FREE', 'PRO', 'ELITE'
  
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { price: livePrice, loading: priceLoading } = useLivePrice(selectedSymbol);
  
  const [capital, setCapital] = useState(10000);
  const [riskPercent, setRiskPercent] = useState(2);
  const [entryPrice, setEntryPrice] = useState(50000);
  const [stopLoss, setStopLoss] = useState(48000);
  const [takeProfit, setTakeProfit] = useState(55000);
  const [leverage, setLeverage] = useState(1);
  const [fees, setFees] = useState(0.1);
  
  const [results, setResults] = useState(null);

  useEffect(() => {
    calculatePosition();
  }, [capital, riskPercent, entryPrice, stopLoss, takeProfit, leverage, fees]);

  const calculatePosition = () => {
    const riskAmount = (capital * riskPercent) / 100;
    const stopDistance = Math.abs(entryPrice - stopLoss);
    const stopDistancePercent = (stopDistance / entryPrice) * 100;
    const positionSizeUSD = riskAmount / (stopDistancePercent / 100);
    const positionSizeWithLeverage = positionSizeUSD * leverage;
    const quantity = positionSizeWithLeverage / entryPrice;
    const tpDistance = Math.abs(takeProfit - entryPrice);
    const tpDistancePercent = (tpDistance / entryPrice) * 100;
    const potentialProfit = (positionSizeWithLeverage * tpDistancePercent) / 100;
    const rrRatio = potentialProfit / riskAmount;
    const liquidationPrice = entryPrice * (1 - (1 / leverage) * 0.9);
    const totalFees = (positionSizeWithLeverage * fees * 2) / 100;
    const marginRequired = positionSizeWithLeverage / leverage;

    setResults({
      riskAmount,
      positionSizeUSD,
      positionSizeWithLeverage,
      quantity,
      potentialProfit,
      rrRatio,
      liquidationPrice,
      totalFees,
      marginRequired,
      stopDistancePercent,
      tpDistancePercent
    });
  };

  // Fonction pour simuler l'upgrade (dans la vraie app, ça viendrait du backend)
  const handleUpgrade = (plan) => {
    setUserPlan(plan);
    alert(`🎉 Félicitations ! Vous passez au plan ${plan}`);
    
    // Ici, en vrai, vous redirigeriez vers Stripe/le paiement
    // Pour le MVP, on simule juste
    if (plan === 'ELITE') {
      localStorage.setItem('tradeguard_user_plan', 'ELITE');
    }
  };

  // Fonction pour sauvegarder le trade
  const saveCurrentTrade = () => {
    if (!results) return;
    
    const tradeData = {
      capital,
      riskPercent,
      entryPrice,
      stopLoss,
      takeProfit,
      leverage,
      symbol: selectedSymbol,
      positionSize: results.positionSizeWithLeverage,
      profit: results.potentialProfit,
      rrRatio: results.rrRatio
    };
    
    tradeStorage.saveTrade(tradeData);
    alert('✅ Trade sauvegardé dans l\'historique !');
  };

  // Charger le plan au démarrage
  useEffect(() => {
    const savedPlan = localStorage.getItem('tradeguard_user_plan');
    if (savedPlan) {
      setUserPlan(savedPlan);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header avec bouton retour et badge plan */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-8 gap-4">
          <div>
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition mb-4"
            >
              <ArrowLeft size={20} />
              Retour à l'accueil TradeGuard
            </button>
            
            <div className="flex items-center gap-3">
              <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center gap-2">
                <TrendingUp className="text-purple-400" size={40} />
                Crypto Position Calculator
              </h1>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                userPlan === 'FREE' ? 'bg-gray-600 text-gray-300' :
                userPlan === 'PRO' ? 'bg-blue-600 text-blue-300' :
                'bg-yellow-600 text-yellow-300'
              }`}>
                {userPlan}
              </span>
            </div>
            <p className="text-purple-300">Gère ton risque comme un pro</p>
          </div>
          
          {/* Boutons Dashboard et Upgrade */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium transition flex items-center gap-2"
            >
              <BarChart3 size={18} />
              Dashboard
            </button>
            
            {userPlan !== 'ELITE' && (
              <button
                onClick={() => navigate('/#pricing')}
                className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-xl font-bold transition flex items-center gap-2"
              >
                <Crown size={20} />
                Upgrade to ELITE
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Panel de gauche - Inputs */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="text-green-400" />
              Paramètres du Trade
            </h2>

            <div className="space-y-4">
              {/* Champ Capital */}
              <div>
                <label className="block text-purple-300 mb-2 font-medium">Capital Total ($)</label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                />
              </div>

              {/* Sélecteur de crypto */}
              <div>
                <label className="block text-purple-300 mb-2 font-medium">Crypto-monnaie</label>
                <select
                  value={selectedSymbol}
                  onChange={(e) => setSelectedSymbol(e.target.value)}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                >
                  <option value="BTCUSDT">Bitcoin (BTC/USDT)</option>
                  <option value="ETHUSDT">Ethereum (ETH/USDT)</option>
                  <option value="SOLUSDT">Solana (SOL/USDT)</option>
                  <option value="ADAUSDT">Cardano (ADA/USDT)</option>
                  <option value="XRPUSDT">Ripple (XRP/USDT)</option>
                </select>
              </div>

              {/* Champ Risque */}
              <div>
                <label className="block text-purple-300 mb-2 font-medium">Risque par Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-purple-400 mt-1">Recommandé: 1-2% par trade</p>
              </div>

              {/* Champ Prix d'Entrée avec bouton Live */}
              <div>
                <label className="block text-purple-300 mb-2 font-medium">Prix d'Entrée ($)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="flex-1 bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setEntryPrice(livePrice || entryPrice)}
                    disabled={priceLoading || !livePrice}
                    className="px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    {priceLoading ? '...' : 'Live'}
                  </button>
                </div>
                {livePrice && !priceLoading && (
                  <p className="text-xs text-green-400 mt-1">
                    💰 Prix live: ${livePrice.toLocaleString('fr-FR', {maximumFractionDigits: 2})}
                  </p>
                )}
              </div>

              {/* Champ Stop Loss */}
              <div>
                <label className="block text-red-300 mb-2 font-medium">Stop Loss ($)</label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-red-500/30 focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Champ Take Profit */}
              <div>
                <label className="block text-green-300 mb-2 font-medium">Take Profit ($)</label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-green-500/30 focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Champ Leverage */}
              <div>
                <label className="block text-purple-300 mb-2 font-medium">Leverage (x)</label>
                <input
                  type="number"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                />
                <p className="text-xs text-orange-400 mt-1">⚠️ Plus de leverage = plus de risque</p>
              </div>

              {/* Champ Frais */}
              <div>
                <label className="block text-purple-300 mb-2 font-medium">Frais de Trading (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={fees}
                  onChange={(e) => setFees(Number(e.target.value))}
                  className="w-full bg-slate-700/50 text-white px-4 py-3 rounded-lg border border-purple-500/30 focus:border-purple-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Boutons d'action avec sauvegarde */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-purple-500/20">
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition flex items-center gap-2">
                <CalculatorIcon size={20} /> {/* CHANGEMENT ICI */}
                Calculer
              </button>
              <button 
                onClick={saveCurrentTrade}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition flex items-center gap-2"
              >
                💾 Sauvegarder
              </button>
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg font-semibold transition ml-auto"
              >
                Voir l'historique ({tradeStorage.getTradeCount()})
              </button>
            </div>
          </div>

          {/* Panel de droite - Résultats */}
          <div className="space-y-6">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-purple-400" />
                Résultats
              </h2>

              {results && (
                <div className="space-y-4">
                  <div className="bg-purple-900/30 rounded-lg p-4 border border-purple-500/30">
                    <p className="text-purple-300 text-sm">Taille de Position</p>
                    <p className="text-3xl font-bold text-white">
                      ${results.positionSizeWithLeverage.toLocaleString('fr-FR', {maximumFractionDigits: 2})}
                    </p>
                    <p className="text-purple-400 text-sm mt-1">
                      {results.quantity.toFixed(6)} unités
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-900/30 rounded-lg p-4 border border-red-500/30">
                      <p className="text-red-300 text-sm">Risque</p>
                      <p className="text-xl font-bold text-white">
                        ${results.riskAmount.toFixed(2)}
                      </p>
                      <p className="text-red-400 text-xs">
                        {results.stopDistancePercent.toFixed(2)}% SL
                      </p>
                    </div>

                    <div className="bg-green-900/30 rounded-lg p-4 border border-green-500/30">
                      <p className="text-green-300 text-sm">Profit Potentiel</p>
                      <p className="text-xl font-bold text-white">
                        ${results.potentialProfit.toFixed(2)}
                      </p>
                      <p className="text-green-400 text-xs">
                        {results.tpDistancePercent.toFixed(2)}% TP
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-purple-300">Risk/Reward Ratio</span>
                      <span className={`text-xl font-bold ${results.rrRatio >= 2 ? 'text-green-400' : results.rrRatio >= 1 ? 'text-yellow-400' : 'text-red-400'}`}>
                        1:{results.rrRatio.toFixed(2)}
                      </span>
                    </div>
                    {results.rrRatio < 2 && (
                      <p className="text-xs text-orange-400">⚠️ Vise un R:R d'au moins 1:2</p>
                    )}
                  </div>

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Marge Requise</span>
                      <span className="text-white font-bold">
                        ${results.marginRequired.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {leverage > 1 && (
                    <div className="bg-orange-900/30 rounded-lg p-4 border border-orange-500/30">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="text-orange-400 mt-1" size={20} />
                        <div>
                          <p className="text-orange-300 font-medium">Prix de Liquidation</p>
                          <p className="text-2xl font-bold text-white">
                            ${results.liquidationPrice.toFixed(2)}
                          </p>
                          <p className="text-xs text-orange-400 mt-1">
                            Distance: {((entryPrice - results.liquidationPrice) / entryPrice * 100).toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-slate-700/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-purple-300">Frais Totaux</span>
                      <span className="text-red-400 font-bold">
                        ${results.totalFees.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section AI Advisor */}
            {userPlan === 'ELITE' ? (
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                      <Brain className="text-white" size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">AI Trade Advisor ⭐</h3>
                      <p className="text-purple-300 text-sm">Analyses intelligentes en temps réel</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-yellow-600/20 border border-yellow-500/30 rounded-full text-xs font-bold text-yellow-400">
                    ELITE
                  </div>
                </div>
                
                {results ? (
                  <div className="space-y-4">
                    {/* Analyse du R:R */}
                    <div className={`p-4 rounded-lg border ${
                      results.rrRatio >= 2 
                        ? 'bg-green-900/20 border-green-500/30' 
                        : results.rrRatio >= 1 
                          ? 'bg-yellow-900/20 border-yellow-500/30' 
                          : 'bg-red-900/20 border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {results.rrRatio >= 2 ? (
                          <>
                            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                            <span className="font-bold text-green-400">EXCELLENT</span>
                          </>
                        ) : results.rrRatio >= 1 ? (
                          <>
                            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                            <span className="font-bold text-yellow-400">ACCEPTABLE</span>
                          </>
                        ) : (
                          <>
                            <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                            <span className="font-bold text-red-400">RISQUÉ</span>
                          </>
                        )}
                      </div>
                      <p className="text-white">
                        Ratio R:R de <strong>1:{results.rrRatio.toFixed(2)}</strong>
                      </p>
                      <p className="text-sm text-gray-300 mt-1">
                        {results.rrRatio >= 2 
                          ? "Le risque est bien récompensé. Trade recommandé."
                          : results.rrRatio >= 1
                          ? "Augmentez votre Take Profit pour un meilleur ratio."
                          : "Le profit ne justifie pas le risque. Reconsidérez."
                        }
                      </p>
                    </div>

                    {/* Recommandations */}
                    <div className="bg-slate-800/50 rounded-lg p-4">
                      <h4 className="font-bold text-purple-300 mb-3">📈 Recommandations IA</h4>
                      <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div>
                          <span>
                            <strong>Taille position optimale:</strong> ${(capital * 0.02 / Math.abs(entryPrice - stopLoss) * entryPrice).toLocaleString('fr-FR', {maximumFractionDigits: 2})}
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div>
                          <span>
                            <strong>Risque total:</strong> ${results.riskAmount.toFixed(2)} ({riskPercent}% du capital)
                          </span>
                        </li>
                        <li className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-1.5"></div>
                          <span>
                            <strong>Confidence score:</strong> {Math.min(95, results.rrRatio * 30).toFixed(0)}/100
                          </span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-purple-300 text-center py-4">
                    Remplissez le formulaire pour obtenir l'analyse IA
                  </p>
                )}
              </div>
            ) : (
              <div className="bg-gradient-to-r from-purple-900/10 to-blue-900/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-10"></div>
                
                <div className="relative z-20">
                  <div className="flex items-center gap-3 mb-4">
                    <Brain className="text-purple-400/50" size={24} />
                    <h3 className="text-lg font-bold text-purple-300/70">AI Trade Advisor</h3>
                  </div>
                  
                  <div className="text-center py-6">
                    <div className="inline-block bg-gradient-to-r from-yellow-600 to-orange-600 px-4 py-2 rounded-lg mb-4">
                      <span className="font-bold text-white">⭐ Feature ELITE</span>
                    </div>
                    
                    <p className="text-purple-300 mb-6">
                      Obtenez des analyses IA avancées,<br/>
                      des recommandations personnalisées<br/>
                      et des alertes intelligentes.
                    </p>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => handleUpgrade('ELITE')}
                        className="w-full py-3 bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 rounded-lg font-bold transition"
                      >
                        🔓 Débloquer AI Advisor - 49€/mois
                      </button>
                      
                      <button 
                        onClick={() => navigate('/#pricing')}
                        className="w-full py-2 border border-purple-500/30 hover:border-purple-500/50 rounded-lg text-purple-300 text-sm transition"
                      >
                        Voir tous les plans
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8">
          <p className="text-purple-400 text-sm">
            ⚠️ Ceci est un outil éducatif. Trade à tes propres risques.
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <span className="text-gray-500 text-xs">Plan actuel: {userPlan}</span>
            {userPlan !== 'ELITE' && (
              <button 
                onClick={() => navigate('/#pricing')}
                className="text-xs text-purple-400 hover:text-purple-300 underline"
              >
                Upgrade maintenant
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}