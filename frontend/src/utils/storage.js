export class TradeStorage {
  constructor() {
    this.STORAGE_KEY = 'tradeguard_trades';
  }

  saveTrade(tradeData) {
    const trades = this.getAllTrades();
    const newTrade = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...tradeData
    };
    
    trades.unshift(newTrade); // Ajouter au début
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trades));
    return newTrade;
  }

  getAllTrades() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading trades:', error);
      return [];
    }
  }

  getTradeCount() {
    return this.getAllTrades().length;
  }

  clearTrades() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  exportToCSV() {
    const trades = this.getAllTrades();
    if (trades.length === 0) return '';
    
    const headers = ['Date', 'Symbol', 'Capital', 'Risk %', 'Position Size', 'Profit', 'R:R'];
    const rows = trades.map(trade => [
      new Date(trade.timestamp).toLocaleDateString(),
      trade.symbol || 'BTCUSDT',
      trade.capital,
      trade.riskPercent,
      trade.positionSize,
      trade.profit,
      `1:${trade.rrRatio?.toFixed(2) || '0'}`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}


export const tradeStorage = {
  saveTrade: () => {},
  getTradeCount: () => 0
};