import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, DollarSign, AlertTriangle, BarChart3, 
  ArrowLeft, Brain, Crown, Calculator as CalculatorIcon,
  Shield, History, Check
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLivePrice } from '../hooks/useLivePrice';
import { tradeStorage } from '../utils/storage';
import { supabase } from '../services/supabase';

export default function Calculator() {
  const navigate = useNavigate();
  
  const [userPlan, setUserPlan] = useState('free');
  const [userName, setUserName] = useState('');
  const [assetType, setAssetType] = useState('crypto');
  const [availablePairs, setAvailablePairs] = useState([]);
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

  // Charger les données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserName(user.user_metadata?.username || user.email?.split('@')[0] || 'Trader');
          const plan = user.user_metadata?.plan || 'free';
          setUserPlan(plan);
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
      }
    };
    
    loadUserData();
  }, []);

  useEffect(() => {
    calculatePosition();
  }, [capital, riskPercent, entryPrice, stopLoss, takeProfit, leverage, fees]);

  // Effet pour charger les paires selon le type d'actif
  useEffect(() => {
    const loadAssetPairs = () => {
      switch(assetType) {
        case 'crypto':
          setAvailablePairs([
            { value: 'BTCUSDT', label: 'Bitcoin (BTC/USDT)', icon: '₿' },
            { value: 'ETHUSDT', label: 'Ethereum (ETH/USDT)', icon: 'Ξ' },
            { value: 'SOLUSDT', label: 'Solana (SOL/USDT)', icon: '◎' },
            { value: 'ADAUSDT', label: 'Cardano (ADA/USDT)', icon: 'A' },
            { value: 'XRPUSDT', label: 'Ripple (XRP/USDT)', icon: 'X' },
            { value: 'DOTUSDT', label: 'Polkadot (DOT/USDT)', icon: '●' },
          ]);
          setFees(0.1);
          setLeverage(userPlan === 'free' ? 1 : 5);
          setSelectedSymbol('BTCUSDT');
          break;
          
        case 'stocks':
          setAvailablePairs([
            { value: 'TSLA', label: 'Tesla Inc. (TSLA)', icon: '🚗' },
            { value: 'AAPL', label: 'Apple Inc. (AAPL)', icon: '🍎' },
            { value: 'NVDA', label: 'NVIDIA Corp. (NVDA)', icon: '🎮' },
            { value: 'AMZN', label: 'Amazon.com Inc. (AMZN)', icon: '📦' },
            { value: 'MSFT', label: 'Microsoft Corp. (MSFT)', icon: '💻' },
            { value: 'GOOGL', label: 'Alphabet Inc. (GOOGL)', icon: '🔍' },
          ]);
          setFees(0);
          setLeverage(1);
          setSelectedSymbol('TSLA');
          break;
          
        case 'forex':
          setAvailablePairs([
            { value: 'EURUSD', label: 'Euro / US Dollar (EUR/USD)', icon: '€' },
            { value: 'GBPUSD', label: 'British Pound / USD (GBP/USD)', icon: '£' },
            { value: 'USDJPY', label: 'US Dollar / Japanese Yen (USD/JPY)', icon: '¥' },
            { value: 'USDCHF', label: 'US Dollar / Swiss Franc (USD/CHF)', icon: '₣' },
            { value: 'AUDUSD', label: 'Australian Dollar / USD (AUD/USD)', icon: 'A$' },
            { value: 'USDCAD', label: 'US Dollar / Canadian Dollar (USDCAD)', icon: 'C$' },
          ]);
          setFees(0.0002);
          setLeverage(30);
          setSelectedSymbol('EURUSD');
          break;
          
        default:
          setAvailablePairs([]);
      }
    };
    
    loadAssetPairs();
  }, [assetType, userPlan]);

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

  const getPlanColor = (plan) => {
    switch(plan.toLowerCase()) {
      case 'pro':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'elite':
        return 'bg-gradient-to-r from-purple-500 to-blue-500';
      default:
        return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  const getPlanName = (plan) => {
    switch(plan.toLowerCase()) {
      case 'pro': return 'PRO';
      case 'elite': return 'ELITE';
      default: return 'GRATUIT';
    }
  };

  const saveCurrentTrade = () => {
    if (!results) return;
    
    if (userPlan === 'free') {
      alert('La sauvegarde des trades est une fonctionnalité PRO');
      navigate('/auth?plan=pro');
      return;
    }
    
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

  const upgradePlan = (plan) => {
    navigate(`/auth?plan=${plan}`);
  };

  const canUseFeature = (featurePlan) => {
    const planLevels = { free: 0, pro: 1, elite: 2 };
    return planLevels[userPlan] >= planLevels[featurePlan];
  };

  // ⚠️ LE return DOIT ÊTRE DANS LA FONCTION
  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header avec logo cohérent */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pt-8 gap-4">
          <div>
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-4"
            >
              <ArrowLeft size={20} />
              Retour au dashboard
            </button>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield className="text-white" size={32} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-black">$€¥</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white">TradeGuard</h1>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-bold ${getPlanColor(userPlan)} text-white`}>
                {getPlanName(userPlan)}
              </span>
            </div>
            <p className="text-gray-400 mt-1">Calculateur de position - Gère ton risque comme un pro</p>
          </div>
          
          {/* Boutons actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white rounded-lg font-medium transition flex items-center gap-2"
            >
              <BarChart3 size={18} />
              Dashboard
            </button>
            
            {userPlan === 'free' && (
              <button
                onClick={() => upgradePlan('pro')}
                className={`px-4 py-2 ${getPlanColor('pro')} text-white font-semibold rounded-lg hover:opacity-90 transition flex items-center gap-2`}
              >
                <Crown size={18} />
                Passer à PRO
              </button>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Panel de gauche - Inputs */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <CalculatorIcon className="text-green-500" />
              Paramètres du Trade
            </h2>

            <div className="space-y-4">
              {/* Sélecteur de Type d'Actif */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Type d'Actif
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAssetType('crypto')}
                    className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                      assetType === 'crypto'
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">₿</span>
                    Crypto
                  </button>
                  <button
                    onClick={() => setAssetType('stocks')}
                    className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                      assetType === 'stocks'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">📈</span>
                    Actions
                  </button>
                  <button
                    onClick={() => setAssetType('forex')}
                    className={`flex-1 py-3 rounded-lg font-medium transition flex items-center justify-center gap-2 ${
                      assetType === 'forex'
                        ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-lg">🌍</span>
                    Forex
                  </button>
                </div>
              </div>

              {/* Champ Capital */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  {assetType === 'forex' ? 'Compte ($)' : 'Capital Total ($)'}
                </label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Sélecteur de paire/symbole */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  {assetType === 'crypto' ? 'Crypto-monnaie' : 
                   assetType === 'stocks' ? 'Action' : 'Paire de Devises'}
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {availablePairs.map((pair) => (
                    <button
                      key={pair.value}
                      onClick={() => setSelectedSymbol(pair.value)}
                      className={`p-3 rounded-lg border transition flex items-center justify-center gap-2 ${
                        selectedSymbol === pair.value
                          ? 'bg-green-500/20 border-green-500 text-white'
                          : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-700/50'
                      }`}
                    >
                      <span className="text-xl">{pair.icon}</span>
                      <span className="text-sm font-medium">{pair.value}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Champ Risque */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Risque par Trade (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(Number(e.target.value))}
                  className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">Recommandé: 1-2% par trade</p>
              </div>

              {/* Champ Prix d'Entrée avec bouton Live */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Prix d'Entrée ($)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(Number(e.target.value))}
                    className="flex-1 bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setEntryPrice(livePrice || entryPrice)}
                    disabled={priceLoading || !livePrice}
                    className={`px-4 py-3 ${canUseFeature('pro') ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-700 cursor-not-allowed'} rounded-lg font-medium transition`}
                  >
                    {priceLoading ? '...' : 'Live'}
                  </button>
                </div>
                {livePrice && !priceLoading && (
                  <p className="text-xs text-green-400 mt-1">
                    💰 Prix live: ${livePrice.toLocaleString('fr-FR', {maximumFractionDigits: 2})}
                  </p>
                )}
                {!canUseFeature('pro') && (
                  <p className="text-xs text-gray-400 mt-1">⚠️ Prix live disponible en PRO</p>
                )}
              </div>

              {/* Champ Stop Loss */}
              <div>
                <label className="block text-red-400 mb-2 font-medium">Stop Loss ($)</label>
                <input
                  type="number"
                  value={stopLoss}
                  onChange={(e) => setStopLoss(Number(e.target.value))}
                  className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-red-500/30 focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Champ Take Profit */}
              <div>
                <label className="block text-green-400 mb-2 font-medium">Take Profit ($)</label>
                <input
                  type="number"
                  value={takeProfit}
                  onChange={(e) => setTakeProfit(Number(e.target.value))}
                  className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-green-500/30 focus:border-green-500 focus:outline-none"
                />
              </div>

              {/* Champ Leverage */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  Leverage (x)
                  {assetType === 'forex' && (
                    <span className="text-xs text-green-400 ml-2">(Standard: 30x)</span>
                  )}
                  {assetType === 'crypto' && (
                    <span className="text-xs text-green-400 ml-2">(PRO: jusqu'à 20x)</span>
                  )}
                </label>
                <input
                  type="number"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                />
                <p className="text-xs text-orange-400 mt-1">
                  {assetType === 'forex' 
                    ? '⚠️ Levier élevé commun en forex - surveillez votre marge'
                    : assetType === 'crypto'
                    ? '⚠️ Plus de leverage = plus de risque de liquidation'
                    : '⚠️ Levier déconseillé pour les débutants en actions'}
                </p>
              </div>

              {/* Champ Frais adapté */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">
                  {assetType === 'forex' ? 'Spread (pip)' : 'Frais de Trading (%)'}
                </label>
                <input
                  type="number"
                  step={assetType === 'forex' ? "0.0001" : "0.01"}
                  value={fees}
                  onChange={(e) => setFees(Number(e.target.value))}
                  className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  {assetType === 'forex' 
                    ? 'Ex: 0.0002 = 2 pips'
                    : assetType === 'crypto'
                    ? 'Frais typiques d\'exchange: 0.05% - 0.1%'
                    : 'Frais de courtier (ex: 0$ par trade)'}
                </p>
              </div>
            </div>
            
            {/* Boutons d'action */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-800">
              <button 
                onClick={calculatePosition}
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              >
                <CalculatorIcon size={20} />
                Calculer
              </button>
              
              <button 
                onClick={saveCurrentTrade}
                disabled={!canUseFeature('pro')}
                className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
                  canUseFeature('pro') 
                    ? 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                💾 Sauvegarder
                {!canUseFeature('pro') && <span className="text-xs">(PRO)</span>}
              </button>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition ml-auto flex items-center gap-2"
              >
                <History size={18} />
                Voir l'historique
              </button>
            </div>
          </div>

          {/* Panel de droite - Résultats */}
          <div className="space-y-6">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <BarChart3 className="text-green-500" />
                Résultats
              </h2>

              {results && (
                <div className="space-y-4">
                  <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                    <p className="text-green-300 text-sm">Taille de Position</p>
                    <p className="text-3xl font-bold text-white">
                      ${results.positionSizeWithLeverage.toLocaleString('fr-FR', {maximumFractionDigits: 2})}
                    </p>
                    <p className="text-green-400 text-sm mt-1">
                      {results.quantity.toFixed(6)} unités
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-red-900/20 rounded-lg p-4 border border-red-500/30">
                      <p className="text-red-300 text-sm">Risque</p>
                      <p className="text-xl font-bold text-white">
                        ${results.riskAmount.toFixed(2)}
                      </p>
                      <p className="text-red-400 text-xs">
                        {results.stopDistancePercent.toFixed(2)}% SL
                      </p>
                    </div>

                    <div className="bg-green-900/20 rounded-lg p-4 border border-green-500/30">
                      <p className="text-green-300 text-sm">Profit Potentiel</p>
                      <p className="text-xl font-bold text-white">
                        ${results.potentialProfit.toFixed(2)}
                      </p>
                      <p className="text-green-400 text-xs">
                        {results.tpDistancePercent.toFixed(2)}% TP
                      </p>
                    </div>
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Risk/Reward Ratio</span>
                      <span className={`text-xl font-bold ${
                        results.rrRatio >= 2 ? 'text-green-400' : 
                        results.rrRatio >= 1 ? 'text-yellow-400' : 
                        'text-red-400'
                      }`}>
                        1:{results.rrRatio.toFixed(2)}
                      </span>
                    </div>
                    {results.rrRatio < 2 && (
                      <p className="text-xs text-orange-400">⚠️ Vise un R:R d'au moins 1:2</p>
                    )}
                  </div>

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Marge Requise</span>
                      <span className="text-white font-bold">
                        ${results.marginRequired.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {leverage > 1 && (
                    <div className="bg-orange-900/20 rounded-lg p-4 border border-orange-500/30">
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

                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">Frais Totaux</span>
                      <span className="text-red-400 font-bold">
                        ${results.totalFees.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Section AI Advisor */}
            {canUseFeature('elite') ? (
              <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/30 rounded-xl p-6">
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
                  <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs font-bold rounded-full">
                    ELITE
                  </div>
                </div>
                
                {results ? (
                  <div className="space-y-4">
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

                    <div className="bg-gray-800/50 rounded-lg p-4">
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
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] z-10"></div>
                
                <div className="relative z-20">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Brain className="text-gray-500" size={24} />
                      <div>
                        <h3 className="text-lg font-bold text-gray-400">AI Trade Advisor</h3>
                        <p className="text-gray-500 text-sm">Analyses IA avancées</p>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white text-xs font-bold rounded-full">
                      ELITE
                    </div>
                  </div>
                  
                  <div className="text-center py-6">
                    <div className="inline-flex items-center gap-2 mb-4">
                      <Check size={16} className="text-green-500" />
                      <span className="text-green-400 font-medium">Analyse intelligente des trades</span>
                    </div>
                    
                    <p className="text-gray-400 mb-6">
                      Obtenez des recommandations personnalisées<br/>
                      basées sur vos paramètres de trading.
                    </p>
                    
                    <div className="space-y-3">
                      <button 
                        onClick={() => upgradePlan('elite')}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition"
                      >
                        🔓 Débloquer AI Advisor
                      </button>
                      
                      <div className="text-xs text-gray-500">
                        Inclus dans le plan ELITE • $49/mois
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-8 border-t border-gray-800 pt-8">
          <p className="text-gray-400 text-sm">
            ⚠️ Ceci est un outil éducatif. Trade à vos propres risques.
          </p>
          <div className="flex justify-center items-center gap-4 mt-4">
            <span className="text-gray-500 text-xs">Plan actuel: {getPlanName(userPlan)}</span>
            {userPlan === 'free' && (
              <button 
                onClick={() => upgradePlan('pro')}
                className="text-xs text-green-400 hover:text-green-300 underline"
              >
                Passer à PRO
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} // ⬅️ C'EST ICI QUE LA FONCTION SE TERMINE