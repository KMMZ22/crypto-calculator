// src/pages/Chart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUsage } from '../hooks/useUsage';
import TradingChart from '../components/TradingChart';
import { ArrowLeft, AlertCircle, RefreshCw, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

const SYMBOLS = [
    { label: 'BTC/USDT', value: 'BTCUSDT' },
    { label: 'ETH/USDT', value: 'ETHUSDT' },
    { label: 'BNB/USDT', value: 'BNBUSDT' },
    { label: 'SOL/USDT', value: 'SOLUSDT' },
    { label: 'XRP/USDT', value: 'XRPUSDT' },
    { label: 'ADA/USDT', value: 'ADAUSDT' },
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

export default function Chart() {
    const navigate = useNavigate();
    const { user, isPro, isElite } = useAuth();
    const { remaining, loading: usageLoading, incrementUsage } = useUsage('chart');
    const [canAccess, setCanAccess] = useState(false);
    const [showLimitMessage, setShowLimitMessage] = useState(false);
    const [timeframe, setTimeframe] = useState('1D');
    const [indicator, setIndicator] = useState('none');
    const [showVolume, setShowVolume] = useState(true);
    const [symbol, setSymbol] = useState('BTCUSDT');
    const [chartData, setChartData] = useState([]);
    const [loadingChart, setLoadingChart] = useState(false);
    const [chartError, setChartError] = useState(null);
    const usageIncremented = useRef(false);

    useEffect(() => {
        if (!usageLoading) {
            if (remaining === Infinity || remaining > 0) {
                setCanAccess(true);
            } else {
                setCanAccess(false);
                setShowLimitMessage(true);
            }
        }
    }, [remaining, usageLoading]);

    useEffect(() => {
        // Compter uniquement les guests, pas les utilisateurs connectés
        const { isGuest } = { isGuest: remaining !== Infinity };
        if (canAccess && remaining !== Infinity && !usageIncremented.current) {
            usageIncremented.current = true;
            incrementUsage();
        }
    }, [canAccess]);

    // Fetch real Binance data whenever symbol or timeframe changes
    useEffect(() => {
        if (!canAccess) return;
        fetchKlines();
    }, [symbol, timeframe, canAccess]);

    const fetchKlines = async () => {
        setLoadingChart(true);
        setChartError(null);
        try {
            const res = await fetch(
                `${API_URL}/api/price/klines?symbol=${symbol}&interval=${timeframe}&limit=200`
            );
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            if (json.success && json.candles?.length) {
                setChartData(json.candles);
            } else {
                throw new Error('No data returned');
            }
        } catch (err) {
            console.error('Klines fetch error:', err);
            setChartError('Impossible de charger les données Binance.');
        } finally {
            setLoadingChart(false);
        }
    };

    if (usageLoading) return (
        <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
            <div className="text-gray-400 text-sm">Chargement...</div>
        </div>
    );

    if (!canAccess && showLimitMessage) return (
        <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
            <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-8 max-w-md text-center">
                <AlertCircle className="text-[#6366F1] mx-auto mb-4" size={40} />
                <h2 className="text-white text-xl font-bold mb-2">Limite journalière atteinte</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Vous avez utilisé vos 10 analyses gratuites d'aujourd'hui.
                    Créez un compte gratuit pour un accès illimité.
                </p>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate('/register')}
                        className="bg-[#6366F1] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#4F51D8] transition"
                    >
                        Créer un compte gratuit
                    </button>
                    <button
                        onClick={() => navigate('/login')}
                        className="text-[#6366F1] text-sm hover:text-[#8183F4] transition"
                    >
                        J'ai déjà un compte
                    </button>
                </div>
            </div>
        </div>
    );

    // Bannière quota : uniquement pour les guests (utilisateurs non connectés)
    const showQuotaBanner = remaining !== null && remaining !== Infinity;

    return (
        <div className="min-h-screen bg-[#0A0B0D]">
            {/* Header */}
            <header className="bg-[#131517] border-b border-[#1E1F23] sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-[#1E1F23] rounded-lg transition">
                                <ArrowLeft className="text-gray-400" size={20} />
                            </button>
                            <h1 className="text-xl font-bold text-white">Analyse technique</h1>
                            {isPro && <span className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs rounded-full border border-[#6366F1]/20">PRO</span>}
                            {isElite && <span className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs rounded-full border border-[#6366F1]/20">ELITE</span>}
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Symbol selector */}
                            <select
                                value={symbol}
                                onChange={(e) => setSymbol(e.target.value)}
                                className="bg-[#1A1C20] border border-[#1E1F23] rounded-lg px-3 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                            >
                                {SYMBOLS.map(s => (
                                    <option key={s.value} value={s.value}>{s.label}</option>
                                ))}
                            </select>
                            {/* Timeframe selector */}
                            <div className="flex bg-[#1A1C20] rounded-lg p-1">
                                {['1H', '4H', '1D', '1W', '1M'].map(tf => (
                                    <button
                                        key={tf}
                                        onClick={() => setTimeframe(tf)}
                                        className={`px-3 py-1.5 text-sm font-medium rounded-md transition ${timeframe === tf ? 'bg-[#6366F1] text-white' : 'text-gray-400 hover:text-white'}`}
                                    >
                                        {tf}
                                    </button>
                                ))}
                            </div>
                            <button onClick={fetchKlines} className="p-2 hover:bg-[#1E1F23] rounded-lg transition" title="Rafraîchir">
                                <RefreshCw className={`text-gray-400 ${loadingChart ? 'animate-spin' : ''}`} size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {showQuotaBanner && (
                <div className="bg-[#1E1F23] border-b border-[#2C2D33] py-2">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-300">
                                <span className="font-medium text-[#6366F1]">{remaining}</span> analyse{remaining > 1 ? 's' : ''} restante{remaining > 1 ? 's' : ''}.
                            </p>
                            <button onClick={() => navigate('/SelectPlan')} className="text-xs text-[#6366F1] hover:text-[#8183F4] font-medium">
                                Passer en illimité →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Indicator toolbar */}
                <div className="bg-[#131517] border border-[#1E1F23] rounded-lg p-4 mb-6">
                    <div className="flex flex-wrap items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Activity className="text-gray-400" size={18} />
                            <span className="text-sm text-gray-400">Indicateurs:</span>
                            <select
                                value={indicator}
                                onChange={(e) => setIndicator(e.target.value)}
                                className="bg-[#1A1C20] border border-[#1E1F23] rounded-lg px-3 py-1.5 text-sm text-white focus:border-[#6366F1] focus:outline-none"
                            >
                                <option value="none">Aucun</option>
                                <option value="ema">EMA (20 / 50)</option>
                                <option value="rsi">RSI</option>
                                <option value="macd">MACD</option>
                                <option value="bb">Bollinger Bands</option>
                            </select>
                        </div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showVolume}
                                onChange={(e) => setShowVolume(e.target.checked)}
                                className="w-4 h-4 text-[#6366F1] bg-[#1A1C20] border-[#1E1F23] rounded focus:ring-[#6366F1]"
                            />
                            <span className="text-sm text-gray-400">Volume</span>
                        </label>
                        {/* Live data badge */}
                        <div className="ml-auto flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs text-green-400 font-medium">Binance Live</span>
                        </div>
                    </div>
                </div>

                {/* Chart area */}
                <div className="bg-[#131517] border border-[#1E1F23] rounded-lg p-4">
                    {chartError ? (
                        <div className="flex flex-col items-center justify-center h-[600px] gap-4">
                            <AlertCircle className="text-red-400" size={36} />
                            <p className="text-gray-400 text-sm">{chartError}</p>
                            <button
                                onClick={fetchKlines}
                                className="bg-[#6366F1] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#4F51D8] transition"
                            >
                                Réessayer
                            </button>
                        </div>
                    ) : loadingChart || !chartData.length ? (
                        <div className="flex items-center justify-center h-[600px]">
                            <div className="flex flex-col items-center gap-3">
                                <RefreshCw className="text-[#6366F1] animate-spin" size={28} />
                                <p className="text-gray-400 text-sm">Chargement des données Binance...</p>
                            </div>
                        </div>
                    ) : (
                        <TradingChart
                            data={chartData}
                            height={600}
                            showVolume={showVolume}
                            indicator={indicator}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}