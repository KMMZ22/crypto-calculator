import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, History, Download, Bell, Settings, 
  TrendingUp, Shield, Zap, Clock, User,
  Calendar, DollarSign, PieChart, ChevronRight
} from 'lucide-react';
import { UserMenu } from '../components/UserMenu.jsx'; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [userPlan, setUserPlan] = useState('PRO'); // PRO ou ELITE
  const [activeTab, setActiveTab] = useState('overview');
  const [tradeHistory, setTradeHistory] = useState([]);
  const [stats, setStats] = useState(null);

  // Données de démonstration
  useEffect(() => {
    // Stats utilisateur
    setStats({
      totalTrades: 42,
      totalVolume: 125000,
      averageRR: 2.3,
      winRate: 72,
      riskSaved: 3500,
      favoritePair: 'BTC/USDT'
    });

    // Historique des trades
    setTradeHistory([
      { id: 1, date: '2024-01-23', pair: 'BTC/USDT', size: 5000, profit: 250, rr: 2.5, status: 'win' },
      { id: 2, date: '2024-01-22', pair: 'ETH/USDT', size: 3000, profit: -120, rr: 1.8, status: 'loss' },
      { id: 3, date: '2024-01-21', pair: 'SOL/USDT', size: 1500, profit: 320, rr: 3.2, status: 'win' },
      { id: 4, date: '2024-01-20', pair: 'BTC/USDT', size: 4200, profit: 180, rr: 2.1, status: 'win' },
      { id: 5, date: '2024-01-19', pair: 'ADA/USDT', size: 800, profit: 95, rr: 2.8, status: 'win' },
    ]);
  }, []);

  const features = [
    { icon: <BarChart3 size={20} />, label: '10 positions simultanées', enabled: true },
    { icon: <Zap size={20} />, label: 'Prix live API', enabled: true },
    { icon: <History size={20} />, label: 'Historique illimité', enabled: true },
    { icon: <Download size={20} />, label: 'Export PDF/CSV', enabled: true },
    { icon: <TrendingUp size={20} />, label: 'Tous calculateurs', enabled: true },
    { icon: <Bell size={20} />, label: 'Alertes email', enabled: true },
    { icon: <Shield size={20} />, label: 'Support prioritaire', enabled: true },
  ];

  const exportData = (format) => {
    alert(`Export ${format} généré avec succès !`);
    // Ici, vous généreriez le fichier réel
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation Top */}
      <div className="bg-slate-800/50 backdrop-blur-sm border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/calculator')}
                className="text-purple-400 hover:text-purple-300 transition"
              >
                ← Retour au calculateur
              </button>
              <div className="flex items-center gap-2">
                <Shield className="text-purple-400" size={24} />
                <span className="text-xl font-bold text-white">TradeGuard</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${
                  userPlan === 'PRO' ? 'bg-blue-600 text-blue-300' : 'bg-yellow-600 text-yellow-300'
                }`}>
                  {userPlan}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition">
                <Bell className="text-gray-400" size={20} />
              </button>
              <button className="p-2 hover:bg-slate-700/50 rounded-lg transition">
                <Settings className="text-gray-400" size={20} />
              </button>
              <UserMenu />
          </div>
          </div>
         

          {/* Tabs Navigation */}
          <div className="flex gap-1 mt-6">
            {['overview', 'history', 'alerts', 'templates', 'analytics'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                {tab === 'overview' && 'Aperçu'}
                {tab === 'history' && 'Historique'}
                {tab === 'alerts' && 'Alertes'}
                {tab === 'templates' && 'Templates'}
                {tab === 'analytics' && 'Analytics'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-900/30 to-slate-800/50 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <DollarSign className="text-blue-400" size={24} />
                  <span className="text-xs text-blue-400 bg-blue-900/30 px-2 py-1 rounded">Total</span>
                </div>
                <p className="text-3xl font-bold text-white">${stats?.totalVolume?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-sm">Volume tradé</p>
              </div>

              <div className="bg-gradient-to-br from-green-900/30 to-slate-800/50 border border-green-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <TrendingUp className="text-green-400" size={24} />
                  <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">{stats?.winRate || 0}%</span>
                </div>
                <p className="text-3xl font-bold text-white">{stats?.totalTrades || 0}</p>
                <p className="text-gray-400 text-sm">Trades réalisés</p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <PieChart className="text-purple-400" size={24} />
                  <span className="text-xs text-purple-400 bg-purple-900/30 px-2 py-1 rounded">Avg</span>
                </div>
                <p className="text-3xl font-bold text-white">1:{stats?.averageRR?.toFixed(1) || '0.0'}</p>
                <p className="text-gray-400 text-sm">Ratio R:R moyen</p>
              </div>

              <div className="bg-gradient-to-br from-orange-900/30 to-slate-800/50 border border-orange-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <Shield className="text-orange-400" size={24} />
                  <span className="text-xs text-orange-400 bg-orange-900/30 px-2 py-1 rounded">Économisé</span>
                </div>
                <p className="text-3xl font-bold text-white">${stats?.riskSaved?.toLocaleString() || '0'}</p>
                <p className="text-gray-400 text-sm">Risque évité</p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">✨ Vos Features PRO</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg">
                    <div className={`p-2 rounded-lg ${feature.enabled ? 'bg-green-900/30 text-green-400' : 'bg-gray-900/30 text-gray-400'}`}>
                      {feature.icon}
                    </div>
                    <div>
                      <p className="text-white font-medium">{feature.label}</p>
                      <p className="text-xs text-gray-400">
                        {feature.enabled ? '✅ Actif' : '🔒 Verrouillé'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Trades */}
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">📊 Derniers Trades</h2>
                <button 
                  onClick={() => setActiveTab('history')}
                  className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1"
                >
                  Voir tout <ChevronRight size={16} />
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-400 font-medium">Date</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Pair</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Taille</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Profit</th>
                      <th className="text-left py-3 text-gray-400 font-medium">R:R</th>
                      <th className="text-left py-3 text-gray-400 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeHistory.map((trade) => (
                      <tr key={trade.id} className="border-b border-gray-800/50 hover:bg-slate-700/30">
                        <td className="py-3 text-gray-300">{trade.date}</td>
                        <td className="py-3 font-medium text-white">{trade.pair}</td>
                        <td className="py-3 text-gray-300">${trade.size.toLocaleString()}</td>
                        <td className={`py-3 font-bold ${trade.profit > 0 ? 'text-green-400' : 'text-red-400'}`}>
                          ${trade.profit > 0 ? '+' : ''}{trade.profit}
                        </td>
                        <td className="py-3">
                          <span className={`px-2 py-1 rounded text-xs ${
                            trade.rr >= 2 ? 'bg-green-900/30 text-green-400' :
                            trade.rr >= 1 ? 'bg-yellow-900/30 text-yellow-400' :
                            'bg-red-900/30 text-red-400'
                          }`}>
                            1:{trade.rr.toFixed(1)}
                          </span>
                        </td>
                        <td className="py-3">
                          <button className="text-purple-400 hover:text-purple-300 text-sm">
                            Recalculer
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Export Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-700">
                <button 
                  onClick={() => exportData('PDF')}
                  className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 rounded-lg text-red-400 font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  Export PDF
                </button>
                <button 
                  onClick={() => exportData('CSV')}
                  className="px-4 py-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 rounded-lg text-green-400 font-medium flex items-center gap-2"
                >
                  <Download size={16} />
                  Export CSV
                </button>
                <button className="px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 rounded-lg text-blue-400 font-medium flex items-center gap-2 ml-auto">
                  <History size={16} />
                  Tout l'historique
                </button>
              </div>
            </div>

            {/* API Status */}
            <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">🔌 Status des APIs</h2>
              <div className="flex flex-wrap gap-4">
                {['Binance', 'Bybit', 'Coinbase', 'Kraken'].map((exchange) => (
                  <div key={exchange} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-white">{exchange}</span>
                    <span className="text-xs text-gray-400">(connecté)</span>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Les prix se mettent à jour automatiquement toutes les 10 secondes via API.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">📜 Historique Complet</h2>
            {/* Ici vous afficherez tout l'historique */}
            <p className="text-gray-400">Historique illimité - fonctionnalité PRO</p>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div className="bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-white mb-6">🔔 Alertes Email</h2>
            {/* Gestion des alertes */}
            <p className="text-gray-400">Configurer vos alertes - fonctionnalité PRO</p>
          </div>
        )}
      </div>
    </div>
  );
}