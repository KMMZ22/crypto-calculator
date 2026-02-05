// Dans src/pages/Login.jsx - Version corrigée
import React, { useState } from 'react';
import { Container, TextField, Button, Paper, Typography, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth(); // ← ICI : signIn, PAS login
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Utilisez signIn, pas login
      const { error } = await signIn(email, password);
      
      if (error) {
        setError(error.message);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError('Erreur de connexion');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          🔐 Connexion TradeGuard
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          
          <TextField
            fullWidth
            label="Mot de passe"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
            disabled={loading}
          />
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{ mt: 3 }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>

        <Typography sx={{ mt: 3, textAlign: 'center' }}>
          Pas de compte ?{' '}
          <Button onClick={() => navigate('/signup')}>
            S'inscrire
          </Button>
        </Typography>

        {/* Comptes de test */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
          <strong>Comptes de test :</strong>
          <br/>• ELITE: elite.trader@test.com / EliteTrader2024!
          <br/>• PRO: pro.trader@test.com / ProTrader2024!
        </Typography>
      </Paper>
    </Container>
  );
};

export default Login;