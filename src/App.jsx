// src/App.jsx - VERSION SIMPLIFIÉE SANS FIREBASE
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import './App.css';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import SelectPlan from './pages/SelectPlan';
import Dashboard from './pages/Dashboard';
import Calculator from './pages/Calculator';
import AdvancedCalculator from './pages/AdvancedCalculator';
import AIAdvisor from './pages/AIAdvisor';
import Backtesting from './pages/Backtesting';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <Router>
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/select-plan" element={<SelectPlan />} />
          
          {/* Routes protégées */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/calculator"
            element={
              <ProtectedRoute>
                <Calculator />
              </ProtectedRoute>
            }
          />
          
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
            path="/backtesting"
            element={
              <ProtectedRoute>
                <Backtesting />
              </ProtectedRoute>
            }
          />
          
          {/* Redirections */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </ClerkProvider>
  );
}

export default App;