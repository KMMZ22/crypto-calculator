import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, DollarSign, TrendingUp, TrendingDown, ArrowRight, AlertCircle, Info, Calculator, Zap, RefreshCw } from 'lucide-react';
import { supabase } from '../services/supabase';

export default function PnLCalculator() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState('');
  const [userPlan, setUserPlan] = useState('free');

  // Form inputs
  const [entryPrice, setEntryPrice] = useState('');
  const [exitPrice, setExitPrice] = useState('');
  const [positionSize, setPositionSize] = useState('');
  const [leverage, setLeverage] = useState(1);
  const [orderType, setOrderType] = useState('long'); // 'long' or 'short'
  const [fees, setFees] = useState(0.1); // Percentage
  
  // Calculated results
  const [results, setResults] = useState(null);

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
        setUserPlan(user.user_metadata?.plan || 'free');
      } catch (error) {
        console.error('Error loading user:', error);
        navigate('/auth');
      }
    };
    
    loadUser();
  }, [navigate]);

  // Calculate P&L in real-time
  useEffect(() => {
    if (entryPrice && exitPrice && positionSize) {
      calculatePnL();
    }
  }, [entryPrice, exitPrice, positionSize, leverage, orderType, fees]);

  const calculatePnL = () => {
    const entry = parseFloat(entryPrice);
    const exit = parseFloat(exitPrice);
    const size = parseFloat(positionSize);
    const lev = parseFloat(leverage);
    const fee = parseFloat(fees) / 100;

    if (!entry || !exit || !size || entry <= 0 || size <= 0) {
      setResults(null);
      return;
    }

    // Calculate quantity based on position size and entry price
    const quantity = size / entry;
    
    // Calculate price change percentage
    let priceChange;
    if (orderType === 'long') {
      priceChange = ((exit - entry) / entry) * 100;
    } else {
      priceChange = ((entry - exit) / entry) * 100;
    }

    // Calculate gross P&L
    const grossPnL = (size * (priceChange / 100)) * lev;
    
    // Calculate fees (entry + exit)
    const entryFee = size * fee;
    const exitFee = (size + grossPnL) * fee;
    const totalFees = entryFee + exitFee;
    
    // Net P&L
    const netPnL = grossPnL - totalFees;
    
    // ROI
    const roi = (netPnL / size) * 100;
    
    // Liquidation price (simplified)
    let liquidationPrice;
    if (orderType === 'long') {
      liquidationPrice = entry * (1 - (1 / lev) * 0.9); // 90% of margin
    } else {
      liquidationPrice = entry * (1 + (1 / lev) * 0.9);
    }

    setResults({
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

  const resetForm = () => {
    setEntryPrice('');
    setExitPrice('');
    setPositionSize('');
    setLeverage(1);
    setOrderType('long');
    setFees(0.1);
    setResults(null);
  };

  const quickFillExample = () => {
    setEntryPrice('50000');
    setExitPrice('55000');
    setPositionSize('5000');
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
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-gray-400 hover:text-white transition"
              >
                ← Dashboard
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-400">Connecté en tant que</p>
                <p className="text-sm font-medium text-white">{userName}</p>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-xl">
              <Calculator className="text-green-500" size={28} />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-white">Calculateur Profit & Loss</h2>
              <p className="text-gray-400">Calculez vos gains/pertes potentiels en temps réel</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={quickFillExample}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <Zap size={16} />
              Exemple rapide
            </button>
            <button
              onClick={resetForm}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-sm flex items-center gap-2 transition"
            >
              <RefreshCw size={16} />
              Réinitialiser
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left side - Inputs */}
          <div className="space-y-6">
            {/* Order Type */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Type de position
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setOrderType('long')}
                  className={`py-3 rounded-lg font-semibold transition ${
                    orderType === 'long'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <TrendingUp size={18} className="inline mr-2" />
                  LONG (Achat)
                </button>
                <button
                  onClick={() => setOrderType('short')}
                  className={`py-3 rounded-lg font-semibold transition ${
                    orderType === 'short'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  <TrendingDown size={18} className="inline mr-2" />
                  SHORT (Vente)
                </button>
              </div>
            </div>

            {/* Entry Price */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prix d'entrée
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="number"
                  value={entryPrice}
                  onChange={(e) => setEntryPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                  placeholder="50000"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Prix auquel vous entrez en position</p>
            </div>

            {/* Exit Price */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Prix de sortie
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="number"
                  value={exitPrice}
                  onChange={(e) => setExitPrice(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                  placeholder="55000"
                  step="0.01"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Prix cible ou prix actuel du marché</p>
            </div>

            {/* Position Size */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Taille de position
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="number"
                  value={positionSize}
                  onChange={(e) => setPositionSize(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
                  placeholder="5000"
                  step="100"
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">Montant investi dans ce trade</p>
            </div>

            {/* Leverage */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-300">
                  Effet de levier
                </label>
                <span className="text-lg font-bold text-white">{leverage}x</span>
              </div>
              <input
                type="range"
                min="1"
                max="100"
                value={leverage}
                onChange={(e) => setLeverage(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>1x</span>
                <span>25x</span>
                <span>50x</span>
                <span>100x</span>
              </div>
              {leverage > 10 && (
                <div className="mt-3 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-start gap-2">
                  <AlertCircle className="text-orange-500 flex-shrink-0 mt-0.5" size={16} />
                  <p className="text-xs text-orange-400">
                    Attention : Un levier élevé augmente considérablement les risques de liquidation
                  </p>
                </div>
              )}
            </div>

            {/* Fees */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Frais de trading (%)
              </label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[0.05, 0.1, 0.2, 0.5].map((feeValue) => (
                  <button
                    key={feeValue}
                    onClick={() => setFees(feeValue)}
                    className={`py-2 rounded-lg text-sm font-medium transition ${
                      fees === feeValue
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {feeValue}%
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={fees}
                onChange={(e) => setFees(parseFloat(e.target.value))}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500 transition text-sm"
                placeholder="0.1"
                step="0.01"
                min="0"
                max="10"
              />
              <p className="text-xs text-gray-500 mt-2">Frais d'entrée + sortie (variable selon l'exchange)</p>
            </div>
          </div>

          {/* Right side - Results */}
          <div className="space-y-6">
            {results ? (
              <>
                {/* Main Result Card */}
                <div className={`bg-gradient-to-br ${
                  parseFloat(results.netPnL) >= 0 
                    ? 'from-green-500/20 to-transparent border-green-500/30' 
                    : 'from-red-500/20 to-transparent border-red-500/30'
                } border rounded-xl p-8`}>
                  <div className="text-center mb-6">
                    <p className="text-gray-400 text-sm mb-2">Profit/Loss Net</p>
                    <p className={`text-5xl font-bold mb-2 ${
                      parseFloat(results.netPnL) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${parseFloat(results.netPnL) >= 0 ? '+' : ''}{results.netPnL}
                    </p>
                    <p className={`text-2xl font-semibold ${
                      parseFloat(results.roi) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {parseFloat(results.roi) >= 0 ? '+' : ''}{results.roi}% ROI
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Variation prix</p>
                      <p className={`text-lg font-bold ${
                        parseFloat(results.priceChange) >= 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {parseFloat(results.priceChange) >= 0 ? '+' : ''}{results.priceChange}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500 mb-1">Quantité</p>
                      <p className="text-lg font-bold text-white">{results.quantity}</p>
                    </div>
                  </div>
                </div>

                {/* Detailed Breakdown */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white mb-4">📊 Détails du calcul</h3>
                  
                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Taille effective (avec levier)</span>
                    <span className="font-mono text-white font-semibold">${results.effectivePositionSize}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">P&L brut</span>
                    <span className={`font-mono font-semibold ${
                      parseFloat(results.grossPnL) >= 0 ? 'text-green-400' : 'text-red-400'
                    }`}>
                      ${parseFloat(results.grossPnL) >= 0 ? '+' : ''}{results.grossPnL}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-800">
                    <span className="text-gray-400">Frais totaux</span>
                    <span className="font-mono text-red-400 font-semibold">-${results.totalFees}</span>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-semibold">P&L net</span>
                    <span className={`font-mono text-xl font-bold ${
                      parseFloat(results.netPnL) >= 0 ? 'text-green-500' : 'text-red-500'
                    }`}>
                      ${parseFloat(results.netPnL) >= 0 ? '+' : ''}{results.netPnL}
                    </span>
                  </div>
                </div>

                {/* Liquidation Warning */}
                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="text-red-500 flex-shrink-0 mt-1" size={20} />
                    <div>
                      <h4 className="text-red-400 font-semibold mb-2">⚠️ Prix de liquidation estimé</h4>
                      <p className="text-3xl font-bold text-red-500 mb-2">${results.liquidationPrice}</p>
                      <p className="text-sm text-gray-400">
                        Si le prix atteint ce niveau, votre position sera automatiquement liquidée
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => navigate('/calculator')}
                    className="flex-1 py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2"
                  >
                    Position Sizing
                    <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border border-gray-800 text-white font-semibold rounded-lg hover:border-gray-700 hover:bg-gray-900 transition"
                  >
                    Nouveau calcul
                  </button>
                </div>
              </>
            ) : (
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-12 text-center">
                <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Calculator className="text-gray-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Prêt à calculer ?</h3>
                <p className="text-gray-400 mb-6">
                  Remplissez les champs à gauche pour voir vos résultats en temps réel
                </p>
                <button
                  onClick={quickFillExample}
                  className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
                >
                  Essayer avec un exemple
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-500/20 rounded-xl flex-shrink-0">
              <Info className="text-blue-400" size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">💡 Comment utiliser ce calculateur</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">Pour les positions LONG :</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Entrez votre prix d'achat</li>
                    <li>• Définissez votre prix cible ou actuel</li>
                    <li>• Le calculateur affiche votre profit potentiel</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">Pour les positions SHORT :</h4>
                  <ul className="space-y-1 text-gray-400">
                    <li>• Entrez votre prix de vente</li>
                    <li>• Définissez votre prix de rachat cible</li>
                    <li>• Le calculateur affiche votre profit si le prix baisse</li>
                  </ul>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                ⚠️ Ce calculateur est à titre indicatif. Les frais réels peuvent varier selon votre exchange.
                Le prix de liquidation est une estimation simplifiée.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}