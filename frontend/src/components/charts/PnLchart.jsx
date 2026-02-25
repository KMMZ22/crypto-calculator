// src/components/charts/PnLChart.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PnLChart = ({ trades }) => {
  // Trier les trades par date et calculer le P&L cumulé
  const data = trades
    .filter(t => t.status === 'win' || t.status === 'loss')
    .sort((a, b) => new Date(a.entry_at) - new Date(b.entry_at))
    .reduce((acc, trade) => {
      const lastValue = acc.length > 0 ? acc[acc.length - 1].cumulative : 0;
      const profit = parseFloat(trade.profit_loss) || 0;
      return [...acc, {
        date: new Date(trade.entry_at).toLocaleDateString('fr-FR'),
        profit: profit,
        cumulative: lastValue + profit
      }];
    }, []);

  if (data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
        <p className="text-gray-500">Aucune donnée pour le graphique</p>
      </div>
    );
  }

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1F23" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
          />
          <YAxis 
            stroke="#6B7280"
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#131517',
              border: '1px solid #1E1F23',
              borderRadius: '8px',
              color: '#fff'
            }}
            formatter={(value) => [`$${value.toLocaleString()}`, 'P&L']}
          />
          <Line 
            type="monotone" 
            dataKey="cumulative" 
            stroke="#6366F1" 
            strokeWidth={2}
            dot={{ fill: '#6366F1', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PnLChart;