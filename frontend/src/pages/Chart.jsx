// src/pages/Chart.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUsage } from '../hooks/useUsage';
import TradingChart from '../components/TradingChart';
import { ArrowLeft, AlertCircle } from 'lucide-react';

export default function Chart() {
    const navigate = useNavigate();
    const { isPro, isElite } = useAuth();
    const { remaining, loading: usageLoading, incrementUsage } = useUsage('chart');
    const [canAccess, setCanAccess] = useState(false);
    const [showLimitMessage, setShowLimitMessage] = useState(false);
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
        // Increment guest usage if they visit the page and have requests remaining
        if (canAccess && remaining !== Infinity && !usageIncremented.current) {
            usageIncremented.current = true;
            incrementUsage();
        }
    }, [canAccess]);

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
                        onClick={() => navigate('/signup')}
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

    const showQuotaBanner = remaining !== null && remaining !== Infinity;

    return (
        <div className="min-h-screen bg-[#0A0B0D] flex flex-col">
            {/* Header */}
            <header className="bg-[#131517] border-b border-[#1E1F23] sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-[#1E1F23] rounded-lg transition">
                                <ArrowLeft className="text-gray-400" size={20} />
                            </button>
                            <h1 className="text-xl font-bold text-white">Analyse technique</h1>
                            {isPro && <span className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs rounded-full border border-[#6366F1]/20">PRO</span>}
                            {isElite && <span className="px-2 py-1 bg-[#6366F1]/10 text-[#6366F1] text-xs rounded-full border border-[#6366F1]/20">ELITE</span>}
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
                            <button onClick={() => navigate('/select-plan')} className="text-xs text-[#6366F1] hover:text-[#8183F4] font-medium">
                                Passer en illimité →
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TradingView Chart Area - Full height */}
            <div className="flex-1 w-full bg-[#131517] p-4 text-center">
                 {/* Le widget est dimensionné via height dans TradingChart */}
                <TradingChart symbol="BTCUSDT" height="calc(100vh - 120px)" />
            </div>
        </div>
    );
}