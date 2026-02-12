// src/pages/Signup.jsx - VERSION CORRIGÉE (thème noir/blanc/vert)
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Mail, Lock, User, ArrowRight, AlertCircle, Globe, ChevronDown, Check, ArrowLeft } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [language, setLanguage] = useState('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showLanguageMenu) setShowLanguageMenu(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showLanguageMenu]);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      createAccount: "Créer un compte",
      subtitle: "Commencez votre essai gratuit immédiatement",
      email: "Adresse email",
      username: "Nom d'utilisateur (optionnel)",
      password: "Mot de passe",
      confirmPassword: "Confirmer le mot de passe",
      minChars: "Minimum 6 caractères",
      createButton: "Créer mon compte gratuitement",
      acceptTerms: "En créant un compte, vous acceptez nos",
      terms: "Conditions d'utilisation",
      and: "et notre",
      privacy: "Politique de confidentialité",
      haveAccount: "Déjà un compte ?",
      login: "Se connecter",
      success: "✅ Compte créé avec succès ! Redirection...",
      passwordMismatch: "Les mots de passe ne correspondent pas",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",
      security: "Sécurité bancaire",
      unlimited: "Gratuit illimité",
      protected: "Données protégées",
      back: "Retour à l'accueil"
    },
    en: {
      createAccount: "Create an account",
      subtitle: "Start your free trial immediately",
      email: "Email address",
      username: "Username (optional)",
      password: "Password",
      confirmPassword: "Confirm password",
      minChars: "Minimum 6 characters",
      createButton: "Create my free account",
      acceptTerms: "By creating an account, you agree to our",
      terms: "Terms of Use",
      and: "and our",
      privacy: "Privacy Policy",
      haveAccount: "Already have an account?",
      login: "Sign in",
      success: "✅ Account created successfully! Redirecting...",
      passwordMismatch: "Passwords do not match",
      passwordTooShort: "Password must be at least 6 characters",
      security: "Bank security",
      unlimited: "Unlimited free",
      protected: "Protected data",
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
    setSuccess('');
    
    if (formData.password !== formData.confirmPassword) {
      return setError(lang.passwordMismatch);
    }
    
    if (formData.password.length < 6) {
      return setError(lang.passwordTooShort);
    }
    
    setLoading(true);

    try {
      await signup(formData.email, formData.password);
      setSuccess(lang.success);
      setTimeout(() => {
        navigate('/select-plan');
      }, 1500);
    } catch (err) {
      console.error('Erreur signup:', err);
      setError(err.message || (language === 'fr' ? 'Erreur lors de la création du compte' : 'Error creating account'));
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
          
          <h2 className="text-2xl font-bold mb-2 text-white">{lang.createAccount}</h2>
          <p className="text-gray-400">{lang.subtitle}</p>
        </div>

        {/* Carte de formulaire - Style noir/blanc/gris */}
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-800">
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
                <User className="w-4 h-4 inline mr-2" />
                {lang.username}
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Trad3rPro"
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
              <p className="text-xs text-gray-500 mt-1">
                {lang.minChars}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                <Lock className="w-4 h-4 inline mr-2" />
                {lang.confirmPassword}
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-black border border-gray-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                <AlertCircle className="w-4 h-4 inline mr-2" />
                {error}
              </div>
            )}
            
            {success && (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm">
                ✅ {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
            >
              {loading ? '...' : (
                <>
                  {lang.createButton}
                  <ArrowRight className="ml-2 w-5 h-5" />
                </>
              )}
            </button>

            <div className="text-center text-xs text-gray-500">
              <p>
                {lang.acceptTerms}{' '}
                <Link to="/terms" className="text-white hover:text-gray-300">
                  {lang.terms}
                </Link>{' '}
                {lang.and}{' '}
                <Link to="/privacy" className="text-white hover:text-gray-300">
                  {lang.privacy}
                </Link>
              </p>
            </div>

            <div className="text-center pt-4 border-t border-gray-800">
              <p className="text-gray-400">
                {lang.haveAccount}{' '}
                <Link to="/login" className="text-white hover:text-gray-300 font-medium">
                  {lang.login}
                </Link>
              </p>
            </div>
          </form>
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
              <span className="text-xs text-gray-400">∞</span>
            </div>
            <p className="text-xs text-gray-400">{lang.unlimited}</p>
          </div>
          <div className="text-center p-3 bg-gray-900/30 rounded-xl border border-gray-800">
            <div className="w-6 h-6 bg-gray-800 rounded-lg flex items-center justify-center mx-auto mb-1">
              <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <p className="text-xs text-gray-400">{lang.protected}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;