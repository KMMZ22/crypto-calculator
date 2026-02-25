// src/pages/Calculator.jsx - VERSION AVEC LIMITE GUEST
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  TrendingUp, DollarSign, AlertTriangle, BarChart3,
  ArrowLeft, Brain, Crown, Calculator as CalculatorIcon,
  Shield, History, Check, UserPlus, LogIn, X
} from 'lucide-react';
import { useLivePrice } from '../hooks/useLivePrice';
import { supabase } from '../lib/supabase';
import Header from '../components/Layout/Header';

// ─── Helpers localStorage pour le compteur guest ─────────────────────────────
const GUEST_CALC_KEY = 'tg_guest_calc';
const GUEST_LIMIT = 2;

function getGuestCalcData() {
  try {
    const raw = localStorage.getItem(GUEST_CALC_KEY);
    if (!raw) return { count: 0, date: new Date().toDateString() };
    const data = JSON.parse(raw);
    // Reset si c'est un nouveau jour
    if (data.date !== new Date().toDateString()) {
      return { count: 0, date: new Date().toDateString() };
    }
    return data;
  } catch {
    return { count: 0, date: new Date().toDateString() };
  }
}

function incrementGuestCalc() {
  const data = getGuestCalcData();
  const next = { ...data, count: data.count + 1 };
  localStorage.setItem(GUEST_CALC_KEY, JSON.stringify(next));
  return next.count;
}
// ─────────────────────────────────────────────────────────────────────────────

export default function Calculator() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isGuestMode = searchParams.get('guest') === 'true';

  const [userPlan, setUserPlan] = useState('free');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [guestCalcCount, setGuestCalcCount] = useState(0);
  const [showGuestBanner, setShowGuestBanner] = useState(false);

  const [assetType, setAssetType] = useState('crypto');
  const [availablePairs, setAvailablePairs] = useState([]);
  const [selectedSymbol, setSelectedSymbol] = useState('BTCUSDT');
  const { price: livePrice, loading: priceLoading } = useLivePrice(selectedSymbol);

  const [capital, setCapital] = useState('');
  const [riskPercent, setRiskPercent] = useState('');
  const [entryPrice, setEntryPrice] = useState('');
  const [stopLoss, setStopLoss] = useState('');
  const [takeProfit, setTakeProfit] = useState('');
  const [leverage, setLeverage] = useState('');
  const [fees, setFees] = useState('');

  const [results, setResults] = useState(null);

  // Charger les données utilisateur + vérifier si guest
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsAuthenticated(true);
          setIsGuest(false);
          const plan = user.user_metadata?.plan || 'free';
          setUserPlan(plan);
        } else {
          // Aucun utilisateur connecté → mode guest
          setIsAuthenticated(false);
          setIsGuest(true);
          const calcs = getGuestCalcData();
          setGuestCalcCount(calcs.count);
          if (calcs.count >= GUEST_LIMIT) {
            setShowGuestBanner(true);
          }
        }
      } catch (error) {
        console.error('Erreur chargement utilisateur:', error);
        setIsGuest(true);
      }
    };

    loadUserData();
  }, []);

  // Calculer automatiquement quand les champs changent
  useEffect(() => {
    if (capital && riskPercent && entryPrice && stopLoss && takeProfit) {
      handleCalculate();
    }
  }, [capital, riskPercent, entryPrice, stopLoss, takeProfit, leverage, fees]);

  // Charger les paires selon le type d'actif
  useEffect(() => {
    const loadAssetPairs = () => {
      switch (assetType) {
        case 'crypto':
          setAvailablePairs([
            { value: 'BTCUSDT', label: 'Bitcoin (BTC/USDT)' },
            { value: 'ETHUSDT', label: 'Ethereum (ETH/USDT)' },
            { value: 'SOLUSDT', label: 'Solana (SOL/USDT)' },
            { value: 'ADAUSDT', label: 'Cardano (ADA/USDT)' },
            { value: 'XRPUSDT', label: 'Ripple (XRP/USDT)' },
            { value: 'DOTUSDT', label: 'Polkadot (DOT/USDT)' },
          ]);
          setFees('0.1');
          setLeverage(userPlan === 'free' ? '1' : '5');
          setSelectedSymbol('BTCUSDT');
          break;

        case 'stocks':
          setAvailablePairs([
            { value: 'TSLA', label: 'Tesla Inc. (TSLA)' },
            { value: 'AAPL', label: 'Apple Inc. (AAPL)' },
            { value: 'NVDA', label: 'NVIDIA Corp. (NVDA)' },
            { value: 'AMZN', label: 'Amazon.com Inc. (AMZN)' },
            { value: 'MSFT', label: 'Microsoft Corp. (MSFT)' },
            { value: 'GOOGL', label: 'Alphabet Inc. (GOOGL)' },
          ]);
          setFees('0');
          setLeverage('1');
          setSelectedSymbol('TSLA');
          break;

        case 'forex':
          setAvailablePairs([
            { value: 'EURUSD', label: 'Euro / US Dollar (EUR/USD)' },
            { value: 'GBPUSD', label: 'British Pound / USD (GBP/USD)' },
            { value: 'USDJPY', label: 'US Dollar / Japanese Yen (USD/JPY)' },
            { value: 'USDCHF', label: 'US Dollar / Swiss Franc (USD/CHF)' },
            { value: 'AUDUSD', label: 'Australian Dollar / USD (AUD/USD)' },
            { value: 'USDCAD', label: 'US Dollar / Canadian Dollar (USDCAD)' },
          ]);
          setFees('0.0002');
          setLeverage('30');
          setSelectedSymbol('EURUSD');
          break;

        default:
          setAvailablePairs([]);
      }
    };

    loadAssetPairs();
  }, [assetType, userPlan]);

  const handleNumberInput = (setter) => (e) => {
    const value = e.target.value;
    if (value === '') { setter(''); return; }
    const numericValue = value.replace(/[^0-9.]/g, '');
    if ((numericValue.match(/\./g) || []).length > 1) return;
    setter(numericValue);
  };

  const calculatePosition = () => {
    const numCapital = parseFloat(capital) || 0;
    const numRiskPercent = parseFloat(riskPercent) || 0;
    const numEntryPrice = parseFloat(entryPrice) || 0;
    const numStopLoss = parseFloat(stopLoss) || 0;
    const numTakeProfit = parseFloat(takeProfit) || 0;
    const numLeverage = parseFloat(leverage) || 1;
    const numFees = parseFloat(fees) || 0;

    if (numCapital === 0 || numEntryPrice === 0 || numStopLoss === 0 || numTakeProfit === 0) return;

    const riskAmount = (numCapital * numRiskPercent) / 100;
    const stopDistance = Math.abs(numEntryPrice - numStopLoss);
    const stopDistancePercent = (stopDistance / numEntryPrice) * 100;
    const positionSizeUSD = riskAmount / (stopDistancePercent / 100);
    const positionSizeWithLeverage = positionSizeUSD * numLeverage;
    const quantity = positionSizeWithLeverage / numEntryPrice;
    const tpDistance = Math.abs(numTakeProfit - numEntryPrice);
    const tpDistancePercent = (tpDistance / numEntryPrice) * 100;
    const potentialProfit = (positionSizeWithLeverage * tpDistancePercent) / 100;
    const rrRatio = potentialProfit / riskAmount;
    const liquidationPrice = numEntryPrice * (1 - (1 / numLeverage) * 0.9);
    const totalFees = (positionSizeWithLeverage * numFees * 2) / 100;
    const marginRequired = positionSizeWithLeverage / numLeverage;

    setResults({
      riskAmount, positionSizeUSD, positionSizeWithLeverage, quantity,
      potentialProfit, rrRatio, liquidationPrice, totalFees, marginRequired,
      stopDistancePercent, tpDistancePercent
    });
  };

  // Wrapper avec logique de limite guest
  const handleCalculate = () => {
    if (isGuest) {
      const currentData = getGuestCalcData();
      if (currentData.count >= GUEST_LIMIT) {
        // Limite atteinte → afficher le banner, pas de calcul
        setShowGuestBanner(true);
        return;
      }
      // Incrémenter puis calculer
      const newCount = incrementGuestCalc();
      setGuestCalcCount(newCount);
      calculatePosition();
      if (newCount >= GUEST_LIMIT) {
        // Afficher le banner après ce dernier calcul autorisé
        setShowGuestBanner(true);
      }
    } else {
      calculatePosition();
    }
  };

  const getPlanColor = (plan) => {
    switch (plan.toLowerCase()) {
      case 'pro': return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'elite': return 'bg-gradient-to-r from-purple-500 to-blue-500';
      default: return 'bg-gradient-to-r from-gray-600 to-gray-700';
    }
  };

  const getPlanName = (plan) => {
    switch (plan.toLowerCase()) {
      case 'pro': return 'PRO';
      case 'elite': return 'ELITE';
      default: return 'GRATUIT';
    }
  };

  const loadExample = (example) => {
    if (example === 'btc') {
      setCapital('10000'); setRiskPercent('2'); setEntryPrice('50000');
      setStopLoss('48000'); setTakeProfit('55000'); setLeverage('1');
      setFees('0.1'); setAssetType('crypto'); setSelectedSymbol('BTCUSDT');
    } else if (example === 'eth') {
      setCapital('5000'); setRiskPercent('1.5'); setEntryPrice('3000');
      setStopLoss('2850'); setTakeProfit('3300'); setLeverage('5');
      setFees('0.1'); setAssetType('crypto'); setSelectedSymbol('ETHUSDT');
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(isAuthenticated ? '/dashboard' : '/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white transition mb-8"
        >
          <ArrowLeft size={20} />
          {isAuthenticated ? 'Retour au dashboard' : 'Retour à l\'accueil'}
        </button>

        {/* Banner guest : invite à l'inscription (toujours visible si guest) */}
        {isGuest && !showGuestBanner && (
          <div className="mb-6 flex items-center justify-between gap-4 px-5 py-3 bg-[#1a1f2e] border border-[#6366F1]/30 rounded-xl">
            <div className="flex items-center gap-3">
              <span className="text-[#6366F1] text-lg">✨</span>
              <p className="text-sm text-gray-300">
                Mode visiteur :{' '}
                <span className="font-semibold text-white">
                  {guestCalcCount}/{GUEST_LIMIT} calculs utilisés.
                </span>{' '}
                <span className="text-gray-400">Inscrivez-vous pour accéder à </span>
                <span className="text-[#6366F1] font-semibold">10 calculs par jour</span>
                <span className="text-gray-400"> gratuitement.</span>
              </p>
            </div>
            <button
              onClick={() => navigate('/signup')}
              className="flex-shrink-0 px-4 py-1.5 bg-[#6366F1] text-white text-sm font-medium rounded-lg hover:bg-[#4F52E0] transition"
            >
              S'inscrire
            </button>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-8">
          {/* Panneau gauche - Formulaire */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <CalculatorIcon className="text-green-500" size={32} />
                <div>
                  <h1 className="text-2xl font-bold text-white">Position Sizing</h1>
                  <p className="text-gray-400">Calculez la taille idéale de vos positions</p>
                </div>
              </div>
              {isGuest ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-gray-600 to-gray-700 text-white">
                  VISITEUR
                </span>
              ) : (
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPlanColor(userPlan)} text-white`}>
                  {getPlanName(userPlan)}
                </span>
              )}
            </div>

            {/* Sélecteur de Type d'Actif */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Type d'Actif</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAssetType('crypto')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${assetType === 'crypto'
                      ? 'bg-green-500/20 border border-green-500 text-green-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >Crypto</button>
                <button
                  onClick={() => setAssetType('stocks')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${assetType === 'stocks'
                      ? 'bg-blue-500/20 border border-blue-500 text-blue-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >Actions</button>
                <button
                  onClick={() => setAssetType('forex')}
                  className={`flex-1 py-3 rounded-lg font-medium transition ${assetType === 'forex'
                      ? 'bg-purple-500/20 border border-purple-500 text-purple-400'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >Forex</button>
              </div>
            </div>

            {/* Capital */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Capital Total ($)</label>
              <input
                type="text" value={capital} onChange={handleNumberInput(setCapital)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="10000"
              />
            </div>

            {/* Sélecteur de paire */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">
                {assetType === 'crypto' ? 'Crypto-monnaie' : assetType === 'stocks' ? 'Action' : 'Paire'}
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availablePairs.slice(0, 6).map((pair) => (
                  <button
                    key={pair.value} onClick={() => setSelectedSymbol(pair.value)}
                    className={`p-2 rounded-lg border transition text-sm ${selectedSymbol === pair.value
                        ? 'bg-green-500/20 border-green-500 text-white'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:bg-gray-700'
                      }`}
                  >{pair.value}</button>
                ))}
              </div>
            </div>

            {/* Risque */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Risque par Trade (%)</label>
              <input
                type="text" value={riskPercent} onChange={handleNumberInput(setRiskPercent)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="2"
              />
              <p className="text-xs text-gray-500 mt-1">Recommandé: 1-2%</p>
            </div>

            {/* Prix d'entrée */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Prix d'Entrée ($)</label>
              <div className="flex gap-2">
                <input
                  type="text" value={entryPrice} onChange={handleNumberInput(setEntryPrice)}
                  className="flex-1 bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                  placeholder="50000"
                />
                <button
                  onClick={() => livePrice && setEntryPrice(livePrice.toString())}
                  disabled={!livePrice}
                  className="px-4 py-3 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 rounded-lg text-white"
                >Live</button>
              </div>
              {livePrice && (
                <p className="text-xs text-green-400 mt-1">💰 Prix: ${livePrice.toLocaleString()}</p>
              )}
            </div>

            {/* Stop Loss */}
            <div className="mb-4">
              <label className="block text-red-400 mb-2 font-medium">Stop Loss ($)</label>
              <input
                type="text" value={stopLoss} onChange={handleNumberInput(setStopLoss)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-red-500/30 focus:border-red-500 focus:outline-none"
                placeholder="48000"
              />
            </div>

            {/* Take Profit */}
            <div className="mb-4">
              <label className="block text-green-400 mb-2 font-medium">Take Profit ($)</label>
              <input
                type="text" value={takeProfit} onChange={handleNumberInput(setTakeProfit)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-green-500/30 focus:border-green-500 focus:outline-none"
                placeholder="55000"
              />
            </div>

            {/* Leverage */}
            <div className="mb-4">
              <label className="block text-gray-300 mb-2 font-medium">Leverage (x)</label>
              <input
                type="text" value={leverage} onChange={handleNumberInput(setLeverage)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="1"
              />
            </div>

            {/* Frais */}
            <div className="mb-6">
              <label className="block text-gray-300 mb-2 font-medium">Frais (%)</label>
              <input
                type="text" value={fees} onChange={handleNumberInput(setFees)}
                className="w-full bg-gray-800/50 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none"
                placeholder="0.1"
              />
            </div>

            {/* Boutons Exemples */}
            <div className="flex gap-3 mb-4">
              <button onClick={() => loadExample('btc')} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition text-sm">
                Exemple BTC
              </button>
              <button onClick={() => loadExample('eth')} className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition text-sm">
                Exemple ETH
              </button>
            </div>

            {/* Boutons navigation */}
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/PnLCalculator')}
                className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
              >
                <DollarSign size={16} /> P&L
              </button>
              {isAuthenticated && (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition flex items-center justify-center gap-2"
                >
                  <BarChart3 size={16} /> Dashboard
                </button>
              )}
            </div>
          </div>

          {/* Panneau droit - Résultats */}
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6 relative">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <BarChart3 className="text-green-500" />
              Résultats
              {/* Compteur guest en haut à droite */}
              {isGuest && (
                <span className={`ml-auto text-xs font-medium px-2.5 py-1 rounded-full ${guestCalcCount >= GUEST_LIMIT
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : 'bg-gray-800 text-gray-400'
                  }`}>
                  {guestCalcCount}/{GUEST_LIMIT} calculs
                </span>
              )}
            </h2>

            {results && !showGuestBanner ? (
              <div className="space-y-6">
                {/* Taille position */}
                <div className="bg-green-900/20 border border-green-500/30 rounded-xl p-6">
                  <p className="text-sm text-gray-400 mb-1">Taille de Position</p>
                  <p className="text-4xl font-bold text-white">
                    ${results.positionSizeWithLeverage.toLocaleString()}
                  </p>
                  <p className="text-sm text-green-400 mt-2">{results.quantity.toFixed(6)} unités</p>
                </div>

                {/* Grille risques/profits */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Risque</p>
                    <p className="text-xl font-bold text-white">${results.riskAmount.toFixed(2)}</p>
                    <p className="text-xs text-red-400">{results.stopDistancePercent.toFixed(2)}% SL</p>
                  </div>
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <p className="text-xs text-gray-400 mb-1">Profit</p>
                    <p className="text-xl font-bold text-white">${results.potentialProfit.toFixed(2)}</p>
                    <p className="text-xs text-green-400">{results.tpDistancePercent.toFixed(2)}% TP</p>
                  </div>
                </div>

                {/* R:R Ratio */}
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Risk/Reward Ratio</span>
                    <span className={`text-2xl font-bold ${results.rrRatio >= 2 ? 'text-green-400' :
                        results.rrRatio >= 1 ? 'text-yellow-400' : 'text-red-400'
                      }`}>1:{results.rrRatio.toFixed(2)}</span>
                  </div>
                </div>

                {/* Détails */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-800/30 rounded p-3">
                    <p className="text-gray-500">Marge</p>
                    <p className="text-white">${results.marginRequired.toFixed(2)}</p>
                  </div>
                  <div className="bg-gray-800/30 rounded p-3">
                    <p className="text-gray-500">Frais</p>
                    <p className="text-orange-400">${results.totalFees.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ) : !showGuestBanner ? (
              <div className="text-center py-12">
                <CalculatorIcon className="text-gray-600 mx-auto mb-4" size={48} />
                <p className="text-gray-400">Remplissez les champs à gauche</p>
                <p className="text-sm text-gray-500 mt-2">pour voir les résultats</p>
              </div>
            ) : null}

            {/* ─── BANNER LIMITE GUEST (overlay) ─── */}
            {showGuestBanner && (
              <div className="absolute inset-0 flex items-center justify-center rounded-xl overflow-hidden">
                {/* Fond flouté derrière le banner */}
                {results && (
                  <div className="absolute inset-0 backdrop-blur-sm bg-black/60 rounded-xl" />
                )}
                <div className="relative z-10 mx-4 w-full max-w-sm bg-[#131517] border border-[#6366F1]/40 rounded-2xl p-7 shadow-2xl shadow-[#6366F1]/10">
                  {/* Icône */}
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-[#6366F1]/10 border border-[#6366F1]/30 flex items-center justify-center">
                      <Shield className="text-[#6366F1]" size={28} />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white text-center mb-2">
                    Limite de calculs atteinte
                  </h3>
                  <p className="text-sm text-gray-400 text-center mb-1">
                    Vous avez utilisé vos <span className="text-white font-semibold">{GUEST_LIMIT} calculs gratuits</span> du jour.
                  </p>
                  <p className="text-sm text-center mb-6">
                    <span className="text-[#6366F1] font-semibold">Inscrivez-vous gratuitement</span>
                    <span className="text-gray-400"> pour accéder à </span>
                    <span className="text-white font-bold">10 calculs par jour</span>
                    <span className="text-gray-400"> 🚀</span>
                  </p>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/signup')}
                      className="w-full py-3 bg-[#6366F1] hover:bg-[#4F52E0] text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <UserPlus size={18} />
                      S'inscrire gratuitement
                    </button>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-3 bg-transparent border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <LogIn size={18} />
                      Se connecter
                    </button>
                  </div>

                  <p className="text-xs text-gray-600 text-center mt-4">
                    ✓ Gratuit · ✓ Sans carte bancaire · ✓ 10 calculs/jour
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}