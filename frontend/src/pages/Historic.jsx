// src/pages/History.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Shield, 
  ChevronRight, 
  Download, 
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Search,
  ArrowLeft,
  BarChart3,
  DollarSign,
  Clock
} from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function History() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [trades, setTrades] = useState([]);
  const [filteredTrades, setFilteredTrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    totalPnl: 0
  });

  // =====================================================
  // 1. CHARGER L'UTILISATEUR
  // =====================================================
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/');
        return;
      }
      
      setUser(user);
      await loadUserData(user.id);
    };
    
    getUser();
  }, [navigate]);

  // =====================================================
  // 2. DÉTECTION PLAN
  // =====================================================
  const isPro = profile?.subscription_plan === 'pro';
  const isElite = profile?.subscription_plan === 'elite';

  // =====================================================
  // 3. PÉRIODE SELON PLAN
  // =====================================================
  const getHistoricalPeriod = () => {
    if (isElite) return '6 mois';
    if (isPro) return '1 mois';
    return '7 jours';
  };

  // =====================================================
  // 4. CHARGER DONNÉES
  // =====================================================
  const loadUserData = async (userId) => {
    try {
      setLoading(true);
      
      // Charger profil
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      setProfile(profile);
      
      // Charger trades avec limite
      const tradesData = await loadTradesWithLimit(userId);
      setTrades(tradesData);
      setFilteredTrades(tradesData);
      
      // Calculer stats
      calculateStats(tradesData);
      
    } catch (error) {
      console.error('Erreur chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // 5. CHARGER TRADES AVEC LIMITE
  // =====================================================
  const loadTradesWithLimit = async (userId) => {
    let query = supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('entry_at', { ascending: false });
    
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
    return data || [];
  };

  // =====================================================
  // 6. CALCULER STATISTIQUES
  // =====================================================
  const calculateStats = (tradesData) => {
    const wins = tradesData.filter(t => t.status === 'win').length;
    const losses = tradesData.filter(t => t.status === 'loss').length;
    const totalPnl = tradesData.reduce((sum, t) => sum + (t.profit_loss || 0), 0);
    
    setStats({
      total: tradesData.length,
      wins,
      losses,
      winRate: tradesData.length > 0 ? (wins / tradesData.length * 100) : 0,
      totalPnl
    });
  };

  // =====================================================
  // 7. FILTRER LES TRADES
  // =====================================================
  useEffect(() => {
    let filtered = [...trades];
    
    // Filtre par recherche
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.symbol.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par statut
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    // Filtre par date
    if (dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch(dateRange) {
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        default:
          break;
      }
      
      filtered = filtered.filter(t => new Date(t.entry_at) >= filterDate);
    }
    
    setFilteredTrades(filtered);
  }, [searchTerm, statusFilter, dateRange, trades]);

  // =====================================================
  // 8. EXPORT CSV
  // =====================================================
  const exportToCSV = () => {
    if (!isPro && !isElite) {
      alert('Export CSV réservé aux membres PRO et Elite');
      return;
    }
    
    const headers = ['Date', 'Paire', 'Direction', 'Entrée', 'Sortie', 'Taille', 'R:R', 'Profit', 'Statut'];
    const rows = filteredTrades.map(t => [
      new Date(t.entry_at).toLocaleDateString('fr-FR'),
      t.symbol,
      t.direction || 'long',
      t.entry_price,
      t.exit_price || '-',
      t.position_size_usd || '-',
      t.rr_ratio ? `1:${t.rr_ratio}` : '-',
      t.profit_loss || 0,
      t.status
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `trades_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // =====================================================
  // RENDU
  // =====================================================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#6366F1]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-white">
      {/* Header */}
      <div className="border-b border-[#1E1F23] bg-[#0A0B0D] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo cliquable */}
            <button 
              onClick={() => navigate('/')}
              className="flex items-center gap-2 hover:opacity-80 transition"
            >
              <Shield className="text-[#6366F1]" size={32} />
              <span className="text-xl font-bold text-white">TradeGuard</span>
            </button>

            {/* Navigation */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition"
              >
                <ArrowLeft size={18} />
                <span>Dashboard</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header avec stats */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Historique des trades</h1>
          <p className="text-gray-400">
            Période affichée : {getHistoricalPeriod()} • {filteredTrades.length} trades
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Total trades</p>
              <BarChart3 className="text-[#6366F1]" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.total}</p>
          </div>

          <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Win Rate</p>
              <TrendingUp className="text-green-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">{stats.winRate.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 mt-1">
              {stats.wins} wins / {stats.losses} losses
            </p>
          </div>

          <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">PnL Total</p>
              <DollarSign className={stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'} size={20} />
            </div>
            <p className={`text-3xl font-bold ${stats.totalPnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {stats.totalPnl >= 0 ? '+' : ''}{stats.totalPnl.toFixed(2)}€
            </p>
          </div>

          <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-400">Moyenne R:R</p>
              <Clock className="text-purple-400" size={20} />
            </div>
            <p className="text-3xl font-bold text-white">
              1:{(trades.reduce((sum, t) => sum + (t.rr_ratio || 0), 0) / (trades.length || 1)).toFixed(1)}
            </p>
          </div>
        </div>

        {/* Filtres et export */}
        <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
              <input
                type="text"
                placeholder="Rechercher une paire..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white placeholder-gray-500 focus:border-[#6366F1] focus:outline-none"
              />
            </div>

            {/* Filtre statut */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white focus:border-[#6366F1] focus:outline-none"
            >
              <option value="all">Tous les statuts</option>
              <option value="win">Gagnés</option>
              <option value="loss">Perdus</option>
              <option value="pending">Ouverts</option>
            </select>

            {/* Filtre date */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="px-4 py-2 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white focus:border-[#6366F1] focus:outline-none"
            >
              <option value="all">Toutes les dates</option>
              <option value="week">7 derniers jours</option>
              <option value="month">30 derniers jours</option>
              <option value="quarter">3 derniers mois</option>
            </select>

            {/* Export button */}
            {(isPro || isElite) && (
              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F52E0] transition flex items-center gap-2"
              >
                <Download size={18} />
                Export CSV
              </button>
            )}
          </div>

          {/* Tableau des trades */}
          {filteredTrades.length === 0 ? (
            <div className="text-center py-12">
              <HistoryIcon className="text-gray-600 mx-auto mb-4" size={48} />
              <p className="text-gray-400">Aucun trade trouvé</p>
              <button
                onClick={() => navigate('/Calculator')}
                className="mt-4 px-6 py-2 bg-[#6366F1] text-white rounded-lg hover:bg-[#4F52E0] transition"
              >
                Ajouter un trade
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#1E1F23]">
                    <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Paire</th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 uppercase">Direction</th>
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
                    <tr key={trade.id} className="border-b border-[#1E1F23]/50 hover:bg-[#1A1C20] transition">
                      <td className="py-3 text-sm text-gray-300">
                        {new Date(trade.entry_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="py-3 font-medium text-white">{trade.symbol}</td>
                      <td className="py-3">
                        {trade.direction === 'long' ? (
                          <span className="flex items-center gap-1 text-green-400">
                            <TrendingUp size={14} /> LONG
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-400">
                            <TrendingDown size={14} /> SHORT
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-sm text-gray-300">${trade.entry_price}</td>
                      <td className="py-3 text-sm text-gray-300">${trade.exit_price || '-'}</td>
                      <td className="py-3 text-sm text-gray-300">${trade.position_size_usd?.toLocaleString() || '-'}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          trade.rr_ratio >= 2 ? 'bg-green-400/10 text-green-400' :
                          trade.rr_ratio >= 1 ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-red-400/10 text-red-400'
                        }`}>
                          1:{trade.rr_ratio?.toFixed(1) || '-'}
                        </span>
                      </td>
                      <td className={`py-3 text-sm font-medium ${
                        trade.profit_loss > 0 ? 'text-green-400' : 
                        trade.profit_loss < 0 ? 'text-red-400' : 
                        'text-gray-400'
                      }`}>
                        {trade.profit_loss ? `${trade.profit_loss > 0 ? '+' : ''}${trade.profit_loss}€` : '-'}
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          trade.status === 'win' ? 'bg-green-400/10 text-green-400' :
                          trade.status === 'loss' ? 'bg-red-400/10 text-red-400' :
                          trade.status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' :
                          'bg-gray-400/10 text-gray-400'
                        }`}>
                          {trade.status === 'win' ? '✅ Gagné' :
                           trade.status === 'loss' ? '❌ Perdu' :
                           trade.status === 'pending' ? '⏳ Ouvert' :
                           trade.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}