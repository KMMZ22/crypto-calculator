// src/pages/Login.jsx - VERSION CLERK
import React from 'react';
import { 
  Container, Paper, Typography, Box, Alert 
} from '@mui/material';
import { SignIn } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ 
      mt: 8,
      minHeight: '80vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    }}>
      <Paper elevation={3} sx={{ 
        p: 4, 
        borderRadius: 2,
        position: 'relative'
      }}>
        {/* Badge Clerk */}
        <Box sx={{
          position: 'absolute',
          top: -12,
          right: 20,
          bgcolor: '#10b981',
          color: 'white',
          px: 2,
          py: 0.5,
          borderRadius: 1,
          fontSize: '0.75rem',
          fontWeight: 'bold'
        }}>
          🔒 Powered by Clerk
        </Box>
        
        <Typography variant="h4" gutterBottom align="center" fontWeight="bold">
          🔐 Connexion TradeGuard
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3 }}>
          Accédez à votre espace trader professionnel
        </Typography>

        {/* 🔥 TOUT LE SYSTÈME D'AUTH EST REMPLACÉ PAR CE COMPOSANT */}
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mt: 4 
        }}>
          <SignIn 
            routing="path"
            path="/login"
            signUpUrl="/signup"
            afterSignInUrl="/dashboard"
            appearance={{
              elements: {
                formButtonPrimary: {
                  backgroundColor: '#10b981',
                  '&:hover': {
                    backgroundColor: '#0da271'
                  }
                },
                footerActionLink: {
                  color: '#10b981',
                  '&:hover': {
                    color: '#0da271'
                  }
                },
                card: {
                  boxShadow: 'none',
                  width: '100%'
                }
              }
            }}
          />
        </Box>

        {/* Section debug - seulement en développement */}
        {process.env.NODE_ENV === 'development' && (
          <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
            <Typography variant="caption" color="text.secondary" display="block" sx={{ mb: 2 }}>
              <strong>🧪 Développement :</strong>
            </Typography>
            
            <Alert severity="info" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Fonctionnalités Clerk activées :</strong>
              </Typography>
              <Typography variant="caption" component="div">
                • ✅ Social Login (Google, GitHub)
              </Typography>
              <Typography variant="caption" component="div">
                • ✅ MFA/2FA intégré
              </Typography>
              <Typography variant="caption" component="div">
                • ✅ Gestion de sessions
              </Typography>
              <Typography variant="caption" component="div">
                • ✅ Email vérification automatique
              </Typography>
            </Alert>
            
            <Typography variant="caption" color="text.secondary">
              Les comptes de test Supabase ne sont plus utilisés.
              Créez un compte directement via le formulaire ci-dessus.
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Login;