// src/pages/Signup.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('📝 Tentative inscription...', { email, username });

      // 🔴 ÉTAPE 1 : Déconnecter l'utilisateur actuel s'il existe
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        console.log('👤 Session existante détectée, déconnexion...');
        await supabase.auth.signOut();
        // Vider le localStorage des clés Supabase (optionnel mais robuste)
        // Note: la clé exacte dépend de votre projet, on vide tout pour être sûr
        localStorage.clear();
        // Petit délai pour que la déconnexion soit prise en compte
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // 🔴 ÉTAPE 2 : Inscription
      const result = await signup(email, password, username);
      
      if (result.success) {
        console.log('✅ Inscription réussie!');
        // ✅ REDIRECTION VERS SELECT PLAN
        navigate('/SelectPlan', { replace: true });
      } else {
        // Gestion spécifique des erreurs
        if (result.error?.includes('rate limit')) {
          setError('Trop de tentatives. Veuillez attendre quelques minutes.');
        } else if (result.error?.includes('invalid')) {
          setError('Email invalide. Veuillez utiliser une adresse valide (ex: nom@domaine.com).');
        } else {
          setError(result.error || 'Erreur lors de l\'inscription');
        }
      }
    } catch (err) {
      console.error('❌ Erreur:', err);
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0B0D] flex items-center justify-center p-4">
      {/* ... reste du JSX inchangé ... */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(99,102,241,0.05),transparent_50%)]"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg blur opacity-20"></div>
            <div className="relative bg-[#131517] p-3 rounded-lg">
              <Shield className="text-[#6366F1]" size={32} />
            </div>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#131517] border border-[#1E1F23] rounded-xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Créer un compte
          </h1>
          <p className="text-gray-400 text-center mb-8">
            Rejoignez TradeGuard pour protéger votre capital
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nom d'utilisateur
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white placeholder-gray-600 focus:border-[#6366F1] focus:outline-none transition"
                  placeholder="JohnDoe"
                  required
                  minLength={3}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white placeholder-gray-600 focus:border-[#6366F1] focus:outline-none transition"
                  placeholder="exemple@email.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-[#1A1C20] border border-[#1E1F23] rounded-lg text-white placeholder-gray-600 focus:border-[#6366F1] focus:outline-none transition"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Minimum 6 caractères
              </p>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#6366F1] text-white rounded-lg font-medium hover:bg-[#4F52E0] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Inscription...</span>
                </>
              ) : (
                <>
                  <span>S'inscrire</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                </>
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-gray-500 text-sm">
            Déjà un compte ?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-[#6366F1] hover:text-[#8183F4] transition font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
          En créant un compte, vous acceptez nos{' '}
          <a href="/terms" className="text-gray-500 hover:text-gray-400 transition">
            conditions d'utilisation
          </a>{' '}
          et notre{' '}
          <a href="/privacy" className="text-gray-500 hover:text-gray-400 transition">
            politique de confidentialité
          </a>
        </p>
      </div>
    </div>
  );
}