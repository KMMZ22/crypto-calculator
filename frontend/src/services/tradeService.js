import { supabase } from '../lib/supabase';

export const tradeService = {
  // Sauvegarder un trade
  async saveTrade(tradeData) {
    const { data, error } = await supabase
      .from('trades')
      .insert([tradeData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Récupérer tous les trades d'un utilisateur
  async getUserTrades(userId) {
    const { data, error } = await supabase
      .from('trades')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Récupérer les stats d'un utilisateur
  async getUserStats(userId) {
    try {
      const trades = await this.getUserTrades(userId);
      
      if (trades.length === 0) {
        return {
          totalTrades: 0,
          totalVolume: 0,
          averageRR: 0,
          winRate: 0,
          riskSaved: 0,
          favoritePair: 'N/A'
        };
      }
      
      const totalTrades = trades.length;
      const winningTrades = trades.filter(t => t.status === 'win').length;
      const winRate = Math.round((winningTrades / totalTrades) * 100);
      
      const totalVolume = trades.reduce((sum, trade) => 
        sum + (parseFloat(trade.position_size) || 0), 0
      );
      
      const totalRR = trades.reduce((sum, trade) => 
        sum + (parseFloat(trade.rr_ratio) || 0), 0
      );
      const averageRR = totalTrades > 0 ? totalRR / totalTrades : 0;
      
      const riskSaved = trades.reduce((sum, trade) => {
        const position = parseFloat(trade.position_size) || 0;
        const risk = parseFloat(trade.risk_percentage) || 0;
        return sum + (position * risk / 100);
      }, 0);
      
      const pairCount = {};
      trades.forEach(trade => {
        if (trade.symbol) {
          pairCount[trade.symbol] = (pairCount[trade.symbol] || 0) + 1;
        }
      });
      
      const favoritePair = Object.entries(pairCount)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A';
      
      return {
        totalTrades,
        totalVolume,
        averageRR,
        winRate,
        riskSaved,
        favoritePair
      };
      
    } catch (error) {
      console.error('Get stats error:', error);
      throw error;
    }
  },

  // Mettre à jour un trade
  async updateTrade(tradeId, updates) {
    const { data, error } = await supabase
      .from('trades')
      .update(updates)
      .eq('id', tradeId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Supprimer un trade
  async deleteTrade(tradeId) {
    const { error } = await supabase
      .from('trades')
      .delete()
      .eq('id', tradeId);
    
    if (error) throw error;
  }
};