import React from 'react';
import { 
  Container, 
  Typography, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  Box,
  Slider
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Backtesting = () => {
  // Données de démo pour le backtesting
  const backtestData = [
    { date: 'Jan', profit: 4000 },
    { date: 'Feb', profit: 3000 },
    { date: 'Mar', profit: 5000 },
    { date: 'Apr', profit: 2780 },
    { date: 'May', profit: 3890 },
    { date: 'Jun', profit: 2390 },
    { date: 'Jul', profit: 3490 },
  ];

  const strategies = [
    { name: 'RSI Strategy', winRate: '65%', profit: '+$2,340' },
    { name: 'MACD Crossover', winRate: '58%', profit: '+$1,890' },
    { name: 'Bollinger Bands', winRate: '72%', profit: '+$3,450' },
    { name: 'Moving Average', winRate: '61%', profit: '+$1,670' },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
        📊 Backtesting Module
      </Typography>
      <Typography variant="subtitle1" gutterBottom color="text.secondary">
        Testez vos stratégies de trading avec des données historiques
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {/* Paramètres de backtest */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              ⚙️ Paramètres du Test
            </Typography>
            
            <Box sx={{ mt: 3 }}>
              <TextField
                fullWidth
                label="Symbole"
                defaultValue="BTC/USD"
                margin="normal"
                variant="outlined"
              />
              
              <Typography gutterBottom sx={{ mt: 2 }}>
                Période: 1 Jan 2024 - 31 Dec 2024
              </Typography>
              <Slider
                defaultValue={50}
                aria-label="Default"
                valueLabelDisplay="auto"
              />
              
              <TextField
                fullWidth
                label="Capital initial"
                defaultValue="10000"
                margin="normal"
                type="number"
              />
              
              <TextField
                fullWidth
                label="Taille de position (%)"
                defaultValue="2"
                margin="normal"
                type="number"
              />
              
              <Button 
                variant="contained" 
                fullWidth 
                sx={{ mt: 3 }}
                size="large"
              >
                🚀 Lancer le Backtest
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Résultats du backtest */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              📈 Résultats du Backtest
            </Typography>
            
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={backtestData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="profit" stroke="#1976d2" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
            
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Profit Total
                    </Typography>
                    <Typography variant="h5" color="success.main">
                      +$12,450
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Taux de Gain
                    </Typography>
                    <Typography variant="h5">
                      68.5%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Maximum Drawdown
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      -12.4%
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Card>
                  <CardContent>
                    <Typography color="text.secondary" gutterBottom>
                      Sharpe Ratio
                    </Typography>
                    <Typography variant="h5">
                      1.85
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Stratégies prédéfinies */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🤖 Stratégies Prédéfinies
            </Typography>
            <Grid container spacing={2}>
              {strategies.map((strategy, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {strategy.name}
                      </Typography>
                      <Typography color="text.secondary">
                        Taux de réussite: {strategy.winRate}
                      </Typography>
                      <Typography variant="h6" color="success.main" sx={{ mt: 1 }}>
                        {strategy.profit}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        sx={{ mt: 2 }}
                        size="small"
                      >
                        Tester cette stratégie
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Historique des tests */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              📋 Historique des Backtests
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Stratégie</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Symbole</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Période</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Résultat</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '12px' }}>2024-01-15</td>
                    <td style={{ padding: '12px' }}>RSI Strategy</td>
                    <td style={{ padding: '12px' }}>BTC/USD</td>
                    <td style={{ padding: '12px' }}>30 jours</td>
                    <td style={{ padding: '12px', color: 'green' }}>+$1,234</td>
                    <td style={{ padding: '12px' }}>
                      <Button size="small" variant="outlined">Voir détails</Button>
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: '#fafafa' }}>
                    <td style={{ padding: '12px' }}>2024-01-10</td>
                    <td style={{ padding: '12px' }}>MACD Crossover</td>
                    <td style={{ padding: '12px' }}>ETH/USD</td>
                    <td style={{ padding: '12px' }}>60 jours</td>
                    <td style={{ padding: '12px', color: 'green' }}>+$876</td>
                    <td style={{ padding: '12px' }}>
                      <Button size="small" variant="outlined">Voir détails</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Backtesting;