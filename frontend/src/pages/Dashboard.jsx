// src/pages/Dashboard.jsx - VERSION AVEC LOGS DE PERFORMANCE
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  BarChart3, History, Download, Bell, Settings,
  TrendingUp, Shield, Zap, Clock, User,
  Calendar, DollarSign, PieChart, ChevronRight, LogOut,
  AlertCircle, Menu, X, Calculator, ArrowRight, ChevronDown, LineChart, Camera
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import EconomicCalendar from '../components/calendar/EconomicCalendar';
import CalculatorsMenu from '../components/CalculatorsMenu';
import PnLChart from '../components/charts/PnLchart';
import WinLossChart from '../components/charts/WinLossChart';
import PairPerformance from '../components/charts/PairPerformance';

export default function Dashboard() {
  console.log('🚀 Dashboard monté'); // LOG 1

  const navigate = useNavigate();
  const { user, loading: authLoading, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [trades, setTrades] = useState([]);
  const [allTradesCount, setAllTradesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('resume');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  // =====================================================
  // INITIALISATION DU DASHBOARD
  // =====================================================
  useEffect(() => {
    let cancelled = false;

    const initDashboard = async () => {
      // Attendre que l'AuthContext ait fini de charger
      if (authLoading) return;

      if (!user) {
        console.log('👤 Aucun utilisateur → mode visiteur (guest)');
        if (!cancelled) setLoading(false);
        return;
      }

      console.log('✅ Utilisateur connecté:', user.email);
      try {
        await loadUserData(user.id);
      } catch (err) {
        console.error('❌ Erreur dashboard init:', err);
      }
    };

    initDashboard();

    return () => {
      cancelled = true;
    };
  }, [user, authLoading]);

  // =====================================================
  // DÉFINITION DE loadTradesWithLimit AVANT loadUserData
  // =====================================================
  const loadTradesWithLimit = async (userId, profileData) => {
    console.time('⏱️ loadTradesWithLimit');

    // Récupérer le plan depuis profileData passé en paramètre (pas depuis le state React, qui n'est pas encore mis à jour)
    const userPlan = profileData?.subscription_plan || 'free';
    const isPro = userPlan === 'pro';
    const isElite = userPlan === 'elite';

    let query = supabase
      .from('trades')
      .select('id, symbol, entry_price, exit_price, profit_loss, status, rr_ratio, entry_at, position_size_usd')
      .eq('user_id', userId)
      .order('entry_at', { ascending: false })
      .limit(100);

    if (!isElite && !isPro) {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte('entry_at', sevenDaysAgo.toISOString());
    } else if (isPro) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      query = query.gte('entry_at', oneMonthAgo.toISOString());
    } else if (isElite) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      query = query.gte('entry_at', sixMonthsAgo.toISOString());
    }

    const { data } = await query;
    console.timeEnd('⏱️ loadTradesWithLimit');
    return data || [];
  };

  // =====================================================
  // CHARGER LES DONNÉES (PROFIL, TRADES, CRÉDITS) - AVEC LOGS DE PERFORMANCE
  // =====================================================
  const loadUserData = async (userId) => {
    console.log('🚀 DÉBUT loadUserData');
    console.time('⏱️ CHARGEMENT TOTAL');

    try {
      setLoading(true);

      // Profil : sélectionner uniquement les champs nécessaires
      console.log('📥 Chargement du profil...');
      console.time('⏱️ Profil');
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id, username, subscription_plan, capital, email')
        .eq('id', userId)
        .maybeSingle();
      console.timeEnd('⏱️ Profil');

      if (profileError) {
        console.error('❌ Erreur profil détaillée:', profileError);
      } else {
        console.log('✅ Profil reçu:', profileData);
      }
      setProfile(profileData || { subscription_plan: 'free' });

      // Trades : utiliser la fonction loadTradesWithLimit
      console.log('📥 Chargement des trades...');
      console.time('⏱️ Trades');
      // On passe profileData directement pour éviter le problème de stale closure avec le state React
      const tradesData = await loadTradesWithLimit(userId, profileData || { subscription_plan: 'free' });
      console.timeEnd('⏱️ Trades');
      console.log(`✅ ${tradesData?.length || 0} trades chargés`);
      setTrades(tradesData || []);
      setAllTradesCount(tradesData?.length || 0);

      // Crédits : sélectionner seulement credits_remaining
      console.log('📥 Chargement des crédits IA...');
      console.time('⏱️ Crédits');
      const { data: credits, error: creditsError } = await supabase
        .from('ai_credits')
        .select('credits_remaining')
        .eq('user_id', userId)
        .maybeSingle();
      console.timeEnd('⏱️ Crédits');

      if (creditsError) {
        console.error('❌ Erreur crédits détaillée:', creditsError);
      } else {
        console.log('✅ Crédits reçus:', credits);
      }

      // Calcul des statistiques à partir des tradesData
      console.log('📊 Calcul des statistiques...');
      console.time('⏱️ Calcul stats');

      const winningTrades = tradesData?.filter(t => t.status === 'win').length || 0;
      const losingTrades = tradesData?.filter(t => t.status === 'loss').length || 0;
      const totalPnl = tradesData?.reduce((sum, t) => sum + (parseFloat(t.profit_loss) || 0), 0) || 0;
      const avgRr = tradesData?.filter(t => t.rr_ratio).reduce((sum, t) => sum + (parseFloat(t.rr_ratio) || 0), 0) / (tradesData?.filter(t => t.rr_ratio).length || 1);

      setStats({
        total_trades: tradesData?.length || 0,
        winning_trades: winningTrades,
        losing_trades: losingTrades,
        win_rate: tradesData?.length ? (winningTrades / tradesData.length) * 100 : 0,
        total_pnl: totalPnl,
        avg_rr_ratio: avgRr || 0,
        ai_credits: credits?.credits_remaining || 0,
        trades_this_month: tradesData?.filter(t => {
          const date = new Date(t.entry_at);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length || 0,
        pnl_this_month: tradesData?.filter(t => {
          const date = new Date(t.entry_at);
          const now = new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).reduce((sum, t) => sum + (parseFloat(t.profit_loss) || 0), 0) || 0
      });

      console.timeEnd('⏱️ Calcul stats');
      console.log('✅ Toutes les données chargées');

    } catch (error) {
      console.error('❌ Erreur CATASTROPHIQUE dans loadUserData:', error);
    } finally {
      console.log('🏁 finally - setLoading(false)');
      console.timeEnd('⏱️ CHARGEMENT TOTAL');
      setLoading(false);
    }
  };

  // =====================================================
  // DÉTECTION DU PLAN (dépend de profile, défini après loadUserData)
  // =====================================================
  const isPro = profile?.subscription_plan === 'pro';
  const isElite = profile?.subscription_plan === 'elite';

  const getHistoricalPeriod = () => {
    if (isElite) return '6 mois';
    if (isPro) return '1 mois';
    return '7 jours';
  };

  // =====================================================
  // DÉCONNEXION
  // =====================================================
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('❌ Erreur déconnexion:', error);
    }
  };

  // =====================================================
  // SUPPRESSION COMPTE
  // =====================================================
  const handleDeleteAccount = async () => {
    if (!user) return;
    if (!window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;
    try {
      setLoading(true);
      await supabase.from('trades').delete().eq('user_id', user.id);
      await supabase.from('ai_credits').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // EXPORT CSV
  // =====================================================
  const exportData = async (format) => {
    try {
      if (!user) return;
      if (format === 'CSV' && !isPro && !isElite) {
        alert("L'export CSV est réservé aux abonnés PRO et Elite");
        return;
      }
      if (format === 'PDF' && !isElite) {
        alert('Export PDF disponible uniquement pour les membres Elite');
        return;
      }
      let query = supabase
        .from('trades')
        .select('*')
        .eq('user_id', user.id)
        .order('entry_at', { ascending: false });

      if (isPro) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        query = query.gte('entry_at', oneMonthAgo.toISOString());
      } else if (isElite) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        query = query.gte('entry_at', sixMonthsAgo.toISOString());
      }

      const { data: exportTrades } = await query;
      if (!exportTrades?.length) {
        alert('Aucun trade à exporter');
        return;
      }

      if (format === 'CSV') {
        const headers = ['Date', 'Paire', 'Entrée', 'Sortie', 'Taille', 'R:R', 'Profit', 'Statut'];
        const rows = exportTrades.map(t => [
          new Date(t.entry_at).toLocaleDateString('fr-FR'),
          t.symbol,
          t.entry_price,
          t.exit_price || '-',
          t.position_size_usd || '-',
          t.rr_ratio ? `1:${t.rr_ratio}` : '-',
          t.profit_loss || 0,
          t.status
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('❌ Erreur export:', error);
    }
  };

  const hiddenTradesCount = Math.max(0, allTradesCount - trades.length);
  const filteredTrades = trades.filter(trade => {
    const matchesSearch = searchTerm === '' ||
      trade.symbol?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || trade.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  console.log('📊 Render, loading =', loading); // LOG 18

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6366F1] mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Chargement de votre dashboard...</p>
          <p className="text-gray-500 text-sm mt-2">(Si cela persiste, vérifiez la console)</p>
        </div>
      </div>
    );
  }
  // =====================================================
  // RENDU PRINCIPAL
  // =====================================================
  const isGuest = !user;

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* ── Banner visiteur (sticky sous le header) ── */}
      {isGuest && (
        <div className="bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 border-b border-[#6366F1]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-sm">
              <span className="text-2xl">👋</span>
              <p className="text-gray-300">
                Vous consultez le dashboard en mode <span className="text-white font-semibold">visiteur</span>.
                {' '}<span className="text-gray-400">Créez un compte pour sauvegarder vos trades et accéder à toutes les fonctionnalités.</span>
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Link
                to="/login"
                className="px-4 py-1.5 text-sm text-gray-300 border border-gray-700 rounded-lg hover:border-gray-500 hover:text-white transition"
              >
                Connexion
              </Link>
              <Link
                to="/signup"
                className="px-4 py-1.5 text-sm font-semibold bg-[#6366F1] text-white rounded-lg hover:bg-[#4F52E0] transition"
              >
                Créer un compte gratuit →
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[#1E1F23] bg-[#0A0B0D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo + Navigation */}
            <div className="flex items-center gap-6">
              <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:opacity-80 transition">
                <Shield className="text-[#6366F1]" size={32} />
                <span className="text-xl font-bold text-white">TradeGuard</span>
              </button>

              <button
                onClick={() => setActiveTab('resume')}
                className={`px-3 py-2 rounded-lg transition ${activeTab === 'resume' ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'text-gray-400 hover:text-white'
                  }`}
              >
                Dashboard
              </button>

              <CalculatorsMenu />

              <button
                onClick={() => navigate('/chart')}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white transition rounded-lg hover:bg-[#1E1F23]"
              >
                Graphique Live
              </button>

              <button
                onClick={() => navigate('/chart-analysis')}
                className="px-3 py-2 text-sm text-gray-400 hover:text-white transition rounded-lg hover:bg-[#1E1F23] flex items-center gap-1"
              >
                Analyse IA <span className="text-[10px] bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-1.5 py-0.5 rounded text-white font-bold tracking-wider ml-1">PRO+</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-3 py-2 rounded-lg transition ${activeTab === 'calendar' ? 'bg-[#6366F1]/10 text-[#6366F1]' : 'text-gray-400 hover:text-white'
                  }`}
              >
                Calendrier
              </button>
            </div>

            {/* Menu profil — ou boutons guest */}
            <div className="relative">
              {isGuest ? (
                // ── Visiteur non connecté ──
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm text-gray-400 hover:text-white border border-gray-700 rounded-lg hover:border-gray-500 transition"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-semibold bg-[#6366F1] text-white rounded-lg hover:bg-[#4F52E0] transition"
                  >
                    S'inscrire
                  </Link>
                </div>
              ) : (
                // ── Utilisateur connecté ──
                <>
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-[#1E1F23] transition group"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {profile?.username?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-white">{profile?.username || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-400">{profile?.subscription_plan?.toUpperCase() || 'FREE'}</p>
                    </div>
                    <ChevronRight size={16} className={`text-gray-400 transition ${isProfileMenuOpen ? 'rotate-90' : ''}`} />
                  </button>

                  {isProfileMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileMenuOpen(false)} />
                      <div className="absolute right-0 mt-2 w-72 bg-[#131517] border border-[#1E1F23] rounded-xl shadow-2xl z-50">
                        <div className="p-4 border-b border-[#1E1F23]">
                          <p className="font-medium text-white">{profile?.username || 'Utilisateur'}</p>
                          <p className="text-sm text-gray-400 mt-1">{user?.email}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${isElite ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                              isPro ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                                'bg-[#1E1F23] text-gray-400 border border-gray-700'
                              }`}>
                              {profile?.subscription_plan?.toUpperCase() || 'FREE'}
                            </span>
                            <span className="text-xs text-gray-500">{getHistoricalPeriod()} d'historique</span>
                          </div>
                        </div>
                        <div className="p-2">
                          <button onClick={() => navigate('/settings')} className="w-full px-3 py-2 text-left text-sm text-gray-300 hover:text-white hover:bg-[#1E1F23] rounded-lg transition flex items-center gap-2">
                            <Settings size={16} /> Paramètres
                          </button>
                          <button onClick={handleLogout} className="w-full px-3 py-2 text-left text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition flex items-center gap-2">
                            <LogOut size={16} /> Déconnexion
                          </button>
                          <button onClick={handleDeleteAccount} className="w-full px-3 py-2 text-left text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition flex items-center gap-2">
                            <AlertCircle size={16} /> Supprimer le compte
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

          </div>

          {/* Tabs */}
          <div className="flex gap-1">
            {[
              { id: 'resume', label: '📊 Résumé' },
              { id: 'historique', label: '📋 Historique' },
              { id: 'analyses', label: '📈 Analyses' },
              ...(isElite ? [{ id: 'ai', label: '🤖 IA Advisor' }] : []),
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-3 text-sm font-medium transition rounded-t-lg ${activeTab === tab.id
                  ? 'text-[#6366F1] border-b-2 border-[#6366F1] bg-[#6366F1]/5'
                  : 'text-gray-400 hover:text-gray-300'
                  }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ===== ONGLET RÉSUMÉ ===== */}
        {activeTab === 'resume' && (
          <div className="space-y-8">
            {/* Stats cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Profit total</p>
                  <span className="text-xs text-[#6366F1] bg-[#6366F1]/10 px-2 py-1 rounded">Total</span>
                </div>
                <p className={`text-3xl font-bold ${(stats?.total_pnl || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(stats?.total_pnl || 0) > 0 ? '+' : ''}{stats?.total_pnl?.toLocaleString() || '0'}€
                </p>
              </div>

              <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Trades</p>
                  <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded">
                    {stats?.win_rate?.toFixed(1) || 0}%
                  </span>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.total_trades || 0}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats?.winning_trades || 0} wins / {stats?.losing_trades || 0} losses
                </p>
              </div>

              <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">Ratio R:R</p>
                  <span className="text-xs text-purple-400 bg-purple-400/10 px-2 py-1 rounded">Moyen</span>
                </div>
                <p className="text-3xl font-bold text-white">1:{stats?.avg_rr_ratio?.toFixed(1) || '0.0'}</p>
              </div>

              <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm text-gray-400">PnL mensuel</p>
                  <span className="text-xs text-orange-400 bg-orange-400/10 px-2 py-1 rounded">Ce mois</span>
                </div>
                <p className={`text-3xl font-bold ${(stats?.pnl_this_month || 0) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {(stats?.pnl_this_month || 0) > 0 ? '+' : ''}{stats?.pnl_this_month?.toLocaleString() || '0'}€
                </p>
              </div>
            </div>

            {/* Bannière limitation */}
            {!isElite && hiddenTradesCount > 0 && (
              <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="text-[#6366F1]" size={20} />
                  <p className="text-sm text-gray-300">
                    {!isPro ? (
                      <>📅 Historique limité à 7 jours. {hiddenTradesCount} trade{hiddenTradesCount > 1 ? 's' : ''} masqué{hiddenTradesCount > 1 ? 's' : ''}.</>
                    ) : (
                      <>📅 Historique limité à 1 mois. {hiddenTradesCount} trade{hiddenTradesCount > 1 ? 's' : ''} masqué{hiddenTradesCount > 1 ? 's' : ''}.</>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* Derniers trades */}
            <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-white">Derniers trades</h2>
                <button onClick={() => setActiveTab('historique')} className="text-sm text-[#6366F1] hover:text-[#8183F4] transition flex items-center gap-1">
                  Voir tout <ChevronRight size={16} />
                </button>
              </div>

              {trades.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="text-gray-600 mx-auto mb-4" size={48} />
                  <p className="text-gray-400">Aucun trade sur les {getHistoricalPeriod()}</p>
                  <button onClick={() => navigate('/Calculator')} className="mt-4 px-6 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F52E0] transition">
                    Calculer votre premier trade
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#1E1F23]">
                        <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Paire</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Entrée</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Taille</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">R:R</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Profit</th>
                        <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trades.slice(0, 5).map((trade) => (
                        <tr key={trade.id} className="border-b border-[#1E1F23]/50 hover:bg-[#1A1C20]">
                          <td className="py-3 text-sm text-gray-300">{new Date(trade.entry_at).toLocaleDateString('fr-FR')}</td>
                          <td className="py-3 font-medium text-white">{trade.symbol}</td>
                          <td className="py-3 text-sm text-gray-300">${trade.entry_price}</td>
                          <td className="py-3 text-sm text-gray-300">${trade.position_size_usd?.toLocaleString()}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${trade.rr_ratio >= 2 ? 'bg-green-400/10 text-green-400' :
                              trade.rr_ratio >= 1 ? 'bg-yellow-400/10 text-yellow-400' :
                                'bg-red-400/10 text-red-400'
                              }`}>
                              1:{trade.rr_ratio?.toFixed(1) || '0.0'}
                            </span>
                          </td>
                          <td className={`py-3 text-sm font-medium ${trade.profit_loss > 0 ? 'text-green-400' : trade.profit_loss < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                            {trade.profit_loss > 0 ? '+' : ''}{trade.profit_loss?.toFixed(2) || '0'}€
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded text-xs ${trade.status === 'win' ? 'bg-green-400/10 text-green-400' :
                              trade.status === 'loss' ? 'bg-red-400/10 text-red-400' :
                                trade.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                                  'bg-gray-400/10 text-gray-400'
                              }`}>
                              {trade.status === 'win' ? 'Gagné' : trade.status === 'loss' ? 'Perdu' : trade.status === 'pending' ? 'Ouvert' : trade.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Accès rapides calculateurs */}
            <div className="grid md:grid-cols-3 gap-6">
              <button onClick={() => navigate('/Calculator')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
                    <Calculator className="text-[#6366F1]" size={24} />
                  </div>
                  <ChevronRight className="text-gray-500 group-hover:text-[#6366F1] group-hover:translate-x-1 transition" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Position Sizing</h3>
                <p className="text-sm text-gray-400">Calculez la taille idéale selon votre capital et votre risque</p>
              </button>

              <button onClick={() => navigate('/PnLCalculator')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
                    <DollarSign className="text-[#6366F1]" size={24} />
                  </div>
                  <ChevronRight className="text-gray-500 group-hover:text-[#6366F1] group-hover:translate-x-1 transition" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Profit & Loss</h3>
                <p className="text-sm text-gray-400">Calculez vos profits et pertes sur un trade existant</p>
              </button>

              <button onClick={() => navigate('/chart')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
                    <LineChart className="text-[#6366F1]" size={24} />
                  </div>
                  <ChevronRight className="text-gray-500 group-hover:text-[#6366F1] group-hover:translate-x-1 transition" size={20} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analyse Technique</h3>
                <p className="text-sm text-gray-400">Graphique candlestick live avec indicateurs EMA, RSI, Bollinger</p>
              </button>

              <button onClick={() => navigate('/chart-analysis')} className="bg-[#131517] border border-[#1E1F23] hover:border-[#6366F1]/50 rounded-xl p-6 text-left transition group relative overflow-hidden">
                <div className="absolute top-4 right-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] px-2 py-1 rounded text-[10px] font-bold text-white tracking-wider">
                  PRO+
                </div>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-[#6366F1]/10 rounded-lg group-hover:bg-[#6366F1]/20 transition">
                    <Camera className="text-[#6366F1]" size={24} />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Analyse IA (Image)</h3>
                <p className="text-sm text-gray-400">Uploadez un screenshot et obtenez une analyse instantanée avec plan de trade.</p>
              </button>
            </div>
          </div>
        )}

        {/* ===== ONGLET HISTORIQUE ===== */}
        {activeTab === 'historique' && (
          <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-white">Historique des trades</h2>
                <p className="text-sm text-gray-500 mt-1">Période : {getHistoricalPeriod()} • {trades.length} trades</p>
              </div>
              {(isPro || isElite) && (
                <button onClick={() => exportData('CSV')} className="px-4 py-2 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-sm text-gray-300 hover:text-white hover:border-[#6366F1] transition flex items-center gap-2">
                  <Download size={16} /> Export CSV
                </button>
              )}
            </div>

            {(isPro || isElite || trades.length > 0) ? (
              <>
                <div className="mb-4 flex gap-3">
                  <input
                    type="text"
                    placeholder="Rechercher une paire..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="flex-1 px-4 py-2 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white placeholder-gray-500 focus:border-[#6366F1] focus:outline-none"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white focus:border-[#6366F1] focus:outline-none"
                  >
                    <option value="all">Tous</option>
                    <option value="win">Gagnés</option>
                    <option value="loss">Perdus</option>
                    <option value="pending">Ouverts</option>
                  </select>
                </div>

                {filteredTrades.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="text-gray-600 mx-auto mb-4" size={48} />
                    <p className="text-gray-400">Aucun trade trouvé</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#1E1F23]">
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Paire</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Entrée</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Sortie</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Taille</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">R:R</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Profit</th>
                          <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Statut</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTrades.map((trade) => (
                          <tr key={trade.id} className="border-b border-[#1E1F23]/50 hover:bg-[#1A1C20]">
                            <td className="py-3 text-sm text-gray-300">{new Date(trade.entry_at).toLocaleDateString('fr-FR')}</td>
                            <td className="py-3 font-medium text-white">{trade.symbol}</td>
                            <td className="py-3 text-sm text-gray-300">${trade.entry_price}</td>
                            <td className="py-3 text-sm text-gray-300">${trade.exit_price || '-'}</td>
                            <td className="py-3 text-sm text-gray-300">${trade.position_size_usd?.toLocaleString() || '-'}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded text-xs ${trade.rr_ratio >= 2 ? 'bg-green-400/10 text-green-400' :
                                trade.rr_ratio >= 1 ? 'bg-yellow-400/10 text-yellow-400' :
                                  'bg-red-400/10 text-red-400'
                                }`}>
                                1:{trade.rr_ratio?.toFixed(1) || '-'}
                              </span>
                            </td>
                            <td className={`py-3 text-sm font-medium ${trade.profit_loss > 0 ? 'text-green-400' : trade.profit_loss < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                              {trade.profit_loss ? `${trade.profit_loss > 0 ? '+' : ''}${trade.profit_loss}€` : '-'}
                            </td>
                            <td className="py-3">
                              <span className={`px-2 py-1 rounded text-xs ${trade.status === 'win' ? 'bg-green-400/10 text-green-400' :
                                trade.status === 'loss' ? 'bg-red-400/10 text-red-400' :
                                  trade.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                                    'bg-gray-400/10 text-gray-400'
                                }`}>
                                {trade.status === 'win' ? 'Gagné' : trade.status === 'loss' ? 'Perdu' : trade.status === 'pending' ? 'Ouvert' : trade.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16">
                <History className="text-gray-600 mx-auto mb-4" size={48} />
                <h3 className="text-lg font-medium text-white mb-2">Historique limité</h3>
                <p className="text-gray-400 text-sm mb-6">Votre plan gratuit affiche uniquement les 7 derniers jours.</p>
                <button onClick={() => navigate('/SelectPlan')} className="px-6 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F52E0] transition">Passer en PRO</button>
              </div>
            )}
          </div>
        )}

        {/* ===== ONGLET ANALYSES ===== */}
        {activeTab === 'analyses' && (
          <div className="space-y-6">
            <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Évolution du P&L</h3>
              {/* <PnLChart trades={trades} /> */}
              <div className="h-64 flex items-center justify-center bg-[#1A1C20] rounded-lg">
                <p className="text-gray-500">Graphique à venir</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Win/Loss Ratio</h3>
                {/* <WinLossChart trades={trades} /> */}
                <div className="h-48 flex items-center justify-center bg-[#1A1C20] rounded-lg">
                  <p className="text-gray-500">Graphique à venir</p>
                </div>
                <div className="mt-4 flex justify-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-gray-400">{stats?.winning_trades || 0} Wins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-400">{stats?.losing_trades || 0} Losses</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Performance par Paire</h3>
                {/* <PairPerformance trades={trades} /> */}
                <div className="h-48 flex items-center justify-center bg-[#1A1C20] rounded-lg">
                  <p className="text-gray-500">Graphique à venir</p>
                </div>
              </div>
            </div>

            <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Statistiques détaillées</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-[#1A1C20] rounded-lg">
                  <p className="text-xs text-gray-500">Profit moyen</p>
                  <p className={`text-lg font-bold ${(stats?.total_pnl / (stats?.winning_trades + stats?.losing_trades || 1)) > 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {(stats?.total_pnl / (stats?.winning_trades + stats?.losing_trades || 1)).toFixed(2)}€
                  </p>
                </div>
                <div className="p-3 bg-[#1A1C20] rounded-lg">
                  <p className="text-xs text-gray-500">Plus gros gain</p>
                  <p className="text-lg font-bold text-green-400">
                    {Math.max(...trades.filter(t => t.profit_loss > 0).map(t => t.profit_loss), 0).toFixed(2)}€
                  </p>
                </div>
                <div className="p-3 bg-[#1A1C20] rounded-lg">
                  <p className="text-xs text-gray-500">Plus grosse perte</p>
                  <p className="text-lg font-bold text-red-400">
                    {Math.min(...trades.filter(t => t.profit_loss < 0).map(t => t.profit_loss), 0).toFixed(2)}€
                  </p>
                </div>
                <div className="p-3 bg-[#1A1C20] rounded-lg">
                  <p className="text-xs text-gray-500">Trades gagnants</p>
                  <p className="text-lg font-bold text-white">{((stats?.winning_trades / (stats?.total_trades || 1)) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== ONGLET CALENDRIER ===== */}
        {activeTab === 'calendar' && (<EconomicCalendar />)}

        {/* ===== ONGLET IA ADVISOR ===== */}
        {activeTab === 'ai' && isElite && (
          <div className="bg-gradient-to-r from-[#131517] to-[#1A1C20] border border-[#6366F1]/30 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="text-[#6366F1]" size={32} />
              <div>
                <h2 className="text-lg font-semibold text-white">IA Advisor</h2>
                <p className="text-sm text-gray-400">{stats?.ai_credits || 0} crédits restants</p>
              </div>
            </div>
            <div className="bg-[#1A1C20] rounded-lg p-6 text-center">
              <p className="text-gray-400">Analyses IA bientôt disponibles</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}