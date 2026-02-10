import React from 'react';

const TradeHistory = ({ history }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'EXCELLENT':
        return 'bg-gradient-to-r from-green-900/30 to-emerald-900/20 border-green-500/30 text-green-400';
      case 'BON':
        return 'bg-gradient-to-r from-lime-900/30 to-green-900/20 border-lime-500/30 text-lime-400';
      case 'ACCEPTABLE':
        return 'bg-gradient-to-r from-yellow-900/30 to-amber-900/20 border-yellow-500/30 text-yellow-400';
      case 'RISQUÉ':
        return 'bg-gradient-to-r from-red-900/30 to-rose-900/20 border-red-500/30 text-red-400';
      default:
        return 'bg-gray-900/30 border-gray-700/50 text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'EXCELLENT': return '✅';
      case 'BON': return '👍';
      case 'ACCEPTABLE': return '⚠️';
      case 'RISQUÉ': return '❌';
      default: return '🔍';
    }
  };

  const getRrColor = (rr) => {
    if (rr >= 2) return 'text-green-400';
    if (rr >= 1.5) return 'text-lime-400';
    if (rr >= 1) return 'text-yellow-400';
    return 'text-red-400';
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-4xl mb-3">📊</div>
        <p className="text-gray-400">Aucune analyse AI effectuée</p>
        <p className="text-sm text-gray-600 mt-1">Vos premières analyses apparaîtront ici</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-700/50">
            <th className="pb-3 px-2 text-gray-400 font-medium text-sm">Date</th>
            <th className="pb-3 px-2 text-gray-400 font-medium text-sm">Paire</th>
            <th className="pb-3 px-2 text-gray-400 font-medium text-sm">R:R</th>
            <th className="pb-3 px-2 text-gray-400 font-medium text-sm">Score</th>
            <th className="pb-3 px-2 text-gray-400 font-medium text-sm">Recommandation</th>
            <th className="pb-3 px-2 text-gray-400 font-medium text-sm">Succès</th>
          </tr>
        </thead>
        <tbody>
          {history.map((item) => (
            <tr 
              key={item.id} 
              className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
            >
              <td className="py-3 px-2">
                <div className="text-sm font-mono">{formatDate(item.createdAt)}</div>
              </td>
              
              <td className="py-3 px-2">
                <div className="font-medium">{item.symbol}</div>
              </td>
              
              <td className="py-3 px-2">
                <div className={`font-bold ${getRrColor(item.riskRewardRatio)}`}>
                  {item.riskRewardRatio}:1
                </div>
              </td>
              
              <td className="py-3 px-2">
                <div className="flex items-center gap-2">
                  <div className="relative w-12 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                      className={`absolute left-0 top-0 h-full rounded-full ${
                        item.confidenceScore >= 80 ? 'bg-green-500' :
                        item.confidenceScore >= 60 ? 'bg-lime-500' :
                        item.confidenceScore >= 40 ? 'bg-yellow-500' :
                        item.confidenceScore >= 20 ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.confidenceScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{item.confidenceScore}</span>
                </div>
              </td>
              
              <td className="py-3 px-2">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${getStatusColor(item.recommendation)}`}>
                  <span>{getStatusIcon(item.recommendation)}</span>
                  <span className="text-xs font-medium">{item.recommendation}</span>
                </div>
              </td>
              
              <td className="py-3 px-2">
                {item.success !== null ? (
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${
                    item.success >= 80 ? 'bg-green-900/30 text-green-400' :
                    item.success >= 60 ? 'bg-lime-900/30 text-lime-400' :
                    item.success >= 40 ? 'bg-yellow-900/30 text-yellow-400' :
                    'bg-red-900/30 text-red-400'
                  }`}>
                    <span className="text-xs font-medium">{item.success}%</span>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">-</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Stats résumées */}
      <div className="mt-6 pt-6 border-t border-gray-700/50 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-white">{history.length}</div>
          <div className="text-xs text-gray-500">Analyses totales</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-400">
            {Math.round(history.reduce((acc, item) => acc + (item.confidenceScore || 0), 0) / history.length)}
          </div>
          <div className="text-xs text-gray-500">Score moyen</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-400">
            {Math.round(history.reduce((acc, item) => acc + (item.riskRewardRatio || 0), 0) / history.length * 10) / 10}
          </div>
          <div className="text-xs text-gray-500">R:R moyen</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-400">
            {history.filter(item => item.recommendation === 'EXCELLENT' || item.recommendation === 'BON').length}
          </div>
          <div className="text-xs text-gray-500">Setups recommandés</div>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory;