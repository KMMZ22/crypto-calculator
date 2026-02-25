// src/App.jsx - VERSION CORRIGÉE
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import './App.css';

// Components
import ProtectedRoute from './components/ProtectedRoute';


// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SelectPlan from './pages/SelectPlan';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import AdvancedCalculator from './pages/AdvancedCalculator';
import AIAdvisor from './pages/AIAdvisor';
import PnLCalculator from './pages/PnLCalculator';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Success from './pages/Success';
import StripeSuccess from './pages/StripeSuccess';
import ChartPage from './pages/Chart';
import ChartAnalysis from './pages/ChartAnalysis';


function App() {
  return (
    // ✅ Router DOIT être le parent IMMÉDIAT de tout ce qui utilise useNavigate()
    <Router>
      <AuthProvider>
        <Routes>
          {/* ===== ROUTES PUBLIQUES ===== */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/select-plan" element={<SelectPlan />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/success" element={<Success />} />
          <Route path="/PnLCalculator" element={<PnLCalculator />} />
          <Route path="/stripe-success" element={<StripeSuccess />} />
          <Route path="/chart" element={<ChartPage />} />
          {/* Calculator accessible sans compte (gestion guest intégrée) */}
          <Route path="/Calculator" element={<Calculator />} />
          <Route path="/calculator" element={<Calculator />} />

          {/* ===== ROUTES PUBLIQUES ÉTENDUES ===== */}
          <Route path="/dashboard" element={<Dashboard />} />

          <Route
            path="/advanced-calculator"
            element={
              <ProtectedRoute>
                <AdvancedCalculator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ai-advisor"
            element={
              <ProtectedRoute>
                <AIAdvisor />
              </ProtectedRoute>
            }
          />

          <Route
            path="/pnl-calculator"
            element={
              <ProtectedRoute>
                <PnLCalculator />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chart-analysis"
            element={
              <ProtectedRoute>
                <ChartAnalysis />
              </ProtectedRoute>
            }
          />

          {/* ===== REDIRECTIONS ===== */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;