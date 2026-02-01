import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './services/supabase';
import Landing from './pages/Landing';
import Calculator from './pages/Calculator';
import Dashboard from './pages/Dashboard'; 
import Signup from "./pages/Signup.jsx"; 
import Login from "./pages/Login"; 
import Auth from './pages/Auth';
import './App.css';
import StripeSuccess from './components/StripeSuccess';
import SelectPlan from './pages/SelectPlan';
import PnLCalculator from './pages/PnLCalculator';
import AdvancedCalculator from './pages/AdvancedCalculator';
import Terms from './pages/Terms'; 
import Privacy from "./pages/Privacy";
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier la session actuelle
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-white text-lg">Chargement...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/" element={<Landing />} />
        <Route path="/select-plan" element={session ? <SelectPlan /> : <Navigate to="/auth" />} />
        <Route path="/auth" element={<Navigate to="/signup" />} />
        
        {/* Routes protégées */}
        <Route path="/dashboard" element={session ? <Dashboard /> : <Navigate to="/auth" />} />
        <Route path="/calculator" element={session ? <Calculator /> : <Navigate to="/auth" />} />
        <Route path="/signup" element={<Signup />} /> 
        <Route path="/login" element={<Login />} /> 
        <Route path="/stripe-success" element={<StripeSuccess />} />
        <Route path="*" element={<Navigate to={session ? "/dashboard" : "/"} />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/pnl-calculator" element={<PnLCalculator />} />
          <Route path="/advanced-calculator" element={<AdvancedCalculator />} />
      </Routes>
    </Router>
  );
}

export default App;