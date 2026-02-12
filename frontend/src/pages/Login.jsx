// src/pages/Login.jsx - VERSION CORRIGÉE (thème noir/blanc/vert)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Shield, Mail, Lock, ArrowRight, AlertCircle, Globe, ChevronDown, Check, ArrowLeft } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [language, setLanguage] = useState('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showLanguageMenu) setShowLanguageMenu(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showLanguageMenu]);

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  const toggleLanguageMenu = (e) => {
    e.stopPropagation();
    setShowLanguageMenu(!showLanguageMenu);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  // ✅ TRADUCTIONS - Thème noir/blanc
  const t = {
    fr: {
      login: "Connexion",
      subtitle: "Accède à ton espace trader professionnel",
      google: "Continuer avec Google",
      or: "Ou",
      email: "Adresse email",
      password: "Mot de passe",
      forgotPassword: "Mot de passe oublié ?",
      loginButton: "Se connecter",
      noAccount: "Pas encore de compte ?",
      signup: "S'inscrire",
      resetTitle: "Réinitialisation du mot de passe",
      resetDesc: "Entre ton email pour recevoir un lien de réinitialisation",
      sendLink: "Envoyer le lien",
      cancel: "Annuler",
      emailSent: "📧 Email de réinitialisation envoyé !",
      security: "Sécurité bancaire",
      analytics: "Analyses avancées",
      precision: "Calculs précis",
      back: "Retour à l'accueil"
    },
    en: {
      login: "Login",
      subtitle: "Access your professional trader space",
      google: "Continue with Google",
      or: "Or",
      email: "Email address",
      password: "Password",
      forgotPassword: "Forgot password?",
      loginButton: "Sign in",
      noAccount: "Don't have an account?",
      signup: "Sign up",
      resetTitle: "Reset password",
      resetDesc: "Enter your email to receive a reset link",
      sendLink: "Send reset link",
      cancel: "Cancel",
      emailSent: "📧 Reset email sent!",
      security: "Bank security",
      analytics: "Advanced analytics",
      precision: "Precise calculations",
      back: "Back to home"
    }
  };

  const lang = t[language];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Erreur connexion:', err);
      setError(err.message || (language === 'fr' ? 'Email ou mot de passe incorrect' : 'Invalid email or password'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      if (error) throw error;
    } catch (err) {
      console.error('Erreur Google login:', err);
      setError(err.message || (language === 'fr' ? 'Erreur lors de la connexion Google' : 'Google login error'));
    }
  };

  const handleResetPassword = async () => {
    if (!formData.email) {
      setError(language === 'fr' ? 'Veuillez entrer votre email' : 'Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setError(lang.emailSent);
      setShowResetPassword(false);
    } catch (err) {
      console.error('Erreur reset password:', err);
      setError(err.message || (language === 'fr' ? 'Erreur lors de l\'envoi' : 'Error sending email'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-md mx-auto">
        
        {/* ✅ BOUTON RETOUR + SÉLECTEUR LANGUE */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
          >
            <ArrowLeft size={18} />
            <span className="text-sm">{lang.back}</span>
          </button>

          <div className="relative">
            <button
              onClick={toggleLanguageMenu}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800/50"
            >
              <Globe size={18} />
              <span className="text-sm uppercase">{language}</span>
              <ChevronDown size={14} className={`transition-transform ${showLanguageMenu ? 'rotate-180' : ''}`} />
            </button>
            
            {showLanguageMenu && (
              <div 
                className="absolute right-0 mt-2 w-32 bg-gray-900 border border-gray-800 rounded-lg shadow-xl backdrop-blur-xl z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => changeLanguage('fr')}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                    language === 'fr' ? 'text-green-500 bg-gray-800/50' : 'text-gray-300'
                  }`}
                >
                  <span className="text-base">🇫🇷</span>
                  <span>Français</span>
                  {language === 'fr' && <Check size={14} className="ml-auto" />}
                </button>
                <button
                  onClick={() => changeLanguage('en')}
                  className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${
                    language === 'en' ? 'text-green-500 bg-gray-800/50' : 'text-gray-300'
                  }`}
                >
                  <span className="text-base">🇬🇧</span>
                  <span>English</span>
                  {language === 'en' && <Check size={14} className="ml-auto" />}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Header - SANS badge Supabase */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition"></div>
              <div className="relative">
                <Shield className="text-white" size={32} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black">$€¥</span>
                </div>
              </div>
            </div>
            <h1 className="text-3xl font-bold ml-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              TradeGuard
            </h1>
          </div>
          
          <h2 className="text-2xl font-bold mb-2 text-white">{lang.login}</h2>
          <p className="text-gray-400">{lang.subtitle}</p>
        </div>

        {/* Carte de formulaire - Style noir/blanc/gris */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
          {showResetPassword ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2 text-white">{lang.resetTitle}</h3>
                <p className="text-gray-400">{lang.resetDesc}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  <Mail className="w-4 h-4 inline mr-2" />
                  {lang.email}
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="ton@email.com"
                />
              </div>

              {error && (
                <div className={`p-4 rounded-xl text-sm ${error.includes('📧') ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                  {error}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleResetPassword}
                  disabled={loading || !formData.email}
                  className="flex-1 py-3 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-medium transition-colors text-white border border-gray-700"
                >
                  {loading ? '...' : lang.sendLink}
                </button>
                <button
                  onClick={() => setShowResetPassword(false)}
                  className="flex-1 py-3 bg-black hover:bg-gray-900 rounded-xl font-medium transition-colors text-gray-300 border border-gray-800"
                >
                  {lang.cancel}
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Google Button - Style noir */}
              <button
                onClick={handleGoogleLogin}
                className="w-full mb-6 py-3 bg-black hover:bg-gray-900 border border-gray-800 rounded-xl font-medium flex items-center justify-center transition-colors text-gray-300"
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {lang.google}
              </button>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-gray-900 text-gray-500">{lang.or}</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Mail className="w-4 h-4 inline mr-2" />
                    {lang.email}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="ton@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    <Lock className="w-4 h-4 inline mr-2" />
                    {lang.password}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="••••••••"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    className="text-sm text-gray-400 hover:text-white font-medium"
                  >
                    {lang.forgotPassword}
                  </button>
                </div>

                {error && !error.includes('📧') && (
                  <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                >
                  {loading ? '...' : (
                    <>
                      {lang.loginButton}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </>
                  )}
                </button>

                <div className="text-center pt-4 border-t border-gray-800">
                  <p className="text-gray-400">
                    {lang.noAccount}{' '}
                    <Link to="/signup" className="text-white hover:text-gray-300 font-medium transition-colors">
                      {lang.signup}
                    </Link>
                  </p>
                </div>
              </form>
            </>
          )}
        </div>

        {/* Features - Style noir/blanc */}
        <div className="mt-8 grid grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-1">
              <Shield className="w-3 h-3 text-gray-400" />
            </div>
            <p className="text-xs text-gray-400">{lang.security}</p>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">{lang.analytics}</p>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">{lang.precision}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;