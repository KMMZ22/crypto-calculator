import React from 'react';

const SetupAnalysis = ({ analysis }) => {
  const getRiskRewardColor = (rr) => {
    if (rr >= 2) return 'text-green-400';
    if (rr >= 1.5) return 'text-lime-400';
    if (rr >= 1) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* En-tête de recommandation */}
      <div className={`p-4 rounded-xl border-2 bg-gradient-to-r ${
        analysis.recommendation.color === 'green' ? 'from-green-900/30 to-emerald-900/20 border-green-500/30' :
        analysis.recommendation.color === 'lime' ? 'from-lime-900/30 to-green-900/20 border-lime-500/30' :
        analysis.recommendation.color === 'yellow' ? 'from-yellow-900/30 to-amber-900/20 border-yellow-500/30' :
        analysis.recommendation.color === 'red' ? 'from-red-900/30 to-rose-900/20 border-red-500/30' :
        'from-gray-900/30 to-slate-900/20 border-gray-500/30'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">{analysis.recommendation.icon}</span>
          <div>
            <h3 className="text-xl font-bold">Recommandation: {analysis.recommendation.status}</h3>
            <p className="text-gray-300">{analysis.recommendation.message}</p>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Risk/Reward Ratio</div>
          <div className={`text-2xl font-bold mt-1 ${getRiskRewardColor(analysis.riskRewardRatio)}`}>
            {analysis.riskRewardRatio}:1
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {analysis.riskRewardRatio >= 2 ? 'Excellent' : 
             analysis.riskRewardRatio >= 1 ? 'Acceptable' : 'Défavorable'}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Stop-Loss Distance</div>
          <div className="text-2xl font-bold mt-1 text-blue-400">
            {analysis.metrics.stopLossDistancePercent}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {analysis.metrics.stopLossDistancePercent < 1 ? 'Trop serré' : 
             analysis.metrics.stopLossDistancePercent > 5 ? 'Large' : 'Idéal'}
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Potentiel Profit</div>
          <div className="text-2xl font-bold mt-1 text-green-400">
            +{analysis.metrics.potentialProfit}%
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Take-Profit à {analysis.metrics.potentialProfit}%
          </div>
        </div>

        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-700">
          <div className="text-gray-400 text-sm">Taille Position</div>
          <div className="text-2xl font-bold mt-1 text-purple-400">
            {analysis.metrics.optimalPositionSize.size}
          </div>
          <div className="text-xs text-gray-500 mt-2">
            ${analysis.metrics.optimalPositionSize.usdValue}
          </div>
        </div>
      </div>

      {/* Alertes */}
      {analysis.alerts.length > 0 && (
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-4">
          <h4 className="font-semibold text-red-300 mb-2">⚠️ Alertes de Risque</h4>
          <ul className="space-y-2">
            {analysis.alerts.map((alert, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <span className="mt-1">•</span>
                <span>{alert.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Insights détaillés */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50">
          <h4 className="font-semibold mb-3">📊 Analyse Technique</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-400">Taux de réussite requis:</span>
              <span className="font-medium">{analysis.metrics.requiredWinRate}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Risk par trade:</span>
              <span className="font-medium">{analysis.metrics.optimalPositionSize.riskPercent}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Montant à risquer:</span>
              <span className="font-medium">${analysis.metrics.optimalPositionSize.maxRiskAmount}</span>
            </li>
          </ul>
        </div>

        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50">
          <h4 className="font-semibold mb-3">👤 Votre Historique</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-400">Trades totaux:</span>
              <span className="font-medium">{analysis.userHistory.totalTrades}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">Taux de réussite:</span>
              <span className="font-medium">{analysis.userHistory.winRate}%</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-400">R:R moyen:</span>
              <span className="font-medium">{analysis.userHistory.averageRiskReward}:1</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SetupAnalysis;