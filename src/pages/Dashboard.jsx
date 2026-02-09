// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user, getTrades, saveTrade } = useAuth();
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const loadTrades = async () => {
      const userTrades = await getTrades();
      setTrades(userTrades);
    };
    
    if (user) {
      loadTrades();
    }
  }, [user, getTrades]);

  const handleNewTrade = async () => {
    const newTrade = {
      symbol: 'BTCUSDT',
      position_size: 0.5,
      entry_price: 45000,
      stop_loss: 44000,
      take_profit: 47000,
      risk_reward_ratio: 2.0,
      risk_amount: 500
    };
    
    const saved = await saveTrade(newTrade);
    setTrades(prev => [saved, ...prev]);
  };

  return (
    <div>
      <h1>Dashboard Trader</h1>
      <p>Bienvenue {user?.username}</p>
      <button onClick={handleNewTrade}>Sauvegarder un trade test</button>
      
      <h2>Mes trades ({trades.length})</h2>
      <ul>
        {trades.map(trade => (
          <li key={trade.id}>
            {trade.symbol} - Size: {trade.position_size}
          </li>
        ))}
      </ul>
    </div>
  );
};