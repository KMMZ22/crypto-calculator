// src/components/charts/PairPerformance.jsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PairPerformance = ({ trades }) => {
  // Grouper par paire et calculer performance
  const pairData = trades
    .filter(t => t.status === 'win' || t.status === 'loss')
    .reduce((acc, trade) => {
      const profit = parseFloat(trade.profit_loss) || 0;
      if (!acc[trade.symbol]) {
        acc[trade.symbol] = { 
          symbol: trade.symbol, 
          profit: 0,
          wins: 0,
          losses: 0
        };
      }
      acc[trade.symbol].profit += profit;
      if (profit > 0) acc[trade.symbol].wins++;
      if (profit < 0) acc[trade.symbol].losses++;
      return acc;
    }, {});

  const data = Object.values(pairData)
    .sort((a, b) => b.profit - a.profit)
    .slice(0, 5);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
        <p className="text-gray-500">Aucune donnée</p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1E1F23" />
          <XAxis 
            dataKey="symbol" 
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
            formatter={(value) => [`$${value.toLocaleString()}`, 'Profit']}
          />
          <Bar dataKey="profit" fill="#6366F1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PairPerformance;