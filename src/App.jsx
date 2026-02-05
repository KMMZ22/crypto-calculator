// Dans src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AuthProvider } from './contexts/AuthContext';

// Components - utilisez ce que vous avez réellement
import ProtectedRoute from "./components/ProtectedRoute";
import ElitePlanGuard from "./components/ElitePlanGuard";

// Pages - utilisez les fichiers que vous avez réellement
import Dashboard from "./pages/Dashboard";
import Calculator from "./pages/Calculator";  // Au lieu de Calculators.jsx
import AIAdvisor from "./pages/AIAdvisor";
import Auth from "./pages/Auth";  // Au lieu de Settings.jsx
import SelectPlan from "./pages/SelectPlan";  // Au lieu de Billing.jsx
import Login from "./pages/Login";
import Signup from "./pages/Signup";  // Notez 'Signup' pas 'SignUp'
import Backtesting from "./pages/Backtesting";

// Pour les autres pages que vous avez
import AdvancedCalculator from "./pages/AdvancedCalculator";
import PnLCalculator from "./pages/PnLCalculator";
import Checkout from "./pages/Checkout";
import Landing from "./pages/Landing";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Routes publiques */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              
              {/* Routes protégées */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
              <Route path="/advanced-calculator" element={<ProtectedRoute><AdvancedCalculator /></ProtectedRoute>} />
              <Route path="/pnl-calculator" element={<ProtectedRoute><PnLCalculator /></ProtectedRoute>} />
              <Route path="/ai-advisor" element={
                <ProtectedRoute>
                  <ElitePlanGuard>
                    <AIAdvisor />
                  </ElitePlanGuard>
                </ProtectedRoute>
              } />
              <Route path="/backtesting" element={<ProtectedRoute><Backtesting /></ProtectedRoute>} />
              <Route path="/auth" element={<ProtectedRoute><Auth /></ProtectedRoute>} />
              <Route path="/select-plan" element={<ProtectedRoute><SelectPlan /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;