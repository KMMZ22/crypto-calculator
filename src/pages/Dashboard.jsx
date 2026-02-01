import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, History, Download, Bell, Settings, 
  TrendingUp, Shield, Zap, Clock, User,
  Calendar, DollarSign, PieChart, ChevronRight, LogOut,
  Check, Eye, EyeOff, AlertCircle, ArrowRight, Lock
} from 'lucide-react';
import { supabase } from '../services/supabase';

export default function Dashboard() {
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState('free'); // free, pro, elite
  const [activeTab, setActiveTab] = useState('overview');
  const [tradeHistory, setTradeHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');

  // Plan names matching your auth page
  const planNames = {
    free: 'Gratuit',
    pro: 'PRO',
    elite: 'ELITE'
  };
  
  const planPrices = {
    free: '$0/mois',
    pro: '$19/mois',
    elite: '$49/mois'
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

  // Chargement des données utilisateur
  useEffect(() => {
    const loadUserData = async () => {
      setLoading(true);
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          navigate('/auth');
          return;
        }
        
        setUser(user);
        setUserName(user.user_metadata?.username || user.email?.split('@')[0] || 'Trader');
        
        // Récupérer le plan depuis les métadonnées
        const plan = user.user_metadata?.plan || 'free';
        setUserPlan(plan);
        
        // Charger les données spécifiques au plan
        loadPlanFeatures(plan);
        
        // Charger les statistiques
        await loadUserStats(user.id);
        
        // Charger l'historique des trades
        await loadTradeHistory(user.id);
        
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, [navigate]);

  const loadUserStats = async (userId) => {
    try {
      // Exemple avec des données de démonstration
      setStats({
        totalTrades: 42,
        totalVolume: 125000,
        averageRR: 2.3,
        winRate: 72,
        riskSaved: 3500,
        favoritePair: 'BTC/USDT'
      });
    } catch (error) {
      setStats({
        totalTrades: 0,
        totalVolume: 0,
        averageRR: 0,
        winRate: 0,
        riskSaved: 0,
        favoritePair: 'Aucun'
      });
    }
  };

  const loadTradeHistory = async (userId) => {
    try {
      // Données de démonstration comme dans votre code initial
      setTradeHistory([
        { id: 1, date: '2024-01-23', pair: 'BTC/USDT', size: 5000, profit: 250, rr: 2.5, status: 'win' },
        { id: 2, date: '2024-01-22', pair: 'ETH/USDT', size: 3000, profit: -120, rr: 1.8, status: 'loss' },
        { id: 3, date: '2024-01-21', pair: 'SOL/USDT', size: 1500, profit: 320, rr: 3.2, status: 'win' },
        { id: 4, date: '2024-01-20', pair: 'BTC/USDT', size: 4200, profit: 180, rr: 2.1, status: 'win' },
        { id: 5, date: '2024-01-19', pair: 'ADA/USDT', size: 800, profit: 95, rr: 2.8, status: 'win' },
      ]);
    } catch (error) {
      setTradeHistory([]);
    }
  };

  const loadPlanFeatures = (plan) => {
    const features = {
      free: [
        { icon: <BarChart3 size={20} />, label: '3 positions simultanées', enabled: true },
        { icon: <Zap size={20} />, label: 'Prix manuels', enabled: true },
        { icon: <History size={20} />, label: 'Historique 30 jours', enabled: true },
        { icon: <Download size={20} />, label: 'Export basique', enabled: false },
        { icon: <TrendingUp size={20} />, label: 'Calculateur principal', enabled: true },
        { icon: <Bell size={20} />, label: 'Alertes navigateur', enabled: false },
        { icon: <Shield size={20} />, label: 'Support standard', enabled: false },
      ],
      pro: [
        { icon: <BarChart3 size={20} />, label: '10 positions simultanées', enabled: true },
        { icon: <Zap size={20} />, label: 'Prix live API', enabled: true },
        { icon: <History size={20} />, label: 'Historique 1 an', enabled: true },
        { icon: <Download size={20} />, label: 'Export PDF/CSV', enabled: true },
        { icon: <TrendingUp size={20} />, label: 'Tous calculateurs', enabled: true },
        { icon: <Bell size={20} />, label: 'Alertes email', enabled: true },
        { icon: <Shield size={20} />, label: 'Support prioritaire', enabled: true },
      ],
      elite: [
        { icon: <BarChart3 size={20} />, label: 'Positions illimitées', enabled: true },
        { icon: <Zap size={20} />, label: 'Prix live multi-sources', enabled: true },
        { icon: <History size={20} />, label: 'Historique illimité', enabled: true },
        { icon: <Download size={20} />, label: 'Export automatique', enabled: true },
        { icon: <TrendingUp size={20} />, label: 'Calculateurs avancés', enabled: true },
        { icon: <Bell size={20} />, label: 'Alertes SMS/Email', enabled: true },
        { icon: <Shield size={20} />, label: 'Support 24/7 dédié', enabled: true },
      ]
    };
    
    setFeatures(features[plan] || features.free);
  };

  const [features, setFeatures] = useState([]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Erreur déconnexion:', error);
    }
  };

  const upgradePlan = (newPlan) => {
    navigate(`/auth?plan=${newPlan}`);
  };

  const exportData = async (format) => {
    if (userPlan === 'free') {
      alert('La fonction d\'export est disponible uniquement pour les plans PRO et ELITE');
      return;
    }
    
    try {
      alert(`Export ${format} généré avec succès !`);
    } catch (error) {
      alert('Erreur lors de l\'export');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de votre dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation Top - Même style que l'auth page */}
      <div className="bg-gray-900/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              {/* Logo identique à l'auth page */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Shield className="text-white" size={32} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-black">$€¥</span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-white">TradeGuard</h1>
              </div>
              
              {/* Bouton principal vert comme dans l'auth */}
              <button 
                onClick={() => navigate('/calculator')}
                className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition flex items-center gap-2"
              >
                <span></span>
                Nouveau calcul
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              
              <button className="p-2 hover:bg-gray-800/50 rounded-lg transition">
                <Bell className="text-gray-400 hover:text-white" size={20} />
              </button>
              
              <div className="relative group">
                <button className="flex items-center gap-3 p-2 hover:bg-gray-800/50 rounded-lg transition">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">{userName}</p>
                    <p className="text-xs text-gray-400">{planNames[userPlan]}</p>
                  </div>
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-64 bg-gray-900 border border-gray-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="p-4 border-b border-gray-800">
                    <p className="font-medium text-white">{userName}</p>
                    <p className="text-sm text-gray-400">{user?.email}</p>
                    <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${getPlanColor(userPlan)} text-white`}>
                      {planNames[userPlan]} • {planPrices[userPlan]}
                    </div>
                  </div>
                  <div className="p-2">
                    <button 
                      onClick={() => navigate('/settings')}
                      className="w-full text-left px-3 py-2 text-gray-300 hover:bg-gray-800 rounded flex items-center gap-2"
                    >
                      <Settings size={16} />
                      Paramètres
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-red-400 hover:bg-red-900/20 rounded flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Déconnexion
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-1 mt-6">
            {['overview', 'history', 'analytics', 'calendar'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-white text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab === 'overview' && 'Aperçu'}
                {tab === 'history' && 'Historique'}
                {tab === 'analytics' && 'Analytics'}
                {tab === 'calendar' && 'Calendrier'}
              </button>
            ))}
            
            {/* Onglets réservés aux plans payants */}
            {userPlan !== 'free' && (
              <>
                <button
                  onClick={() => setActiveTab('alerts')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === 'alerts'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Alertes
                </button>
                <button
                  onClick={() => setActiveTab('templates')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                    activeTab === 'templates'
                      ? 'bg-white text-black'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  Templates
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Message d'upgrade pour free users - style cohérent */}
        {userPlan === 'free' && (
          <div className="mb-6 p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white mb-2">🚀 Essayez TradeGuard PRO gratuitement</h3>
                <p className="text-gray-400">
                  Débloquez toutes les fonctionnalités avancées pendant 7 jours sans engagement
                </p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => upgradePlan('pro')}
                  className={`px-6 py-3 ${getPlanColor('pro')} text-white font-bold rounded-lg hover:opacity-90 transition`}
                >
                  Essai gratuit 7 jours
                </button>
                <button 
                  onClick={() => upgradePlan('elite')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition"
                >
                  Voir ELITE
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Header Stats - Style sombre comme l'auth */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-green-500" size={24} />
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-1 rounded">Total</span>
                </div>
                <p className="text-3xl font-bold text-white">${stats?.totalVolume?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-sm">Volume tradé</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="text-emerald-500" size={24} />
                  <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">{stats?.winRate || 0}%</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalTrades || 0}</p>
                <p className="text-gray-400 text-sm">Trades réalisés</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <PieChart className="text-blue-500" size={24} />
                  <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded">Avg</span>
                </div>
                <p className="text-3xl font-bold text-white">1:{stats?.averageRR?.toFixed(1) || '0.0'}</p>
                <p className="text-gray-400 text-sm">Ratio R:R moyen</p>
              </div>

              <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="text-orange-500" size={24} />
                  <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded">Économisé</span>
                </div>
                <p className="text-3xl font-bold text-white">${stats?.riskSaved?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-sm">Risque évité</p>
              </div>
            </div>

        

        {/* Calculateurs Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">🧮 Vos Calculateurs</h2>
              <p className="text-gray-400 text-sm">Outils de calcul pour vos trades</p>
            </div>
            {userPlan !== 'free' && (
              <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-400 text-xs font-semibold">
                Mode Advanced débloqué
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Position Sizing Calculator Card */}
            <button
              onClick={() => navigate('/calculator')}
              className="group bg-gradient-to-br from-green-500/10 to-transparent border border-green-500/30 hover:border-green-500/50 rounded-xl p-6 text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-green-500/20 rounded-xl">
                  <BarChart3 className="text-green-500" size={28} />
                </div>
                <ArrowRight className="text-green-500 opacity-0 group-hover:opacity-100 transition" size={20} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Position Sizing Calculator</h3>
              <p className="text-gray-400 text-sm mb-4">
                Calculez la taille de position optimale basée sur votre capital et votre risque accepté
              </p>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-green-400">
                  <Check size={14} />
                  <span>Risk management</span>
                </div>
                <div className="flex items-center gap-1 text-green-400">
                  <Check size={14} />
                  <span>R:R ratio</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-green-400 font-semibold group-hover:underline">
                  Ouvrir le calculateur →
                </span>
              </div>
            </button>

            {/* P&L Calculator Card */}
            <button
              onClick={() => navigate('/pnl-calculator')}
              className="group bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/30 hover:border-blue-500/50 rounded-xl p-6 text-left transition-all hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/20 rounded-xl">
                  <DollarSign className="text-blue-500" size={28} />
                </div>
                <ArrowRight className="text-blue-500 opacity-0 group-hover:opacity-100 transition" size={20} />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-2">Profit & Loss Calculator</h3>
              <p className="text-gray-400 text-sm mb-4">
                Calculez vos gains/pertes potentiels avec leverage, fees et prix de liquidation
              </p>
              
              <div className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 text-blue-400">
                  <Check size={14} />
                  <span>Long & Short</span>
                </div>
                <div className="flex items-center gap-1 text-blue-400">
                  <Check size={14} />
                  <span>Leverage 1-100x</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-800">
                <span className="text-blue-400 font-semibold group-hover:underline">
                  Ouvrir le calculateur →
                </span>
              </div>
            </button>
          </div>

          {/* Advanced Calculator Banner - PRO/ELITE only */}
          {userPlan !== 'free' ? (
            <button
              onClick={() => navigate('/advanced-calculator')}
              className="group w-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/40 hover:border-purple-500/60 rounded-xl p-6 transition-all hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl">
                    <Zap className="text-white" size={32} />
                  </div>
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-2xl font-bold text-white">Mode Advanced</h3>
                      <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white text-xs font-bold">
                        {userPlan === 'elite' ? 'ELITE' : 'PRO'}
                      </div>
                    </div>
                    <p className="text-gray-300 mb-2">
                      Les 2 calculateurs synchronisés sur un seul écran
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-purple-400">
                        <Zap size={14} />
                        <span>Calculs automatiques</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-400">
                        <Zap size={14} />
                        <span>Workflow optimisé</span>
                      </div>
                      <div className="flex items-center gap-1 text-purple-400">
                        <Zap size={14} />
                        <span>Vue d'ensemble</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-400 font-semibold group-hover:underline">
                    Ouvrir Advanced →
                  </span>
                  <ArrowRight className="text-purple-400" size={24} />
                </div>
              </div>
            </button>
          ) : (
            /* Upgrade CTA for free users */
            <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gray-800 rounded-xl opacity-50">
                    <Lock className="text-gray-600" size={32} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-white mb-2">Mode Advanced</h3>
                    <p className="text-gray-400 text-sm mb-3">
                      Débloquez les 2 calculateurs synchronisés sur un seul écran
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => upgradePlan('pro')}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
                      >
                        Passer à PRO - $19/mois
                      </button>
                      <button
                        onClick={() => upgradePlan('elite')}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm font-bold rounded-lg hover:opacity-90 transition"
                      >
                        Passer à ELITE - $49/mois
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
            {/* Features Grid */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">✨ Vos Features {planNames[userPlan]}</h2>
                
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className={`flex items-center gap-3 p-4 rounded-lg border transition ${
                    feature.enabled 
                      ? 'bg-gray-800/30 border-green-500/20' 
                      : 'bg-gray-900/50 border-gray-700'
                  }`}>
                    <div className={`p-2 rounded-lg ${feature.enabled ? 'bg-green-500/20 text-green-500' : 'bg-gray-800 text-gray-400'}`}>
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{feature.label}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400">
                          {feature.enabled ? '✅ Actif' : '🔒 Verrouillé'}
                        </p>
                        {!feature.enabled && userPlan === 'free' && (
                          <span className="text-xs text-green-400 font-medium">PRO+</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">📊 Derniers Trades</h2>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-white hover:text-gray-300 text-sm flex items-center gap-1"
                >
                  Voir tout <ChevronRight size={16} />
                </button>
              </div>
              
              {tradeHistory.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">Aucun trade enregistré</p>
                  <button 
                    onClick={() => navigate('/calculator')}
                    className="px-4 py-2 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition"
                  >
                    Créer votre premier trade
                  </button>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Pair</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Taille</th>
                          <th className="text-left py-3 text-gray-400 font-medium">Profit</th>
                          <th className="text-left py-3 text-gray-400 font-medium">R:R</th>
                          {userPlan !== 'free' && (
                            <th className="text-left py-3 text-gray-400 font-medium">Actions</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {tradeHistory.map((trade) => (
                          <tr key={trade.id} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                            <td className="py-3 text-gray-300">{trade.date}</td>
                            <td className="py-3 font-medium text-white">{trade.pair}</td>
                            <td className="py-3 text-gray-300">${trade.size?.toLocaleString() || '0'}</td>
                            <td className={`py-3 font-bold ${trade.profit > 0 ? 'text-green-500' : 'text-red-500'}`}>
                              ${trade.profit > 0 ? '+' : ''}{trade.profit || 0}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded text-xs ${
                                trade.rr >= 2 ? 'bg-green-500/20 text-green-400' :
                                trade.rr >= 1 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                1:{trade.rr?.toFixed(1) || '0.0'}
                              </span>
                            </td>
                            {userPlan !== 'free' && (
                              <td className="py-3">
                                <button className="text-green-500 hover:text-green-400 text-sm">
                                  Recalculer
                                </button>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Export Buttons */}
                  <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
                    <button 
                      onClick={() => exportData('PDF')}
                      disabled={userPlan === 'free'}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
                        userPlan === 'free'
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-400'
                      }`}
                    >
                      <Download size={16} />
                      Export PDF
                    </button>
                    <button 
                      onClick={() => exportData('CSV')}
                      disabled={userPlan === 'free'}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
                        userPlan === 'free'
                          ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                          : 'bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 text-green-400'
                      }`}
                    >
                      <Download size={16} />
                      Export CSV
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* Upgrade Banner pour free users */}
            {userPlan === 'free' && (
              <div className="bg-gradient-to-r from-gray-900 to-black border border-gray-800 rounded-xl p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-3">🚀 Prêt à passer au niveau supérieur ?</h3>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Avec TradeGuard PRO, bénéficiez de prix live, d'export automatique, d'alertes email 
                    et d'un support prioritaire pour optimiser vos trades.
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {/* Carte PRO */}
                  <div className="bg-gray-900/50 border border-green-500/30 rounded-xl p-6">
                    <div className={`inline-flex items-center gap-2 px-4 py-2 ${getPlanColor('pro')} rounded-full text-white text-sm font-semibold mb-4`}>
                      Plan PRO • $19/mois
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">Idéal pour les traders actifs</h4>
                    <ul className="space-y-3 mb-6">
                      {features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Check size={16} className="text-green-500" />
                          <span className="text-gray-300">{feature.label}</span>
                        </li>
                      ))}
                    </ul>
                    <button 
                      onClick={() => upgradePlan('pro')}
                      className={`w-full py-3 ${getPlanColor('pro')} text-white font-bold rounded-lg hover:opacity-90 transition`}
                    >
                      Choisir PRO
                    </button>
                  </div>
                  
                  {/* Carte ELITE */}
                  <div className="bg-gray-900/50 border border-purple-500/30 rounded-xl p-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full text-white text-sm font-semibold mb-4">
                      Plan ELITE • $49/mois
                    </div>
                    <h4 className="text-xl font-bold text-white mb-4">Pour les traders professionnels</h4>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-purple-500" />
                        <span className="text-gray-300">Toutes les features PRO</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-purple-500" />
                        <span className="text-gray-300">Alertes SMS + Email</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-purple-500" />
                        <span className="text-gray-300">Support 24/7 dédié</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check size={16} className="text-purple-500" />
                        <span className="text-gray-300">Analytics avancés</span>
                      </li>
                    </ul>
                    <button 
                      onClick={() => upgradePlan('elite')}
                      className="w-full py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-lg hover:opacity-90 transition"
                    >
                      Choisir ELITE
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Les autres onglets avec le même style */}
        {activeTab === 'history' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">📜 Historique Complet</h2>
            {userPlan === 'free' ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">L'historique illimité est une fonctionnalité PRO</p>
                <button 
                  onClick={() => upgradePlan('pro')}
                  className={`px-4 py-2 ${getPlanColor('pro')} text-white font-semibold rounded-lg hover:opacity-90 transition`}
                >
                  Débloquer l'historique complet
                </button>
              </div>
            ) : (
              <p className="text-gray-400">Historique complet de vos trades...</p>
            )}
          </div>
        )}
        {/* NOUVEAU ONGLET : Calendrier Économique */}
{activeTab === 'calendar' && (
  <div className="space-y-6">
    {/* En-tête avec filtres */}
    <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">📅 Calendrier Économique</h2>
          <p className="text-gray-400">
            Suivez les événements majeurs impactant les marchés
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* Fuseau horaire */}
          <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-2 rounded-lg">
            <span className="text-gray-400 text-sm">Fuseau:</span>
            <select className="bg-transparent text-white text-sm focus:outline-none">
              <option>GMT+1 (Paris)</option>
              <option>GMT-5 (NYC)</option>
              <option>GMT+0 (London)</option>
              <option>GMT+8 (Hong Kong)</option>
            </select>
          </div>
          
          {/* Filtre d'impact */}
          <div className="flex gap-2">
            <button className="px-3 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg text-red-400 text-sm">
              🔴 High
            </button>
            <button className="px-3 py-2 bg-orange-500/20 hover:bg-orange-500/30 border border-orange-500/30 rounded-lg text-orange-400 text-sm">
              🟠 Medium
            </button>
            <button className="px-3 py-2 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-sm">
              🟢 Low
            </button>
          </div>
        </div>
      </div>

      {/* Tableau du calendrier */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="text-left py-3 text-gray-400 font-medium">Date</th>
              <th className="text-left py-3 text-gray-400 font-medium">Heure</th>
              <th className="text-left py-3 text-gray-400 font-medium">Événement</th>
              <th className="text-left py-3 text-gray-400 font-medium">Devise</th>
              <th className="text-left py-3 text-gray-400 font-medium">Impact</th>
              <th className="text-left py-3 text-gray-400 font-medium">Prévision</th>
              <th className="text-left py-3 text-gray-400 font-medium">Réel</th>
              <th className="text-left py-3 text-gray-400 font-medium">Alertes</th>
            </tr>
          </thead>
          <tbody>
            {/* Exemple d'événements - À remplacer par des données réelles d'API */}
            {[
              { 
                date: '28 Jan', 
                time: '14:45', 
                event: 'BoC Interest Rate Decision', 
                currency: 'CAD', 
                impact: 'high', 
                forecast: '2.25%', 
                actual: '2.25%',
                alert: true 
              },
              { 
                date: '28 Jan', 
                time: '19:00', 
                event: 'Fed Interest Rate Decision', 
                currency: 'USD', 
                impact: 'high', 
                forecast: '3.75%', 
                actual: '3.75%',
                alert: true 
              },
              { 
                date: '29 Jan', 
                time: '10:00', 
                event: 'GDP Growth Rate QoQ (Q4)', 
                currency: 'EUR', 
                impact: 'medium', 
                forecast: '0.2%', 
                actual: null,
                alert: false 
              },
              { 
                date: '29 Jan', 
                time: '10:00', 
                event: 'Unemployment Rate (Dec)', 
                currency: 'EUR', 
                impact: 'high', 
                forecast: '8.1%', 
                actual: null,
                alert: true 
              },
              { 
                date: '29 Jan', 
                time: '14:30', 
                event: 'Initial Jobless Claims', 
                currency: 'USD', 
                impact: 'medium', 
                forecast: '210K', 
                actual: null,
                alert: false 
              },
            ].map((event, index) => (
              <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30">
                <td className="py-3 text-gray-300">{event.date}</td>
                <td className="py-3 text-gray-300">{event.time}</td>
                <td className="py-3 font-medium text-white">{event.event}</td>
                <td className="py-3">
                  <span className="px-2 py-1 bg-gray-800 rounded text-sm">{event.currency}</span>
                </td>
                <td className="py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    event.impact === 'high' ? 'bg-red-500/20 text-red-400' :
                    event.impact === 'medium' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {event.impact === 'high' ? '🔴 High' : 
                     event.impact === 'medium' ? '🟠 Medium' : '🟢 Low'}
                  </span>
                </td>
                <td className="py-3 text-gray-300">{event.forecast}</td>
                <td className="py-3">
                  {event.actual ? (
                    <span className={`font-bold ${
                      parseFloat(event.actual) > parseFloat(event.forecast) ? 'text-green-400' :
                      parseFloat(event.actual) < parseFloat(event.forecast) ? 'text-red-400' :
                      'text-gray-300'
                    }`}>
                      {event.actual}
                    </span>
                  ) : (
                    <span className="text-gray-500">-</span>
                  )}
                </td>
                <td className="py-3">
                  <button className={`p-1 rounded ${
                    event.alert 
                      ? 'text-green-400 hover:text-green-300' 
                      : 'text-gray-600 hover:text-gray-400'
                  }`}>
                    🔔
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Note sur les données */}
      <div className="mt-6 pt-6 border-t border-gray-800">
        <p className="text-sm text-gray-500">
          ⚡ Données en temps réel. Les événements à impact élevé peuvent causer une forte volatilité.
          {userPlan === 'free' && (
            <span className="text-green-400 ml-2">
              Passez à PRO pour les alertes personnalisées et plus de filtres.
            </span>
          )}
        </p>
      </div>
    </div>

    {/* Section "Pour les traders crypto" */}
    <div className="bg-gradient-to-r from-green-900/20 to-gray-900/50 border border-green-500/30 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white mb-4">📊 Événements Clés pour les Traders Crypto</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-bold text-green-400 mb-3">Événements Macro</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>Décisions de taux (FED, ECB) → Impact BTC</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-400 rounded-full"></div>
              <span>CPI Inflation US → Volatilité globale</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span>NFP (Non-Farm Payrolls) → Sentiment risque</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-purple-400 mb-3">Événements Crypto</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Bitcoin Halving (Avril 2024)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Mises à jour réseau majeures (Ethereum)</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Rapports de sociétés liées (MicroStrategy)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
)}

        {activeTab === 'alerts' && userPlan !== 'free' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">🔔 Alertes Email</h2>
            <p className="text-gray-400">Configurez vos alertes - fonctionnalité {planNames[userPlan]}</p>
          </div>
        )}

        {activeTab === 'templates' && userPlan !== 'free' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">📋 Templates de Trading</h2>
            <p className="text-gray-400">Gérez vos templates - fonctionnalité {planNames[userPlan]}</p>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">📈 Analytics Avancés</h2>
            {userPlan === 'free' ? (
              <div className="text-center py-8">
                <p className="text-gray-400 mb-4">Les analytics avancés sont une fonctionnalité PRO</p>
                <button 
                  onClick={() => upgradePlan('pro')}
                  className={`px-4 py-2 ${getPlanColor('pro')} text-white font-semibold rounded-lg hover:opacity-90 transition`}
                >
                  Débloquer les analytics
                </button>
              </div>
            ) : (
              <p className="text-gray-400">Analytics détaillés de vos performances...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}