import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Check, TrendingUp, BarChart3, Lock, Zap, ChevronDown, Star, AlertCircle } from 'lucide-react';

export default function TradeGuardLanding() {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const screenInterval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 3);
    }, 6500);
    return () => clearInterval(screenInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleAuth = () => {
    navigate('/login'); // ← CORRIGÉ pour le bouton "Connexion"
  };

  const handleSignup = (plan) => {
    if (plan && plan !== 'free') {
      navigate('/signup?plan=' + plan.toLowerCase());
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation améliorée avec effet au scroll */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 backdrop-blur-xl border-b border-gray-800' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Shield className="text-white" size={24} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-black">$€¥</span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight">TradeGuard</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#features" className="text-gray-400 hover:text-white transition">Fonctionnalités</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition">Tarifs</a>
              <a href="#testimonials" className="text-gray-400 hover:text-white transition">Témoignages</a>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleAuth}
                className="px-5 py-2 text-gray-400 text-sm font-medium hover:text-white transition"
              >
                Connexion
              </button>
              <div className="w-px h-4 bg-gray-800"></div>
              <button 
                onClick={handleAuth}
                className="px-5 py-2 bg-white text-black text-sm font-medium rounded hover:bg-gray-100 transition"
              >
                Inscription
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Ultra Clean avec animations au chargement */}
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-900 rounded-full mb-8 text-xs text-gray-400 animate-[fadeIn_0.5s_ease-out]">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Utilisé par 500+ traders
            </div>

            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-none animate-[fadeIn_0.6s_ease-out_0.1s_both]">
              Maîtrisez votre risque.<br/>
              <span className="text-gray-500">Tradez avec discipline.</span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl animate-[fadeIn_0.7s_ease-out_0.2s_both]">
              Le calculateur de position qui vous empêche de prendre des décisions émotionnelles. 
              Calcul instantané, feedback visuel, risque sous contrôle.
            </p>

            <button 
              onClick={() => handleSignup('FREE')}
              className="group px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 w-full sm:w-auto animate-[fadeIn_0.8s_ease-out_0.3s_both]"
            >
              Essayer gratuitement
              <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
            </button>

            <div className="flex items-center gap-6 mt-8 text-sm text-gray-500 animate-[fadeIn_0.9s_ease-out_0.4s_both]">
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Gratuit sans limite de temps
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                Pas de carte bancaire
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenshots améliorés avec transitions plus fluides */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl" style={{ minHeight: '600px' }}>
            {/* Dashboard Screenshot */}
            <div 
              className={`absolute inset-0 transition-all duration-[1.1s] ease-in-out ${
                activeScreen === 0 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="p-8 lg:p-12 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Shield className="text-white" size={24} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-black">$€¥</span>
                      </div>
                    </div>
                    <span className="font-bold text-lg">TradeGuard Dashboard</span>
                    <span className="px-2 py-1 bg-blue-600 text-xs font-bold rounded">PRO</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                    <div className="text-xs text-gray-500 mb-2">Volume tradé</div>
                    <div className="font-mono text-2xl font-bold">$125,000</div>
                  </div>
                  <div className="bg-black/50 border border-green-500/20 rounded-xl p-4 hover:border-green-500/30 transition">
                    <div className="text-xs text-gray-500 mb-2">Trades réalisés</div>
                    <div className="font-mono text-2xl font-bold text-green-500">42</div>
                  </div>
                  <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                    <div className="text-xs text-gray-500 mb-2">R:R moyen</div>
                    <div className="font-mono text-2xl font-bold">1:2.3</div>
                  </div>
                  <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                    <div className="text-xs text-gray-500 mb-2">Win rate</div>
                    <div className="font-mono text-2xl font-bold text-green-500">72%</div>
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-xl p-6 flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Derniers trades</span>
                    <span className="text-xs text-gray-500">5 sur 42</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { pair: 'BTC/USDT', profit: '+$250', color: 'text-green-500' },
                      { pair: 'ETH/USDT', profit: '-$120', color: 'text-red-500' },
                      { pair: 'SOL/USDT', profit: '+$320', color: 'text-green-500' },
                      { pair: 'BTC/USDT', profit: '+$180', color: 'text-green-500' },
                      { pair: 'ADA/USDT', profit: '+$95', color: 'text-green-500' }
                    ].map((trade, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-0">
                        <span className="font-mono text-sm">{trade.pair}</span>
                        <span className={`font-mono text-sm font-bold ${trade.color}`}>{trade.profit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Position Calculator Screenshot */}
            <div 
              className={`absolute inset-0 transition-all duration-[1.1s] ease-in-out ${
                activeScreen === 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="p-8 lg:p-12 h-full">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Shield className="text-white" size={24} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-black">$€¥</span>
                      </div>
                    </div>
                    <span className="font-bold text-lg">Position Calculator</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                      <div className="text-xs text-gray-500 mb-2">Capital Total</div>
                      <div className="bg-gray-900 rounded px-3 py-2 font-mono">$10,000</div>
                    </div>
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                      <div className="text-xs text-gray-500 mb-2">Risque par Trade</div>
                      <div className="bg-gray-900 rounded px-3 py-2 font-mono">2%</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                        <div className="text-xs text-gray-500 mb-2">Entrée</div>
                        <div className="bg-gray-900 rounded px-3 py-2 font-mono text-sm">$50,000</div>
                      </div>
                      <div className="bg-black/50 border border-red-500/20 rounded-xl p-4 hover:border-red-500/30 transition">
                        <div className="text-xs text-red-400 mb-2">Stop Loss</div>
                        <div className="bg-gray-900 rounded px-3 py-2 font-mono text-sm text-red-500">$48,000</div>
                      </div>
                    </div>
                    <div className="bg-black/50 border border-green-500/20 rounded-xl p-4 hover:border-green-500/30 transition">
                      <div className="text-xs text-green-400 mb-2">Take Profit</div>
                      <div className="bg-gray-900 rounded px-3 py-2 font-mono">$55,000</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 rounded-xl p-6 hover:border-green-500/40 transition">
                      <div className="text-xs text-green-400 mb-2">Position Calculée</div>
                      <div className="font-mono text-4xl font-bold mb-1">$5,000</div>
                      <div className="text-sm text-gray-400">0.100000 unités</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 hover:border-red-500/30 transition">
                        <div className="text-xs text-red-400 mb-1">Risque</div>
                        <div className="font-mono text-xl font-bold text-red-500">$200</div>
                        <div className="text-xs text-gray-500 mt-1">4.00% SL</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 hover:border-green-500/30 transition">
                        <div className="text-xs text-green-400 mb-1">Profit Potentiel</div>
                        <div className="font-mono text-xl font-bold text-green-500">$500</div>
                        <div className="text-xs text-gray-500 mt-1">10.00% TP</div>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Risk/Reward Ratio</span>
                        <span className="font-mono text-xl font-bold text-green-500">1:2.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* PnL Calculator Screenshot */}
            <div 
              className={`absolute inset-0 transition-all duration-[1.1s] ease-in-out ${
                activeScreen === 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="p-8 lg:p-12 h-full">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Shield className="text-white" size={24} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[8px] font-bold text-black">$€¥</span>
                      </div>
                    </div>
                    <span className="font-bold text-lg">PnL Calculator</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                      <div className="text-xs text-gray-500 mb-2">Prix d'entrée</div>
                      <div className="bg-gray-900 rounded px-3 py-2 font-mono">$50,000</div>
                    </div>
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                      <div className="text-xs text-gray-500 mb-2">Prix de sortie</div>
                      <div className="bg-gray-900 rounded px-3 py-2 font-mono text-green-500">$52,500</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                        <div className="text-xs text-gray-500 mb-2">Taille position</div>
                        <div className="bg-gray-900 rounded px-3 py-2 font-mono text-sm">$5,000</div>
                      </div>
                      <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                        <div className="text-xs text-gray-500 mb-2">Levier</div>
                        <div className="bg-gray-900 rounded px-3 py-2 font-mono text-sm">5x</div>
                      </div>
                    </div>
                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                      <div className="text-xs text-gray-500 mb-2">Type</div>
                      <div className="text-sm font-medium text-green-500">Long</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/30 rounded-xl p-6 hover:border-green-500/40 transition">
                      <div className="text-xs text-green-400 mb-2">P&L Net</div>
                      <div className="font-mono text-4xl font-bold text-green-500 mb-1">+$235.50</div>
                      <div className="text-sm text-gray-400">après frais 0.1%</div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 hover:border-green-500/30 transition">
                        <div className="text-xs text-green-400 mb-1">ROI</div>
                        <div className="font-mono text-xl font-bold text-green-500">+4.71%</div>
                      </div>
                      <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition">
                        <div className="text-xs text-gray-500 mb-1">Frais totaux</div>
                        <div className="font-mono text-lg font-bold text-gray-400">$14.50</div>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Variation prix</span>
                        <span className="font-mono text-lg font-bold text-green-500">+5.00%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Indicateurs de navigation améliorés */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                onClick={() => setActiveScreen(0)}
                className={`h-2 rounded-full transition-all ${
                  activeScreen === 0 ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label="Voir le dashboard"
              />
              <button
                onClick={() => setActiveScreen(1)}
                className={`h-2 rounded-full transition-all ${
                  activeScreen === 1 ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label="Voir le calculateur de position"
              />
              <button
                onClick={() => setActiveScreen(2)}
                className={`h-2 rounded-full transition-all ${
                  activeScreen === 2 ? 'w-8 bg-white' : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label="Voir le calculateur PnL"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Le Problème - Amélioré avec icônes personnalisées */}
      <section className="px-6 py-24 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Le problème</h2>
          <p className="text-3xl lg:text-4xl font-bold mb-12 leading-tight">
            Un seul trade mal dimensionné peut effacer<br/>
            <span className="text-red-500">des semaines de profits</span>
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-red-500/20 transition group">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="text-red-500" size={20} />
                <div className="text-red-500 font-bold">Position trop grosse</div>
              </div>
              <p className="text-sm text-gray-400">
                Vous prenez 10% de risque sur un trade par émotion. Liquidé en quelques heures.
              </p>
            </div>
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-red-500/20 transition group">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="text-red-500" size={20} />
                <div className="text-red-500 font-bold">Calculs manuels</div>
              </div>
              <p className="text-sm text-gray-400">
                Excel, calculatrice, erreurs de frappe. Vous perdez 5 minutes par trade.
              </p>
            </div>
            <div className="p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-red-500/20 transition group">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="text-red-500" size={20} />
                <div className="text-red-500 font-bold">Pas de discipline</div>
              </div>
              <p className="text-sm text-gray-400">
                Sans système, vous tradez à l'instinct. Le marché vous punira.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - Bento Grid amélioré */}
      <section id="features" className="px-6 py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-16">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Fonctionnalités</h2>
            <p className="text-4xl lg:text-5xl font-bold leading-tight">
              Tout ce dont vous avez besoin.<br/>
              <span className="text-gray-500">Rien de superflu.</span>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-8 bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/20 rounded-2xl hover:border-green-500/30 transition group">
              <BarChart3 className="text-green-500 mb-4 group-hover:scale-110 transition" size={32} />
              <h3 className="text-2xl font-bold mb-3">Calcul instantané</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Entrez vos paramètres, obtenez votre taille de position en temps réel. 
                Risque, R:R, liquidation — tout est calculé automatiquement.
              </p>
              <div className="inline-flex items-center gap-2 text-sm text-green-500 font-medium">
                Cœur du produit
                <ArrowRight size={16} className="group-hover:translate-x-1 transition" />
              </div>
            </div>

            <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition group">
              <TrendingUp className="text-white mb-4 group-hover:scale-110 transition" size={28} />
              <h3 className="text-xl font-bold mb-3">Multi-positions</h3>
              <p className="text-gray-400 text-sm">
                Gérez jusqu'à 10 trades simultanément. Voyez votre exposition totale.
              </p>
            </div>

            <div className="p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition group">
              <Zap className="text-yellow-500 mb-4 group-hover:scale-110 transition" size={28} />
              <h3 className="text-xl font-bold mb-3">Prix en direct</h3>
              <p className="text-gray-400 text-sm">
                API Binance, Bybit, Coinbase. Les prix se mettent à jour automatiquement.
              </p>
            </div>

            <div className="lg:col-span-2 p-8 bg-gray-900 border border-gray-800 rounded-2xl hover:border-gray-700 transition group">
              <Lock className="text-gray-400 mb-4 group-hover:scale-110 transition" size={28} />
              <h3 className="text-2xl font-bold mb-3">100% sécurisé</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                Aucune connexion à vos exchanges. Aucune clé API stockée. 
                Vos calculs restent privés. Hébergement EU conforme RGPD.
              </p>
              <div className="flex gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  Encryption SSL
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  RGPD compliant
                </div>
                <div className="flex items-center gap-2">
                  <Check size={14} className="text-green-500" />
                  Données anonymisées
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Amélioré avec indicateur populaire plus visible */}
            {/* Pricing - Discret et élégant */}
      <section id="pricing" className="px-6 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Tarifs</h2>
            <p className="text-4xl font-bold">Simple et transparent</p>
            <p className="text-gray-500 mt-2">Paiement en euros • Facture disponible</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">Gratuit</div>
                <div className="font-mono text-4xl font-bold">0€</div>
                <div className="text-sm text-gray-500">/mois</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">1 position simultanée</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Calculs basiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">R:R calculator</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Historique 30 jours</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSignup('FREE')}
                className="w-full py-3 border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-gray-900 transition font-medium"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 bg-white text-black rounded-2xl relative transform hover:scale-105 transition">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                POPULAIRE
              </div>
              <div className="mb-8">
                <div className="text-sm text-gray-600 mb-2">Pro</div>
                <div className="font-mono text-4xl font-bold">19€</div>
                <div className="text-sm text-gray-600">/mois</div>
                <div className="text-sm text-green-600 font-medium mt-1">
                  Soit 0.63€ par jour
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>10 positions simultanées</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prix live API (Binance, Bybit)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Historique illimité</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Export PDF/CSV</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Support prioritaire email</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Stratégies avancées</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSignup('PRO')}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium"
              >
                Choisir Pro • 14 jours gratuits
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Annulation à tout moment
              </p>
            </div>

            {/* Elite */}
            <div className="p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">Elite</div>
                <div className="font-mono text-4xl font-bold">49€</div>
                <div className="text-sm text-gray-500">/mois</div>
                <div className="text-sm text-blue-500 font-medium mt-1">
                  -20% en annuel (470€)
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Tout Pro +</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Positions illimitées</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">AI Trade Advisor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">API access (1000 req/jour)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Support VIP Discord 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Backtests avancés</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSignup('ELITE')}
                className="w-full py-3 border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-gray-900 transition font-medium"
              >
                Choisir Elite • 14 jours gratuits
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Facture professionnelle disponible
              </p>
            </div>
          </div>

          {/* Note sur les prix */}
          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              <strong>Paiement sécurisé :</strong> Stripe • Cartes bancaires • Virement SEPA<br/>
              <strong>Garantie :</strong> 14 jours satisfait ou remboursé • TVA française incluse<br/>
              <strong>Support :</strong> support@tradeguard.app • Discord communautaire
            </p>
          </div>
        </div>
      </section>
      {/* Testimonials */}
      <section id="testimonials" className="px-6 py-24 bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4 text-center">Témoignages</h2>
          <p className="text-4xl font-bold text-center mb-16">
            Ce que disent nos traders
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marc D.",
                role: "Day Trader BTC",
                text: "Depuis que j'utilise TradeGuard, je n'ai plus jamais été liquidé. Le calculateur de position m'a sauvé 10,000€ en 1 mois.",
                rating: 5
              },
              {
                name: "Sarah K.",
                role: "Swing Trader",
                text: "L'AI advisor m'a empêché d'entrer dans 3 trades foireux hier. Best 19€/mois que je dépense.",
                rating: 5
              },
              {
                name: "Alex M.",
                role: "Trader professionnel",
                text: "Enfin un outil qui comprend vraiment le crypto. La gestion multi-positions est indispensable.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-yellow-500" size={16} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 text-sm italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold text-sm">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-6 py-24">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4 text-center">Questions fréquentes</h2>
          <p className="text-4xl font-bold text-center mb-12">
            Tout ce que vous devez savoir
          </p>

          <div className="space-y-4">
            {[
              {
                question: "Comment fonctionne le calculateur de position ?",
                answer: "Le calculateur prend en compte votre capital total, le pourcentage de risque par trade, et les prix d'entrée, stop loss et take profit pour déterminer la taille de position optimale qui respecte vos règles de gestion de risque."
              },
              {
                question: "Mes données sont-elles sécurisées ?",
                answer: "Absolument. Nous ne stockons aucune clé API d'exchange. Tous les calculs sont effectués localement dans votre navigateur. Nous utilisons un chiffrement SSL et nos serveurs sont conformes RGPD."
              },
              {
                question: "Puis-je utiliser TradeGuard sur mobile ?",
                answer: "Oui, l'interface est entièrement responsive et optimisée pour mobile. Vous pouvez calculer vos positions directement depuis votre smartphone."
              },
              {
                question: "Quelle est la différence entre les plans ?",
                answer: "Le plan gratuit permet de gérer 1 position à la fois avec les fonctionnalités de base. Le plan Pro ajoute 10 positions simultanées, les prix en temps réel et l'historique. Le plan Elite offre des positions illimitées, l'AI Advisor et l'accès API."
              },
              {
                question: "Puis-je changer de plan à tout moment ?",
                answer: "Oui, vous pouvez améliorer ou réduire votre plan à tout moment depuis votre tableau de bord. Les changements prennent effet immédiatement."
              },
              {
                question: "Y a-t-il un essai gratuit pour les plans payants ?",
                answer: "Tous les plans payants incluent une période d'essai de 14 jours. Vous pouvez annuler à tout moment sans engagement."
              }
            ].map((item, index) => (
              <div key={index} className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition">
                <button
                  className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-900 transition"
                  onClick={() => toggleFaq(index)}
                  aria-expanded={faqOpen === index}
                >
                  <span className="font-medium pr-4">{item.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`text-gray-500 transition-transform flex-shrink-0 ${faqOpen === index ? 'rotate-180' : ''}`}
                  />
                </button>
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ${
                    faqOpen === index ? 'max-h-96 pb-6' : 'max-h-0'
                  }`}
                >
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Choix de plan - avant le footer */}
      <section className="px-6 py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Choisissez votre plan</h2>
            <p className="text-4xl font-bold">Simple et transparent</p>
            <p className="text-gray-500 mt-2">Paiement en euros • Facture disponible</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">Gratuit</div>
                <div className="font-mono text-4xl font-bold">0€</div>
                <div className="text-sm text-gray-500">/mois</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">1 position simultanée</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Calculs basiques</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">R:R calculator</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Historique 30 jours</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSignup('FREE')}
                className="w-full py-3 border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-gray-900 transition font-medium"
              >
                Commencer gratuitement
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 bg-white text-black rounded-2xl relative transform hover:scale-105 transition">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                POPULAIRE
              </div>
              <div className="mb-8">
                <div className="text-sm text-gray-600 mb-2">Pro</div>
                <div className="font-mono text-4xl font-bold">19€</div>
                <div className="text-sm text-gray-600">/mois</div>
                <div className="text-sm text-green-600 font-medium mt-1">
                  ou 175€/an
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>10 positions simultanées</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Prix live API (Binance, Bybit)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Historique illimité</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Export PDF/CSV</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Support prioritaire email</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Stratégies avancées</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSignup('PRO')}
                className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium"
              >
                Choisir Pro
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Annulation à tout moment
              </p>
            </div>

            {/* Elite */}
            <div className="p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">Elite</div>
                <div className="font-mono text-4xl font-bold">49€</div>
                <div className="text-sm text-gray-500">/mois</div>
                <div className="text-sm text-blue-500 font-medium mt-1">
                  -20% en annuel (470€)
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Tout Pro +</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Positions illimitées</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">AI Trade Advisor</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">API access (1000 req/jour)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Support VIP Discord 24/7</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">Backtests avancés</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSignup('ELITE')}
                className="w-full py-3 border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-gray-900 transition font-medium"
              >
                Choisir Elite
              </button>
              <p className="text-xs text-gray-500 text-center mt-3">
                Facture professionnelle disponible
              </p>
            </div>
          </div>

          <div className="text-center mt-12 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm">
              <strong>Paiement sécurisé :</strong> Stripe • Cartes bancaires • Virement SEPA<br/>
              <strong>Garantie :</strong> Satisfait ou remboursé • TVA française incluse<br/>
              <strong>Support :</strong> support@tradeguard.app • Discord communautaire
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-6 md:mb-0">
              <div className="relative">
                <Shield className="text-white" size={24} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[8px] font-bold text-black">$€¥</span>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight">TradeGuard</span>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm text-gray-500 mb-6 md:mb-0">
              <a href="#features" className="hover:text-white transition">Fonctionnalités</a>
              <a href="#pricing" className="hover:text-white transition">Tarifs</a>
              <a href="mailto:support@tradeguard.app" className="hover:text-white transition">Contact</a>
              <a href="/terms" className="hover:text-white transition">Conditions d'utilisation</a>
              <a href="/privacy" className="hover:text-white transition">Confidentialité</a>
              <a href="https://discord.gg/tradeguard" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Support</a>
            </div>

            <div className="text-xs text-gray-600">
              © {new Date().getFullYear()} TradeGuard. Tous droits réservés.
            </div>
          </div>

          <div className="text-center mt-8 pt-8 border-t border-gray-900 text-xs text-gray-600">
            <p className="mb-2">
              Trading sur marge comporte des risques significatifs. TradeGuard ne fournit pas de conseils financiers.
            </p>
            <p>
              Les performances passées ne préjugent pas des résultats futurs. Tradez responsablement.
            </p>
            <p className="mt-4 text-gray-500">
              TradeGuard n'est pas affilié à Binance, Bybit, Coinbase ou tout autre exchange.
            </p>
          </div>
        </div>
      </footer>

      {/* Animations CSS */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}