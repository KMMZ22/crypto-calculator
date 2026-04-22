import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ChevronRight } from 'lucide-react';

export default function RecentTradesTable({ trades, getHistoricalPeriod, setActiveTab }) {
  const navigate = useNavigate();

  return (
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
  );
}
