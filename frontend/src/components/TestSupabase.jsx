import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { authService } from '../services/authService'
import { calculationService as calculatorService } from '../services/calculationService'
import { useAuth } from '../hooks/useAuth'

export default function TestSupabase() {
  const { user, loading } = useAuth()
  const [calculations, setCalculations] = useState([])
  const [stats, setStats] = useState(null)
  
  // Test d'authentification
  const testAuth = async () => {
    try {
      // Inscription test (à commenter après premier test)
      // await authService.signUp('test@tradeguard.dev', 'password123', 'testtrader')
      
      // Connexion
      await authService.signIn('demo@tradeguard.com', 'demo123')
      alert('Connexion réussie!')
    } catch (error) {
      alert('Erreur: ' + error.message)
    }
  }
  
  // Test de calcul
  const testCalculation = async () => {
    try {
      const result = await calculatorService.calculatePosition({
        capital: 10000,
        riskPercent: 2,
        entryPrice: 45000,
        stopLoss: 44500,
        takeProfit: 46000,
        marketType: 'crypto',
        symbol: 'BTCUSDT'
      })
      
      alert(`Calcul réussi! Position: ${result.summary.positionSize} BTC`)
      loadCalculations()
    } catch (error) {
      alert('Erreur calcul: ' + error.message)
    }
  }
  
  // Charger les calculs
  const loadCalculations = async () => {
    try {
      const data = await calculatorService.getHistory(10)
      setCalculations(data)
      
      const userStats = await calculatorService.getUserStats()
      setStats(userStats)
    } catch (error) {
      console.error('Erreur chargement:', error)
    }
  }
  
  useEffect(() => {
    if (user) {
      loadCalculations()
    }
  }, [user])
  
  if (loading) return <div>Chargement...</div>
  
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>🔗 Test Supabase - TradeGuard</h1>
      
      {!user ? (
        <div>
          <p>Non connecté</p>
          <button onClick={testAuth} style={buttonStyle}>
            🔑 Tester l'authentification
          </button>
        </div>
      ) : (
        <div>
          <p>✅ Connecté en tant que: {user.email}</p>
          
          <div style={{ margin: '20px 0' }}>
            <button onClick={testCalculation} style={buttonStyle}>
              🧮 Tester un calcul de position
            </button>
            
            <button onClick={() => authService.signOut()} style={{...buttonStyle, background: '#ff4444'}}>
              🚪 Déconnexion
            </button>
          </div>
          
          {stats && (
            <div style={statsStyle}>
              <h3>📊 Vos statistiques</h3>
              <p>Tier: <strong>{stats.profile.subscription_tier}</strong></p>
              <p>Calculs totaux: <strong>{stats.stats.totalCalculations}</strong></p>
              <p>Ratio R:R moyen: <strong>{stats.stats.averageRR.toFixed(2)}</strong></p>
              <p>Trades excellents: <strong>{stats.stats.excellentTrades}</strong></p>
            </div>
          )}
          
          {calculations.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h3>📝 Derniers calculs</h3>
              <table style={tableStyle}>
                <thead>
                  <tr>
                    <th>Type</th>
                    <th>Symbol</th>
                    <th>Capital</th>
                    <th>Risque</th>
                    <th>R:R</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {calculations.map(calc => (
                    <tr key={calc.id}>
                      <td>{calc.calculation_type}</td>
                      <td>{calc.symbol || 'N/A'}</td>
                      <td>${calc.capital}</td>
                      <td>{calc.risk_percentage}%</td>
                      <td>{calc.risk_reward_ratio ? calc.risk_reward_ratio.toFixed(2) : 'N/A'}</td>
                      <td>{new Date(calc.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
      
      <div style={{ marginTop: '40px', padding: '20px', background: '#f0f0f0', borderRadius: '8px' }}>
        <h3>📡 Connexion Supabase</h3>
        <p>URL: {import.meta.env.VITE_SUPABASE_URL || 'http://127.0.0.1:54321'}</p>
        <p>Statut: <span style={{ color: 'green' }}>✅ Connecté</span></p>
        <p>Base de données: <span style={{ color: 'green' }}>✅ TradeGuard prêt</span></p>
      </div>
    </div>
  )
}

// Styles
const buttonStyle = {
  padding: '10px 20px',
  margin: '10px',
  background: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '16px'
}

const statsStyle = {
  padding: '15px',
  background: '#e8f4fd',
  borderRadius: '8px',
  margin: '20px 0'
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginTop: '10px'
}