import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Upload, Loader, AlertCircle, ArrowLeft, TrendingUp } from 'lucide-react';

export default function ChartAnalysis() {
    const navigate = useNavigate();
    const { user, profile } = useAuth();
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [upgradeLoading, setUpgradeLoading] = useState(false);
    const [upgradeError, setUpgradeError] = useState('');
    const [remaining, setRemaining] = useState(null);
    const [isDragging, setIsDragging] = useState(false);

    // Récupérer le nombre d'analyses restantes
    useEffect(() => {
        if (!user) return;
        const fetchRemaining = async () => {
            try {
                const { data } = await supabase
                    .from('usage_logs')
                    .select('count')
                    .eq('user_id', user.id)
                    .eq('tool', 'chart_analysis')
                    .maybeSingle();
                const used = data?.count || 0;
                const limits = { free: 2, pro: 50, elite: 200, ADMIN: 9999 };
                const plan = profile?.subscription_plan?.toLowerCase() || 'free';
                setRemaining(Math.max(0, (limits[plan] || 0) - used));
            } catch (err) {
                console.error('Error fetching remaining credits:', err);
            }
        };
        fetchRemaining();
    }, [user, profile]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelection(file);
        }
    };

    const handleFileSelection = (file) => {
        if (file.size > 5 * 1024 * 1024) {
            setError('L\'image doit faire moins de 5 Mo.');
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
        setResult(null);
        setError('');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFileSelection(file);
        }
    };

    const compressImage = (file, maxWidth = 800) => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    let width = img.width;
                    let height = img.height;
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg', lastModified: Date.now() }));
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handleSubmit = async () => {
        if (!image) return;
        setLoading(true);
        setError('');
        try {
            const compressedImage = await compressImage(image);
            const formData = new FormData();
            formData.append('chart', compressedImage);
            // Race condition pour éviter le chargement infini si Supabase/réseau bloque
            const sessionPromise = supabase.auth.getSession();
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Le serveur met trop de temps à répondre (Timeout). Réessayez.')), 30000)
            );

            const { data: { session } } = await Promise.race([sessionPromise, timeoutPromise]);
            const token = session?.access_token;

            // Note the endpoint path points to /api/chart-analysis/analyze
            const res = await fetch('http://localhost:3002/api/chart-analysis/analyze', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Erreur inconnue');

            setResult(data.analysis);
            // Mettre à jour le compteur local (sauf pour ELITE/ADMIN si illimité, mais -1 c'est OK pour affichage)
            setRemaining(prev => prev - 1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleUpgrade = async () => {
        setUpgradeLoading(true);
        setUpgradeError('');
        try {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;

            const res = await fetch('http://localhost:3002/api/payment/upgrade-plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ plan: 'ELITE', billingInterval: 'monthly' })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || data.message || 'Erreur inconnue lors de la mise à niveau');

            // Recharger la page ou rediriger pour refléter le nouveau plan
            window.location.reload();
        } catch (err) {
            setUpgradeError(err.message);
        } finally {
            setUpgradeLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0B0D]">
            {/* Header */}
            <header className="bg-[#131517] border-b border-[#1E1F23] sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/dashboard')}
                                className="p-2 hover:bg-[#1E1F23] rounded-lg transition"
                            >
                                <ArrowLeft className="text-gray-400" size={20} />
                            </button>
                            <h1 className="text-xl font-bold text-white">Analyse de graphique par IA</h1>
                        </div>
                    </div>
                </div>
            </header>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Indicateur de crédits */}
                {remaining !== null && (
                    <div className="bg-[#131517] border border-[#1E1F23] rounded-lg p-4 mb-6 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#6366F1]/10 rounded-lg">
                                <TrendingUp className="text-[#6366F1]" size={20} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-400">Analyses restantes ce mois-ci</p>
                                <p className="text-2xl font-bold text-white">{(profile?.subscription_plan === 'ELITE' || profile?.subscription_plan === 'ADMIN') ? 'Illimité' : remaining}</p>
                            </div>
                        </div>
                        {profile?.subscription_plan?.toLowerCase() === 'free' && remaining === 0 && (
                            <button
                                onClick={() => navigate('/select-plan')}
                                className="px-4 py-2 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#4F52E0] transition"
                            >
                                Passer à un plan supérieur
                            </button>
                        )}
                        {profile?.subscription_plan === 'PRO' && (
                            <div className="flex flex-col items-end gap-2">
                                <button
                                    onClick={handleUpgrade}
                                    disabled={upgradeLoading}
                                    className="px-4 py-2 bg-gradient-to-r from-purple-600 to-[#6366F1] text-white rounded-lg font-medium hover:from-purple-500 hover:to-[#4F52E0] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {upgradeLoading ? <Loader size={16} className="animate-spin" /> : null}
                                    Passer à ELITE
                                </button>
                                {upgradeError && <p className="text-red-400 text-xs text-right max-w-xs">{upgradeError}</p>}
                            </div>
                        )}
                    </div>
                )}

                {/* Zone d'upload */}
                <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
                    <div
                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${isDragging ? 'border-[#6366F1] bg-[#6366F1]/5' : 'border-[#1E1F23]'}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-80 mx-auto mb-4 rounded" />
                        ) : (
                            <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                        )}
                        <input
                            type="file"
                            accept="image/png, image/jpeg, image/jpg"
                            onChange={handleImageChange}
                            className="hidden"
                            id="chart-upload"
                        />
                        <label
                            htmlFor="chart-upload"
                            className="cursor-pointer bg-[#1E1F23] text-white px-6 py-2 rounded-lg hover:bg-[#2C2D33] transition"
                        >
                            {preview ? "Changer d'image" : "Choisir une image"}
                        </label>
                        <p className="text-gray-500 text-sm mt-2">
                            Formats acceptés : PNG, JPG, JPEG (max 5 Mo)
                        </p>
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2">
                            <AlertCircle className="text-red-400" size={20} />
                            <p className="text-red-400 text-sm">{error}</p>
                        </div>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={!image || loading || (remaining === 0 && profile?.subscription_plan !== 'ELITE' && profile?.subscription_plan !== 'ADMIN')}
                        className="mt-6 w-full py-3 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#4F52E0] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader className="animate-spin" size={18} />
                                <span>Analyse en cours...</span>
                            </>
                        ) : (
                            <span>Analyser le graphique</span>
                        )}
                    </button>
                </div>

                {/* Résultat */}
                {result && (
                    <div className="mt-6 bg-[#131517] border border-[#1E1F23] rounded-xl p-6 shadow-lg shadow-[#6366F1]/5">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="text-[#6366F1]" size={24} />
                            Résultat de l'analyse
                        </h2>

                        {result.raw ? (
                            <p className="text-gray-300 whitespace-pre-wrap">{result.raw}</p>
                        ) : (
                            <div className="space-y-6">
                                {/* Tendance */}
                                <div className="flex items-center justify-between border-b border-[#1E1F23] pb-4">
                                    <span className="text-gray-400 font-medium">Tendance Générale :</span>
                                    <span className={`font-medium px-4 py-1.5 rounded-full text-sm shadow-sm ${result.trend?.toLowerCase().includes('haussi') || result.trend?.toLowerCase().includes('bullish')
                                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                                        : result.trend?.toLowerCase().includes('baissi') || result.trend?.toLowerCase().includes('bearish')
                                            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                            : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                                        }`}>
                                        {result.trend}
                                    </span>
                                </div>

                                {/* Niveaux */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="bg-[#1A1C20] rounded-xl p-4 border border-[#2a2d35]">
                                        <p className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-green-400" />
                                            Supports (Zone d'achat)
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.support_levels && result.support_levels.length > 0 ? result.support_levels.map((level, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-sm border border-green-500/10 font-medium">
                                                    {level}
                                                </span>
                                            )) : <span className="text-gray-500 text-sm italic">Aucun support clair détecté</span>}
                                        </div>
                                    </div>
                                    <div className="bg-[#1A1C20] rounded-xl p-4 border border-[#2a2d35]">
                                        <p className="text-gray-400 text-sm font-medium mb-3 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-red-400" />
                                            Résistances (Zone de vente)
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.resistance_levels && result.resistance_levels.length > 0 ? result.resistance_levels.map((level, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-400 rounded-lg text-sm border border-red-500/10 font-medium">
                                                    {level}
                                                </span>
                                            )) : <span className="text-gray-500 text-sm italic">Aucune résistance claire détectée</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Patterns */}
                                {result.patterns && result.patterns.length > 0 && (
                                    <div>
                                        <p className="text-gray-400 text-sm font-medium mb-3">Patterns chartistes détectés</p>
                                        <div className="flex flex-wrap gap-2">
                                            {result.patterns.map((p, i) => (
                                                <span key={i} className="px-3 py-1.5 bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20 rounded-lg text-sm font-medium">
                                                    {p}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggestion de trade */}
                                {result.trade_suggestion && (
                                    <div className="border border-[#6366F1]/20 bg-gradient-to-br from-[#6366F1]/5 to-transparent rounded-xl p-5 mt-4">
                                        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                            <span className="text-xl">🎯</span> Plan de Trade Suggéré
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <div className="bg-[#131517] p-3 rounded-lg border border-[#1E1F23]">
                                                <p className="text-gray-400 text-xs mb-1">Point d'Entrée</p>
                                                <p className="text-blue-400 font-semibold">{result.trade_suggestion.entry}</p>
                                            </div>
                                            <div className="bg-[#131517] p-3 rounded-lg border border-[#1E1F23]">
                                                <p className="text-gray-400 text-xs mb-1">Stop Loss</p>
                                                <p className="text-red-400 font-semibold">{result.trade_suggestion.stopLoss}</p>
                                            </div>
                                            <div className="bg-[#131517] p-3 rounded-lg border border-[#1E1F23]">
                                                <p className="text-gray-400 text-xs mb-1">Take Profit</p>
                                                <p className="text-green-400 font-semibold">{result.trade_suggestion.takeProfit}</p>
                                            </div>
                                            <div className="bg-[#131517] p-3 rounded-lg border border-[#1E1F23]">
                                                <p className="text-gray-400 text-xs mb-1">Ratio R/R</p>
                                                <p className="text-yellow-400 font-semibold">{result.trade_suggestion.riskReward}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="mt-6 text-xs text-gray-500 border-t border-[#1E1F23] pt-4 flex items-start gap-2">
                            <span className="text-lg">⚠️</span>
                            <p>
                                Cette analyse est générée par une intelligence artificielle
                                et ne constitue pas un conseil financier. Faites toujours vos propres recherches
                                et appliquez un money management strict avant de prendre une position.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
