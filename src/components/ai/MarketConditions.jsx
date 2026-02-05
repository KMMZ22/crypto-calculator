import React from 'react';

const MarketConditions = ({ data }) => {
  if (!data || data.error) {
    return (
      <div className="text-center py-6">
        <div className="text-gray-500 text-4xl mb-3">📡</div>
        <p className="text-gray-400">Données marché non disponibles</p>
        <p className="text-sm text-gray-600 mt-1">Vérifiez votre connexion</p>
      </div>
    );
  }

  const getVolatilityColor = (volatility) => {
    if (volatility < 1.5) return 'text-green-400';
    if (volatility < 3) return 'text-lime-400';
    if (volatility < 5) return 'text-yellow-400';
    if (volatility < 8) return 'text-orange-400';
    return 'text-red-400';
  };

  const getVolatilityLabel = (volatility) => {
    if (volatility < 1.5) return 'Très basse';
    if (volatility < 3) return 'Basse';
    if (volatility < 5) return 'Modérée';
    if (volatility < 8) return 'Élevée';
    return 'Extrême';
  };

  const getVolumeColor = (volume) => {
    // Volume en millions
    const volInMillions = volume / 1000000;
    if (volInMillions > 1000) return 'text-green-400';
    if (volInMillions > 500) return 'text-lime-400';
    if (volInMillions > 100) return 'text-yellow-400';
    if (volInMillions > 50) return 'text-orange-400';
    return 'text-red-400';
  };

  const getVolumeLabel = (volume) => {
    const volInMillions = volume / 1000000;
    if (volInMillions > 1000) return 'Excellent';
    if (volInMillions > 500) return 'Bon';
    if (volInMillions > 100) return 'Modéré';
    if (volInMillions > 50) return 'Faible';
    return 'Très faible';
  };

  const getTrendIcon = (change) => {
    if (change > 5) return '📈';
    if (change > 1) return '↗️';
    if (change > -1) return '➡️';
    if (change > -5) return '↘️';
    return '📉';
  };

  const getTrendColor = (change) => {
    if (change > 2) return 'text-green-400';
    if (change > 0) return 'text-lime-400';
    if (change > -2) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatVolume = (volume) => {
    if (volume >= 1000000000) return `${(volume / 1000000000).toFixed(1)}B`;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toFixed(0);
  };

  return (
    <div className="space-y-4">
      {/* Prix actuel */}
      <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/50">
        <div className="flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-400">Prix actuel</div>
            <div className="text-2xl font-bold mt-1">
              ${data.currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xl">{getTrendIcon(data.change24h)}</span>
              <span className={`text-sm font-medium ${getTrendColor(data.change24h)}`}>
                {data.change24h >= 0 ? '+' : ''}{data.change24h.toFixed(2)}%
              </span>
              <span className="text-xs text-gray-500">(24h)</span>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-600/20 to-cyan-500/20 rounded-lg p-3">
            <div className="text-2xl">{data.symbol}</div>
          </div>
        </div>
      </div>

      {/* Indicateurs marché */}
      <div className="grid grid-cols-2 gap-3">
        {/* Volatilité */}
        <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Volatilité</div>
            <div className={`text-xs font-medium px-2 py-1 rounded ${getVolatilityColor(data.volatility).replace('text-', 'bg-').replace('400', '900/30')} ${getVolatilityColor(data.volatility)}`}>
              {getVolatilityLabel(data.volatility)}
            </div>
          </div>
          <div className={`text-lg font-bold ${getVolatilityColor(data.volatility)}`}>
            {data.volatility.toFixed(1)}%
          </div>
          <div className="mt-2">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getVolatilityColor(data.volatility).replace('text-', 'bg-')}`}
                style={{ width: `${Math.min(100, (data.volatility / 10) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Calme</span>
              <span>Extrême</span>
            </div>
          </div>
        </div>

        {/* Volume */}
        <div className="bg-gray-900/40 rounded-xl p-3 border border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm text-gray-400">Volume 24h</div>
            <div className={`text-xs font-medium px-2 py-1 rounded ${getVolumeColor(data.volume).replace('text-', 'bg-').replace('400', '900/30')} ${getVolumeColor(data.volume)}`}>
              {getVolumeLabel(data.volume)}
            </div>
          </div>
          <div className={`text-lg font-bold ${getVolumeColor(data.volume)}`}>
            {formatVolume(data.volume)}
          </div>
          <div className="mt-2">
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${getVolumeColor(data.volume).replace('text-', 'bg-')}`}
                style={{ width: `${Math.min(100, (Math.log10(data.volume) / 10) * 100)}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>Faible</span>
              <span>Fort</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conseils trading selon conditions */}
      <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-700/50 mt-4">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <span className="text-purple-400">💡</span> Conseils Trading
        </h4>
        
        <div className="space-y-3">
          {data.volatility > 5 ? (
            <div className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-red-400">⚠️</div>
              <div>
                <p className="font-medium">Volatilité élevée</p>
                <p className="text-gray-400 text-xs">Élargissez vos stops et réduisez la taille de position</p>
              </div>
            </div>
          ) : data.volatility < 2 ? (
            <div className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-400">✅</div>
              <div>
                <p className="font-medium">Marché calme</p>
                <p className="text-gray-400 text-xs">Conditions idéales pour les trades directionnels</p>
              </div>
            </div>
          ) : null}

          {data.volume < 50000000 ? (
            <div className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-amber-400">📉</div>
              <div>
                <p className="font-medium">Volume faible</p>
                <p className="text-gray-400 text-xs">Liquidité réduite - spread potentiellement large</p>
              </div>
            </div>
          ) : null}

          {Math.abs(data.change24h) > 10 ? (
            <div className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-purple-400">⚡</div>
              <div>
                <p className="font-medium">Mouvement fort</p>
                <p className="text-gray-400 text-xs">Attendez un pullback avant d'entrer en position</p>
              </div>
            </div>
          ) : null}

          {data.volatility >= 2 && data.volatility <= 4 && data.volume > 100000000 ? (
            <div className="flex items-start gap-2 text-sm">
              <div className="mt-0.5 text-green-400">🎯</div>
              <div>
                <p className="font-medium">Conditions optimales</p>
                <p className="text-gray-400 text-xs">Volatilité et liquidité idéales pour trading</p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Timestamp */}
        <div className="mt-4 pt-3 border-t border-gray-700/30">
          <p className="text-xs text-gray-500">
            Données mises à jour: {new Date(data.timestamp).toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MarketConditions;