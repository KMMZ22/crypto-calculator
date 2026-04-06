import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, DollarSign, TrendingUp, TrendingDown, ArrowRight, AlertCircle, Info, Lock, Zap, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdvancedCalculator() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPlan, setUserPlan] = useState('free');

  // Position Sizing inputs
  const [capital, setCapital] = useState('');
  const [riskPercent, setRiskPercent] = useState('2');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');

  // P&L inputs
  const [exitPrice, setExitPrice] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [orderType, setOrderType] = useState('long');
  const [fees, setFees] = useState(0.1);

  // Calculated results
  const [positionResults, setPositionResults] = useState(null);
  const [pnlResults, setPnlResults] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
          navigate('/auth');
          return;
        }

        setUser(user);
        setUserName(user.user_metadata?.username || user.email?.split('@')[0] || 'Trader');
        const plan = user.user_metadata?.plan || 'free';
        setUserPlan(plan);

        // Redirect free users
        if (plan === 'free') {
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        navigate('/auth');
      }
    };

    loadUser();
  }, [navigate]);

  // Calculate Position Sizing
  useEffect(() => {
    if (capital && riskPercent && entryPrice && stopLoss) {
      calculatePositionSize();
    }
  }, [capital, riskPercent, entryPrice, stopLoss, takeProfit]);

  // Calculate P&L when position size or exit changes
  useEffect(() => {
    if (positionResults && exitPrice) {
      calculatePnL();
    }
  }, [positionResults, exitPrice, leverage, orderType, fees]);

  // Auto-sync: When position size is calculated, update P&L inputs
  useEffect(() => {
    if (positionResults) {
      // Auto-fill exit price with take profit if available
      if (takeProfit && !exitPrice) {
        setExitPrice(takeProfit);
      }
    }
  }, [positionResults, takeProfit]);

  const calculatePositionSize = () => {
    const cap = parseFloat(capital);
    const risk = parseFloat(riskPercent) / 100;
    const entry = parseFloat(entryPrice);
    const sl = parseFloat(stopLoss);
    const tp = takeProfit ? parseFloat(takeProfit) : null;

    if (!cap || !entry || !sl || cap <= 0 || entry <= 0) {
      setPositionResults(null);
      return;
    }

    // Calculate risk amount in dollars
    const riskAmount = cap * risk;

    // Calculate stop loss percentage
    const slPercent = Math.abs(((entry - sl) / entry) * 100);

    // Calculate position size
    const positionSize = riskAmount / (slPercent / 100);

    // Calculate quantity
    const quantity = positionSize / entry;

    // Calculate take profit details if provided
    let tpPercent = null;
    let potentialProfit = null;
    let riskRewardRatio = null;

    if (tp) {
      tpPercent = ((tp - entry) / entry) * 100;
      potentialProfit = positionSize * (tpPercent / 100);
      riskRewardRatio = potentialProfit / riskAmount;
    }

    setPositionResults({
      positionSize: positionSize.toFixed(2),
      quantity: quantity.toFixed(8),
      riskAmount: riskAmount.toFixed(2),
      slPercent: slPercent.toFixed(2),
      tpPercent: tpPercent ? tpPercent.toFixed(2) : null,
      potentialProfit: potentialProfit ? potentialProfit.toFixed(2) : null,
      riskRewardRatio: riskRewardRatio ? riskRewardRatio.toFixed(2) : null
    });
  };

  const calculatePnL = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const size = parseFloat(positionResults.positionSize);
    const lev = parseFloat(leverage);
    const fee = parseFloat(fees) / 100;

    if (!entry || !exit || !size || entry <= 0 || size <= 0) {
      setPnlResults(null);
      return;
    }

    // Calculate quantity
    const quantity = size / entry;

    // Calculate price change
    let priceChange;
    if (orderType === 'long') {
      priceChange = ((exit - entry) / entry) * 100;
    } else {
      priceChange = ((entry - exit) / entry) * 100;
    }

    // Calculate gross P&L
    const grossPnL = (size * (priceChange / 100)) * lev;

    // Calculate fees
    const entryFee = size * fee;
    const exitFee = (size + grossPnL) * fee;
    const totalFees = entryFee + exitFee;

    // Net P&L
    const netPnL = grossPnL - totalFees;

    // ROI
    const roi = (netPnL / size) * 100;

    // Liquidation price
    let liquidationPrice;
    if (orderType === 'long') {
      liquidationPrice = entry * (1 - (1 / lev) * 0.9);
    } else {
      liquidationPrice = entry * (1 + (1 / lev) * 0.9);
    }

    setPnlResults({
      quantity: quantity.toFixed(8),
      priceChange: priceChange.toFixed(2),
      grossPnL: grossPnL.toFixed(2),
      totalFees: totalFees.toFixed(2),
      netPnL: netPnL.toFixed(2),
      roi: roi.toFixed(2),
      liquidationPrice: liquidationPrice.toFixed(2),
      effectivePositionSize: (size * lev).toFixed(2)
    });
  };

  const quickFillExample = () => {
    setCapital('10000');
    setRiskPercent('2');
    setEntryPrice('50000');
    setStopLoss('48000');
    setTakeProfit('55000');
    setExitPrice('55000');
    setLeverage(2);
    setOrderType('long');
    setFees(0.1);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Top */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield className="text-white" size={32} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-black">$€¥</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white">TradeGuard</h1>
              </div>

              <div className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white text-sm font-bold flex items-center gap-2">
                <Crown size={16} />
                {userPlan === 'elite' ? 'ELITE' : 'PRO'} ADVANCED
              </div>

              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                ← Dashboard
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={quickFillExample}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition"
              >
                <Zap size={16} />
                Exemple
              </button>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Calculateur Avancé</h2>
              <p className="text-gray-400">Position Sizing + P&L Calculator synchronisés en temps réel</p>
            </div>
            <div className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-xl px-6 py-3">
              <p className="text-purple-400 text-sm font-semibold">🎯 Mode Advanced</p>
              <p className="text-xs text-gray-400">Calculs synchronisés automatiquement</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* LEFT COLUMN - Position Sizing */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">📊 Position Sizing</h3>
                <div className="px-3 py-1 bg-green-500/20 rounded-full text-xs font-semibold text-green-400">
                  Étape 1
                </div>
              </div>

              {/* Capital */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Capital Total
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="number"
                    value={capital}
                    onChange={(e) => setCapital(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                    placeholder="10000"
                  />
                </div>
              </div>

              {/* Risk % */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-300">
                    Risque par Trade (%)
                  </label>
                  <span className="text-lg font-bold text-white">{riskPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={riskPercent}
                  onChange={(e) => setRiskPercent(e.target.value)}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0.5%</span>
                  <span>5%</span>
                  <span>10%</span>
                </div>
              </div>

              {/* Entry Price */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Prix d'Entrée
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="number"
                    value={entryPrice}
                    onChange={(e) => setEntryPrice(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                    placeholder="50000"
                  />
                </div>
              </div>

              {/* Stop Loss & Take Profit */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-red-400 mb-2">
                    Stop Loss
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="number"
                      value={stopLoss}
                      onChange={(e) => setStopLoss(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-red-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition"
                      placeholder="48000"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-400 mb-2">
                    Take Profit
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input
                      type="number"
                      value={takeProfit}
                      onChange={(e) => {
                        setTakeProfit(e.target.value);
                        // Auto-sync to exit price
                        setExitPrice(e.target.value);
                      }}
                      className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-green-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                      placeholder="55000"
                    />
                  </div>
                </div>
              </div>

              {/* Position Results */}
              {positionResults && (
                <div className="mt-6 p-4 bg-gray-900 border border-green-500/30 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Taille de Position</span>
                    <span className="text-xl font-bold text-green-500">${positionResults.positionSize}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Quantité</span>
                    <span className="text-white font-mono">{positionResults.quantity}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Risque ($)</span>
                    <span className="text-red-400 font-bold">${positionResults.riskAmount}</span>
                  </div>
                  {positionResults.riskRewardRatio && (
                    <div className="flex justify-between items-center pt-2 border-t border-gray-800">
                      <span className="text-gray-400 text-sm">R:R Ratio</span>
                      <span className="text-green-400 font-bold">1:{positionResults.riskRewardRatio}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN - P&L Calculator */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">💰 Profit & Loss</h3>
                <div className="px-3 py-1 bg-blue-500/20 rounded-full text-xs font-semibold text-blue-400">
                  Étape 2
                </div>
              </div>

              {!positionResults ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="text-gray-600" size={28} />
                  </div>
                  <p className="text-gray-400 text-sm">
                    Complétez d'abord le Position Sizing<br />pour déverrouiller le P&L
                  </p>
                </div>
              ) : (
                <>
                  {/* Order Type */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Type de Position
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setOrderType('long')}
                        className={`py-2 rounded-lg font-semibold transition ${orderType === 'long'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-800 text-gray-400'
                          }`}
                      >
                        LONG
                      </button>
                      <button
                        onClick={() => setOrderType('short')}
                        className={`py-2 rounded-lg font-semibold transition ${orderType === 'short'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-800 text-gray-400'
                          }`}
                      >
                        SHORT
                      </button>
                    </div>
                  </div>

                  {/* Exit Price (auto-synced from Take Profit) */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Prix de Sortie
                      {takeProfit && exitPrice === takeProfit && (
                        <span className="ml-2 text-xs text-green-400">✓ Synchro auto</span>
                      )}
                    </label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                      <input
                        type="number"
                        value={exitPrice}
                        onChange={(e) => setExitPrice(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition"
                        placeholder="Prix cible ou actuel"
                      />
                    </div>
                  </div>

                  {/* Leverage */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">
                        Effet de Levier
                      </label>
                      <span className="text-lg font-bold text-white">{leverage}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="100"
                      value={leverage}
                      onChange={(e) => setLeverage(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1x</span>
                      <span>50x</span>
                      <span>100x</span>
                    </div>
                  </div>

                  {/* Fees */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Frais (%)
                    </label>
                    <div className="grid grid-cols-4 gap-2 mb-2">
                      {[0.05, 0.1, 0.2, 0.5].map((feeValue) => (
                        <button
                          key={feeValue}
                          onClick={() => setFees(feeValue)}
                          className={`py-2 rounded-lg text-xs font-medium transition ${fees === feeValue
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-800 text-gray-400'
                            }`}
                        >
                          {feeValue}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* P&L Results */}
                  {pnlResults && (
                    <div className={`mt-6 p-6 bg-gradient-to-br ${parseFloat(pnlResults.netPnL) >= 0
                      ? 'from-green-500/20 to-transparent border-green-500/30'
                      : 'from-red-500/20 to-transparent border-red-500/30'
                      } border rounded-lg`}>
                      <div className="text-center mb-4">
                        <p className="text-gray-400 text-xs mb-1">Profit/Loss Net</p>
                        <p className={`text-4xl font-bold ${parseFloat(pnlResults.netPnL) >= 0 ? 'text-green-500' : 'text-red-500'
                          }`}>
                          ${parseFloat(pnlResults.netPnL) >= 0 ? '+' : ''}{pnlResults.netPnL}
                        </p>
                        <p className={`text-lg font-semibold ${parseFloat(pnlResults.roi) >= 0 ? 'text-green-400' : 'text-red-400'
                          }`}>
                          {parseFloat(pnlResults.roi) >= 0 ? '+' : ''}{pnlResults.roi}% ROI
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">P&L brut</span>
                          <span className={parseFloat(pnlResults.grossPnL) >= 0 ? 'text-green-400' : 'text-red-400'}>
                            ${pnlResults.grossPnL}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Frais</span>
                          <span className="text-red-400">-${pnlResults.totalFees}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-700">
                          <span className="text-white font-semibold">Net</span>
                          <span className={`font-bold ${parseFloat(pnlResults.netPnL) >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                            ${pnlResults.netPnL}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-700">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Prix liquidation</span>
                          <span className="text-red-400 font-mono">${pnlResults.liquidationPrice}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/30 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/20 rounded-xl flex-shrink-0">
              <Info className="text-purple-400" size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">🎯 Mode Advanced - Workflow Automatisé</h3>
              <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-300">
                <div>
                  <p className="font-semibold text-purple-400 mb-1">1. Position Sizing</p>
                  <p className="text-gray-400 text-xs">Calculez votre taille de position optimale basée sur votre capital et risque accepté</p>
                </div>
                <div>
                  <p className="font-semibold text-blue-400 mb-1">2. Synchronisation Auto</p>
                  <p className="text-gray-400 text-xs">Le montant calculé se remplit automatiquement dans le P&L Calculator</p>
                </div>
                <div>
                  <p className="font-semibold text-green-400 mb-1">3. Projection P&L</p>
                  <p className="text-gray-400 text-xs">Voyez instantanément vos gains/pertes potentiels avec leverage et fees inclus</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}