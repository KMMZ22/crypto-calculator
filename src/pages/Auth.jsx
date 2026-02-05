import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Shield, Mail, Lock, User, Eye, EyeOff, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const plan = searchParams.get('plan') || 'free';
  
  const planNames = {
    free: 'Gratuit',
    pro: 'PRO',
    elite: 'ELITE'
  };
  
  const planPrices = {
    free: '$0/mois',
    pro: '$19/mois',
    elite: '$49/mois'
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' ou 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (mode === 'signup') {
      if (!username.trim()) {
        newErrors.username = 'Le nom d\'utilisateur est requis';
      } else if (username.length < 3) {
        newErrors.username = 'Minimum 3 caractères';
      }
    }
    
    if (!email.trim()) {
      newErrors.email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email invalide';
    }
    
    if (!password) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (password.length < 6) {
      newErrors.password = 'Minimum 6 caractères';
    }
    
    if (mode === 'signup' && password !== confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }
    
    return newErrors;
  };

  const sendWelcomeEmail = async (userEmail, userPlan, userName) => {
    console.log(`📧 Email de bienvenue envoyé à ${userEmail} (${userName}) - Plan ${userPlan}`);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setLoading(true);
    setErrors({});

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username,
            full_name: username,
            plan: 'FREE' // ⚠️ Toujours FREE au départ
            }
          }
        });
        
        if (error) throw error;
        setSuccess(true);
        
        await sendWelcomeEmail(email, 'FREE', username);
        // Rediriger vers la selection de plan
        setTimeout(() => {
          navigate('/select-plan');
        }, 2000);
        
      } else {
        //login
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate('/dashboard');
      }
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    
    switch(field) {
      case 'username':
        setUsername(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
    }
    
    // Clear errors when typing
    if (errors[field] || errors.general) {
      const newErrors = { ...errors };
      delete newErrors[field];
      delete newErrors.general;
      setErrors(newErrors);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setErrors({});
    setUsername('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  };

  const getPlanInfo = () => {
    switch(plan.toLowerCase()) {
      case 'pro':
        return { name: 'Pro', price: '$19/mois', color: 'from-green-500 to-emerald-500' };
      case 'elite':
        return { name: 'Elite', price: '$49/mois', color: 'from-purple-500 to-blue-500' };
      default:
        return { name: 'Gratuit', price: '$0', color: 'from-gray-600 to-gray-700' };
    }
  };

  const planInfo = getPlanInfo();

  // Success screen after signup
  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-500/20 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="text-green-500" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">🎉 Inscription réussie !</h2>
          <p className="text-gray-300 mb-2">
            Bienvenue <span className="font-bold text-white">{username}</span> !
          </p>
          <p className="text-gray-400 mb-6">
            Plan : <span className="font-bold text-green-500">{planNames[plan]}</span>
          </p>
          <div className="w-full h-2 bg-gray-900 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500 animate-[progress_2s_ease-in-out_forwards]"></div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Redirection vers votre dashboard...</p>
        </div>
        
        <style>{`
          @keyframes progress {
            from { width: 0%; }
            to { width: 100%; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <Shield className="text-white" size={32} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[10px] font-bold text-black">$€¥</span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">TradeGuard</h1>
          </div>

          {/* Plan badge (only for signup) */}
          {mode === 'signup' && plan !== 'free' && (
            <div className="mb-8">
              <div className={`inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r ${planInfo.color} rounded-full text-white text-sm font-semibold`}>
                Plan {planInfo.name} • {planInfo.price}
              </div>
            </div>
          )}

          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-2">
            {mode === 'login' ? 'Bon retour !' : 'Créer un compte'}
          </h2>
          <p className="text-gray-400 mb-8">
            {mode === 'login' 
              ? 'Connectez-vous pour accéder à votre dashboard' 
              : 'Commencez à protéger votre capital dès aujourd\'hui'
            }
          </p>

          {/* Error message */}
          {errors.general && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
              <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
              <p className="text-red-400 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username (signup only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
                  Nom d'utilisateur
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={username}
                    onChange={handleChange('username')}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-900 border ${
                      errors.username ? 'border-red-500' : 'border-gray-800'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition`}
                    placeholder="Votre pseudo"
                  />
                </div>
                {errors.username && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.username}
                  </p>
                )}
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={handleChange('email')}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-900 border ${
                    errors.email ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition`}
                  placeholder="john@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange('password')}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-900 border ${
                    errors.password ? 'border-red-500' : 'border-gray-800'
                  } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition`}
                  placeholder={mode === 'signup' ? 'Minimum 6 caractères' : '••••••••'}
                  autoComplete={mode === 'login' ? "current-password" : "new-password"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Confirm Password (signup only) */}
            {mode === 'signup' && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleChange('confirmPassword')}
                    className={`w-full pl-10 pr-12 py-3 bg-gray-900 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-800'
                    } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gray-700 transition`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}

            {/* Remember me / Forgot password (login only) */}
            {mode === 'login' && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    className="w-4 h-4 bg-gray-900 border-gray-800 rounded focus:ring-0"
                  />
                  <label htmlFor="remember" className="ml-2 text-sm text-gray-400">
                    Se souvenir de moi
                  </label>
                </div>
                <button type="button" className="text-sm text-gray-400 hover:text-white transition">
                  Mot de passe oublié ?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-white text-black font-semibold rounded-lg hover:bg-gray-100 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                  {mode === 'login' ? 'Connexion...' : 'Inscription...'}
                </>
              ) : (
                <>
                  {mode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-gray-800"></div>
            <span className="text-sm text-gray-500">ou</span>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>

          {/* Toggle mode */}
          <p className="text-center text-sm text-gray-400">
            {mode === 'login' ? (
              <>
                Pas encore de compte ?{' '}
                <button onClick={toggleMode} className="text-white font-semibold hover:underline">
                  Créer un compte
                </button>
              </>
            ) : (
              <>
                Vous avez déjà un compte ?{' '}
                <button onClick={toggleMode} className="text-white font-semibold hover:underline">
                  Se connecter
                </button>
              </>
            )}
          </p>

          {/* Terms (signup only) */}
          {mode === 'signup' && (
            <p className="mt-8 text-xs text-gray-600 text-center">
              En créant un compte, vous acceptez nos{' '}
              <a href="#" className="text-gray-400 hover:text-white transition">
                Conditions d'utilisation
              </a>{' '}
              et notre{' '}
              <a href="#" className="text-gray-400 hover:text-white transition">
                Politique de confidentialité
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Right side - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-gray-900 to-black items-center justify-center p-12 border-l border-gray-800">
        <div className="max-w-md">
          <div className="mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6">
              <Shield className="text-white" size={32} />
            </div>
            <h3 className="text-3xl font-bold text-white mb-4">
              {mode === 'login' 
                ? 'Protégez votre capital avec discipline'
                : 'Rejoignez 500+ traders qui protègent leur capital'
              }
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {mode === 'login'
                ? 'Accédez à vos positions, suivez vos performances et calculez vos trades en toute sécurité.'
                : 'TradeGuard vous aide à calculer vos positions instantanément et à respecter votre gestion de risque.'
              }
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-white mb-1">500+</div>
              <div className="text-sm text-gray-400">Traders actifs</div>
            </div>
            <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-500 mb-1">$2.5M+</div>
              <div className="text-sm text-gray-400">Capital protégé</div>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Calcul instantané</h4>
                <p className="text-sm text-gray-400">
                  Position size, R:R et risque calculés automatiquement
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">100% sécurisé</h4>
                <p className="text-sm text-gray-400">
                  Aucune clé API requise. Vos données restent privées
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={14} className="text-green-500" />
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Support 24/7</h4>
                <p className="text-sm text-gray-400">
                  Notre équipe est là pour vous aider à tout moment
                </p>
              </div>
            </div>
          </div>

          {/* Testimonial */}
          <div className="mt-8 p-6 bg-gray-900/50 border border-gray-800 rounded-xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center font-bold">
                {mode === 'login' ? 'S' : 'M'}
              </div>
              <div>
                <div className="font-semibold text-white text-sm">
                  {mode === 'login' ? 'Sarah K.' : 'Marc D.'}
                </div>
                <div className="text-xs text-gray-500">
                  {mode === 'login' ? 'Swing Trader' : 'Day Trader BTC'}
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-300 italic">
              {mode === 'login' 
                ? '"TradeGuard a complètement changé ma façon de trader. Plus discipliné, plus rentable."'
                : '"Depuis que j\'utilise TradeGuard, je n\'ai plus jamais été liquidé. Best tool ever."'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}