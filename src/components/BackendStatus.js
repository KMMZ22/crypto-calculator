import React from 'react';
import { useBackendStatus } from '../hooks/usePrice';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

const BackendStatus = () => {
  const { available, checking, refresh } = useBackendStatus();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={refresh}
        disabled={checking}
        className="flex items-center gap-2 px-3 py-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg border hover:shadow-xl transition-all"
        title={available ? "Backend connecté" : "Backend hors ligne"}
      >
        {checking ? (
          <RefreshCw className="w-4 h-4 animate-spin text-gray-600" />
        ) : available ? (
          <Wifi className="w-4 h-4 text-green-500" />
        ) : (
          <WifiOff className="w-4 h-4 text-red-500" />
        )}
        
        <span className="text-sm font-medium">
          {checking ? 'Vérification...' : available ? 'En ligne' : 'Hors ligne'}
        </span>
      </button>
    </div>
  );
};

export default BackendStatus;