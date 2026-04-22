import React from 'react';

export default function DashboardStats({ stats }) {
  return (
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
  );
}
