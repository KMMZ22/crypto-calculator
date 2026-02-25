// src/components/charts/WinLossChart.jsx
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const WinLossChart = ({ trades }) => {
  const wins = trades.filter(t => t.status === 'win').length;
  const losses = trades.filter(t => t.status === 'loss').length;
  const pending = trades.filter(t => t.status === 'pending').length;

  const data = [
    { name: 'Gagnés', value: wins, color: '#10B981' },
    { name: 'Perdus', value: losses, color: '#EF4444' },
    { name: 'Ouverts', value: pending, color: '#F59E0B' }
  ].filter(item => item.value > 0);

  if (data.length === 0) {
    return (
      <div className="h-48 flex items-center justify-center border border-dashed border-gray-700 rounded-lg">
        <p className="text-gray-500">Aucun trade</p>
      </div>
    );
  }

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={40}
            outerRadius={70}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: '#131517',
              border: '1px solid #1E1F23',
              borderRadius: '8px',
              color: '#fff'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default WinLossChart;