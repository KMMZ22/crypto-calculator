import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, Check, TrendingUp, BarChart3, Lock, Zap, ChevronDown, Star, Sparkles, Award, Globe } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const screenInterval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 2);
    }, 5000);
    return () => clearInterval(screenInterval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = () => {
      if (showLanguageMenu) setShowLanguageMenu(false);
    };
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, [showLanguageMenu]);

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const toggleLanguageMenu = (e) => {
    e.stopPropagation();
    setShowLanguageMenu(!showLanguageMenu);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
  };

  // ✅ LOGIQUE DE NAVIGATION
  const handleLogin = () => {
    navigate('/login');
  };

  const handleTryFree = () => {
    navigate('/dashboard');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSignupWithPlan = (plan) => {
    navigate(`/signup?plan=${plan.toLowerCase()}`);
  };

  const handleStartFree = () => {
    navigate('/dashboard');
  };

  // ✅ TRADUCTIONS - CORRIGÉ (suppression du doublon "pricing")
  const content = {
    fr: {
      usedBy: "Utilisé par 500+ traders",
      heroTitle: "Maîtrisez votre risque.",
      heroSubtitle: "Tradez avec discipline.",
      heroDesc: "Le calculateur de position qui vous empêche de prendre des décisions émotionnelles. Calcul instantané, feedback visuel, risque sous contrôle.",
      tryFree: "Essayer gratuitement",
      noCard: "Pas de carte bancaire",
      install: "Installation en 30 secondes",
      traders: "Traders actifs",
      volume: "Volume calculé",
      uptime: "Uptime",
      rating: "Note moyenne",
      features: "Fonctionnalités",
      pricing: "Tarifs", // ✅ UNE SEULE FOIS
      faq: "FAQ",
      login: "Connexion",
      signup: "Inscription",
      problem: "Le problème",
      problemTitle: "Un seul trade mal dimensionné peut effacer",
      problemHighlight: "des semaines de profits",
      problem1: "Position trop grosse",
      problem1Desc: "Vous prenez 10% de risque sur un trade par émotion. Liquidé en quelques heures.",
      problem2: "Calculs manuels",
      problem2Desc: "Excel, calculatrice, erreurs de frappe. Vous perdez 5 minutes par trade.",
      problem3: "Pas de discipline",
      problem3Desc: "Sans système, vous tradez à l'instinct. Le marché vous punira.",
      featuresTitle: "Tout ce dont vous avez besoin.",
      featuresSubtitle: "Rien de superflu.",
      feature1: "Calcul instantané",
      feature1Desc: "Entrez vos paramètres, obtenez votre taille de position en temps réel. Risque, R:R, liquidation — tout est calculé automatiquement.",
      feature2: "Multi-positions",
      feature2Desc: "Gérez jusqu'à 10 trades simultanément. Voyez votre exposition totale en temps réel.",
      feature3: "Prix en direct",
      feature3Desc: "API Binance, Bybit, Coinbase. Les prix se mettent à jour automatiquement.",
      feature4: "100% sécurisé",
      feature4Desc: "Aucune connexion à vos exchanges. Aucune clé API stockée. Vos calculs restent privés. Hébergement EU conforme RGPD.",
      encryption: "Encryption SSL",
      rgpd: "RGPD compliant",
      anonymized: "Données anonymisées",
      pricingTitle: "Simple et transparent", // ✅ RENOMMÉ
      pricingDesc: "Commencez gratuitement. Évoluez quand vous êtes prêt.",
      free: "Gratuit",
      forever: "Pour toujours",
      free1: "1 position simultanée",
      free2: "Calculs basiques",
      free3: "R:R calculator",
      free4: "Support communauté",
      startFree: "Commencer gratuitement",
      pro: "Pro",
      perMonth: "/mois",
      pro1: "10 positions simultanées",
      pro2: "Prix live via API",
      pro3: "Historique illimité",
      pro4: "Export PDF/CSV",
      pro5: "Support prioritaire",
      choosePro: "Choisir Pro",
      elite: "Elite",
      elite1: "Tout Pro +",
      elite2: "Positions illimitées",
      elite3: "AI Trade Advisor",
      elite4: "API access",
      chooseElite: "Choisir Elite",
      trial: "Tous les plans incluent une période d'essai de 7 jours • Annulation en un clic",
      testimonials: "Témoignages",
      testimonialsTitle: "Ce que disent nos traders",
      testimonial1: "Depuis que j'utilise TradeGuard, je n'ai plus jamais été liquidé. Le calculateur de position m'a sauvé 10,000€ en 1 mois.",
      testimonial2: "L'AI advisor m'a empêché d'entrer dans 3 trades foireux hier. Best 19€/mois que je dépense.",
      testimonial3: "Enfin un outil qui comprend vraiment le crypto. La gestion multi-positions est indispensable.",
      faqTitle: "Questions fréquentes",
      faqDesc: "Tout ce que vous devez savoir sur TradeGuard",
      cta: "Prêt à trader avec discipline ?",
      ctaDesc: "Rejoignez les centaines de traders qui ont repris le contrôle de leur risk management.",
      footer: "Le calculateur de position qui protège votre capital.",
      product: "Produit",
      resources: "Ressources",
      legal: "Légal",
      documentation: "Documentation",
      blog: "Blog",
      support: "Support",
      terms: "Conditions d'utilisation",
      privacy: "Politique de confidentialité",
      legalNotices: "Mentions légales",
      rights: "Tous droits réservés."
    },
    en: {
      usedBy: "Used by 500+ traders",
      heroTitle: "Master your risk.",
      heroSubtitle: "Trade with discipline.",
      heroDesc: "The position calculator that prevents you from making emotional decisions. Instant calculation, visual feedback, risk under control.",
      tryFree: "Try for free",
      noCard: "No credit card",
      install: "30 second setup",
      traders: "Active traders",
      volume: "Volume calculated",
      uptime: "Uptime",
      rating: "Average rating",
      features: "Features",
      pricing: "Pricing", // ✅ UNE SEULE FOIS
      faq: "FAQ",
      login: "Login",
      signup: "Sign up",
      problem: "The problem",
      problemTitle: "One bad trade can wipe out",
      problemHighlight: "weeks of profits",
      problem1: "Position too large",
      problem1Desc: "You take 10% risk on a trade out of emotion. Liquidated in hours.",
      problem2: "Manual calculations",
      problem2Desc: "Excel, calculator, typos. You waste 5 minutes per trade.",
      problem3: "No discipline",
      problem3Desc: "Without a system, you trade on instinct. The market will punish you.",
      featuresTitle: "Everything you need.",
      featuresSubtitle: "Nothing superfluous.",
      feature1: "Instant calculation",
      feature1Desc: "Enter your parameters, get your position size in real time. Risk, R:R, liquidation — everything is calculated automatically.",
      feature2: "Multi-positions",
      feature2Desc: "Manage up to 10 trades simultaneously. See your total exposure in real time.",
      feature3: "Live prices",
      feature3Desc: "Binance, Bybit, Coinbase API. Prices update automatically.",
      feature4: "100% secure",
      feature4Desc: "No connection to your exchanges. No API keys stored. Your calculations remain private. EU hosting GDPR compliant.",
      encryption: "SSL Encryption",
      rgpd: "GDPR compliant",
      anonymized: "Anonymous data",
      pricingTitle: "Simple and transparent", // ✅ RENOMMÉ
      pricingDesc: "Start free. Upgrade when you're ready.",
      free: "Free",
      forever: "Forever",
      free1: "1 simultaneous position",
      free2: "Basic calculations",
      free3: "R:R calculator",
      free4: "Community support",
      startFree: "Start free",
      pro: "Pro",
      perMonth: "/month",
      pro1: "10 simultaneous positions",
      pro2: "Live prices via API",
      pro3: "Unlimited history",
      pro4: "PDF/CSV export",
      pro5: "Priority support",
      choosePro: "Choose Pro",
      elite: "Elite",
      elite1: "Everything in Pro +",
      elite2: "Unlimited positions",
      elite3: "AI Trade Advisor",
      elite4: "API access",
      chooseElite: "Choose Elite",
      trial: "All plans include a 7-day trial • Cancel anytime",
      testimonials: "Testimonials",
      testimonialsTitle: "What our traders say",
      testimonial1: "Since I started using TradeGuard, I've never been liquidated. The position calculator saved me €10,000 in 1 month.",
      testimonial2: "The AI advisor stopped me from entering 3 bad trades yesterday. Best €19/month I spend.",
      testimonial3: "Finally a tool that truly understands crypto. Multi-position management is essential.",
      faqTitle: "Frequently asked questions",
      faqDesc: "Everything you need to know about TradeGuard",
      cta: "Ready to trade with discipline?",
      ctaDesc: "Join hundreds of traders who have taken back control of their risk management.",
      footer: "The position calculator that protects your capital.",
      product: "Product",
      resources: "Resources",
      legal: "Legal",
      documentation: "Documentation",
      blog: "Blog",
      support: "Support",
      terms: "Terms of use",
      privacy: "Privacy policy",
      legalNotices: "Legal notices",
      rights: "All rights reserved."
    }
  };

  const t = content[language];

  const faqs = [
    {
      question: "Comment fonctionne le calculateur de position ?",
      answer: "Vous entrez votre capital, votre risque souhaité (en %), votre prix d'entrée et votre stop loss. TradeGuard calcule instantanément la taille de position optimale pour respecter votre risque. Aucune erreur mathématique possible."
    },
    {
      question: "Dois-je connecter mon compte d'exchange ?",
      answer: "Non, jamais. TradeGuard ne se connecte pas à vos exchanges et ne demande aucune clé API. Toutes les données sont en lecture seule via des API publiques pour les prix en temps réel. Vos fonds restent 100% sous votre contrôle."
    },
    {
      question: "Puis-je annuler mon abonnement à tout moment ?",
      answer: "Oui, absolument. Vous pouvez annuler en un clic depuis votre tableau de bord. Aucun engagement, aucune pénalité. Si vous annulez, vous gardez l'accès jusqu'à la fin de votre période payée."
    },
    {
      question: "Quelle est la différence entre Free et Pro ?",
      answer: "La version gratuite permet de gérer 1 position à la fois avec les calculs de base. Pro débloque 10 positions simultanées, les prix en direct via API, l'historique complet de vos trades, et l'export de données. Idéal si vous tradez activement."
    },
    {
      question: "L'AI Trade Advisor, c'est quoi exactement ?",
      answer: "C'est une IA entraînée sur des milliers de trades qui analyse vos positions avant que vous les preniez. Elle vous alerte si votre R:R est mauvais, si votre position est trop grosse, ou si les conditions de marché sont défavorables. Disponible uniquement en Elite."
    },
    {
      question: "Mes données sont-elles en sécurité ?",
      answer: "Oui. Nous utilisons un chiffrement SSL de niveau bancaire, hébergement en UE (RGPD compliant), et nous n'avons AUCUN accès à vos exchanges. Vos calculs et historiques sont privés et anonymisés. Nous ne vendons jamais vos données."
    }
  ];

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      {/* Gradient animé en arrière-plan */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,rgba(34,197,94,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.03),transparent_50%)]"></div>
      </div>

      {/* Navigation avec sélecteur de langue */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        scrollY > 50 ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20' : 'bg-transparent border-b border-gray-900/50'
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition"></div>
                <div className="relative">
                  <Shield className="text-white" size={24} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-black">$€¥</span>
                  </div>
                </div>
              </div>
              <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                TradeGuard
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm">
              <a href="#features" className="text-gray-400 hover:text-white transition-colors">{t.features}</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition-colors">{t.pricing}</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition-colors">{t.faq}</a>
            </div>

            <div className="flex items-center gap-3">
              {/* Sélecteur de langue */}
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

              <button 
                onClick={handleLogin}
                className="px-5 py-2 text-gray-400 text-sm font-medium hover:text-white transition-colors"
              >
                {t.login}
              </button>
              <div className="w-px h-4 bg-gray-700"></div>
              <button 
                onClick={handleSignup}
                className="group relative px-5 py-2 bg-white text-black text-sm font-medium rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-white/20"
              >
                <span className="relative z-10">{t.signup}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition"></div>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-900 to-gray-800 border border-gray-700/50 rounded-full mb-8 text-xs text-gray-300 shadow-lg backdrop-blur-sm animate-fade-in">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/50"></div>
              {t.usedBy}
              <Sparkles size={14} className="text-green-500" />
            </div>

            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-none animate-fade-in-up">
              {t.heroTitle}<br/>
              <span className="bg-gradient-to-r from-gray-500 via-gray-400 to-gray-500 bg-clip-text text-transparent">
                {t.heroSubtitle}
              </span>
            </h1>

            <p className="text-xl text-gray-400 mb-10 leading-relaxed max-w-2xl animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              {t.heroDesc}
            </p>

            <button 
              onClick={handleTryFree}
              className="group relative px-8 py-4 bg-white text-black font-semibold rounded-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-white/20 flex items-center justify-center gap-2 w-full sm:w-auto animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {t.tryFree}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </button>

            <div className="flex flex-wrap items-center gap-6 mt-8 text-sm text-gray-500 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                {t.noCard}
              </div>
              <div className="flex items-center gap-2">
                <Check size={16} className="text-green-500" />
                {t.install}
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-sm text-gray-500">{t.traders}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">€10M+</div>
            <div className="text-sm text-gray-500">{t.volume}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">99.9%</div>
            <div className="text-sm text-gray-500">{t.uptime}</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
            <div className="text-sm text-gray-500">{t.rating}</div>
          </div>
        </div>
      </section>

      {/* Screenshots */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800/50 rounded-2xl overflow-hidden backdrop-blur-sm shadow-2xl" style={{ minHeight: '600px' }}>
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>

            {/* Dashboard Screenshot */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${activeScreen === 0 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="p-8 lg:p-12 h-full flex flex-col relative z-10">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800/80">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-20"></div>
                      <div className="relative">
                        <Shield className="text-white" size={24} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-black">$€¥</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">TradeGuard Dashboard</span>
                    <span className="px-2 py-1 bg-gradient-to-r from-blue-600 to-blue-500 text-xs font-bold rounded shadow-lg">PRO</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4 mb-8">
                  <div className="group bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-green-500/5">
                    <div className="text-xs text-gray-500 mb-2">Volume tradé</div>
                    <div className="font-mono text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">€125,000</div>
                  </div>
                  <div className="group bg-black/50 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
                    <div className="text-xs text-gray-500 mb-2">Trades réalisés</div>
                    <div className="font-mono text-2xl font-bold text-green-500">42</div>
                  </div>
                  <div className="group bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-blue-500/5">
                    <div className="text-xs text-gray-500 mb-2">R:R moyen</div>
                    <div className="font-mono text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">1:2.3</div>
                  </div>
                  <div className="group bg-black/50 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all hover:shadow-lg hover:shadow-green-500/10">
                    <div className="text-xs text-gray-500 mb-2">Win rate</div>
                    <div className="font-mono text-2xl font-bold text-green-500">72%</div>
                  </div>
                </div>

                <div className="bg-black/50 border border-gray-800 rounded-xl p-6 flex-1 backdrop-blur-sm">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-semibold">Derniers trades</span>
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-800/50 rounded">5 sur 42</span>
                  </div>
                  <div className="space-y-3">
                    {[
                      { pair: 'BTC/USDT', profit: '+€250', color: 'text-green-500', bgColor: 'bg-green-500/10' },
                      { pair: 'ETH/USDT', profit: '-€120', color: 'text-red-500', bgColor: 'bg-red-500/10' },
                      { pair: 'SOL/USDT', profit: '+€320', color: 'text-green-500', bgColor: 'bg-green-500/10' },
                      { pair: 'BTC/USDT', profit: '+€180', color: 'text-green-500', bgColor: 'bg-green-500/10' },
                      { pair: 'ADA/USDT', profit: '+€95', color: 'text-green-500', bgColor: 'bg-green-500/10' }
                    ].map((trade, i) => (
                      <div key={i} className="group flex items-center justify-between py-3 px-3 border-b border-gray-800 hover:bg-gray-800/30 rounded-lg transition-all">
                        <span className="font-mono text-sm text-gray-300">{trade.pair}</span>
                        <span className={`font-mono text-sm font-bold ${trade.color} px-3 py-1 rounded ${trade.bgColor}`}>{trade.profit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Calculator Screenshot */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${activeScreen === 1 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="p-8 lg:p-12 h-full relative z-10">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-800/80">
                  <div className="flex items-center gap-3">
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg blur opacity-20"></div>
                      <div className="relative">
                        <Shield className="text-white" size={24} />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-black">$€¥</span>
                        </div>
                      </div>
                    </div>
                    <span className="font-bold text-lg">Position Calculator</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-lg shadow-yellow-500/50"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50"></div>
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="group bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
                      <div className="text-xs text-gray-500 mb-2">Capital Total</div>
                      <div className="bg-gray-900/80 rounded px-3 py-2 font-mono text-white">€10,000</div>
                    </div>
                    <div className="group bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
                      <div className="text-xs text-gray-500 mb-2">Risque par Trade</div>
                      <div className="bg-gray-900/80 rounded px-3 py-2 font-mono text-white">2%</div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="group bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
                        <div className="text-xs text-gray-500 mb-2">Entrée</div>
                        <div className="bg-gray-900/80 rounded px-3 py-2 font-mono text-sm text-white">€50,000</div>
                      </div>
                      <div className="group bg-black/50 border border-red-500/30 rounded-xl p-4 hover:border-red-500/50 transition-all">
                        <div className="text-xs text-red-400 mb-2">Stop Loss</div>
                        <div className="bg-gray-900/80 rounded px-3 py-2 font-mono text-sm text-red-500">€48,000</div>
                      </div>
                    </div>
                    <div className="group bg-black/50 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all">
                      <div className="text-xs text-green-400 mb-2">Take Profit</div>
                      <div className="bg-gray-900/80 rounded px-3 py-2 font-mono text-white">€55,000</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="relative bg-gradient-to-br from-green-500/20 to-transparent border border-green-500/40 rounded-xl p-6 overflow-hidden group hover:border-green-500/60 transition-all">
                      <div className="absolute -top-12 -right-12 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all"></div>
                      <div className="relative z-10">
                        <div className="text-xs text-green-400 mb-2 flex items-center gap-2">
                          <Sparkles size={12} />
                          Position Calculée
                        </div>
                        <div className="font-mono text-4xl font-bold mb-1 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">€5,000</div>
                        <div className="text-sm text-gray-400">0.100000 unités</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 hover:border-red-500/50 transition-all">
                        <div className="text-xs text-red-400 mb-1">Risque</div>
                        <div className="font-mono text-xl font-bold text-red-500">€200</div>
                        <div className="text-xs text-gray-500 mt-1">4.00% SL</div>
                      </div>
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 hover:border-green-500/50 transition-all">
                        <div className="text-xs text-green-400 mb-1">Profit Potentiel</div>
                        <div className="font-mono text-xl font-bold text-green-500">€500</div>
                        <div className="text-xs text-gray-500 mt-1">10.00% TP</div>
                      </div>
                    </div>

                    <div className="bg-black/50 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">Risk/Reward Ratio</span>
                        <span className="font-mono text-xl font-bold text-green-500">1:2.50</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-800">
              <button
                onClick={() => setActiveScreen(0)}
                className={`h-2 rounded-full transition-all ${
                  activeScreen === 0 ? 'w-8 bg-white shadow-lg shadow-white/50' : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label="Voir le dashboard"
              />
              <button
                onClick={() => setActiveScreen(1)}
                className={`h-2 rounded-full transition-all ${
                  activeScreen === 1 ? 'w-8 bg-white shadow-lg shadow-white/50' : 'w-2 bg-gray-600 hover:bg-gray-500'
                }`}
                aria-label="Voir le calculateur"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Le Problème */}
      <section className="px-6 py-24 border-t border-gray-900/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/5 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">{t.problem}</h2>
          <p className="text-3xl lg:text-4xl font-bold mb-12 leading-tight">
            {t.problemTitle}<br/>
            <span className="bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              {t.problemHighlight}
            </span>
          </p>

          <div className="grid md:grid-cols-3 gap-6 text-left">
            <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-red-500 font-bold mb-2 text-xl">❌ {t.problem1}</div>
              <p className="text-sm text-gray-400 leading-relaxed">{t.problem1Desc}</p>
            </div>
            <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-red-500 font-bold mb-2 text-xl">❌ {t.problem2}</div>
              <p className="text-sm text-gray-400 leading-relaxed">{t.problem2Desc}</p>
            </div>
            <div className="group p-6 bg-gradient-to-br from-gray-900/80 to-black/80 border border-gray-800 rounded-xl hover:border-red-500/30 transition-all hover:shadow-lg hover:shadow-red-500/10">
              <div className="text-red-500 font-bold mb-2 text-xl">❌ {t.problem3}</div>
              <p className="text-sm text-gray-400 leading-relaxed">{t.problem3Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-24 bg-gradient-to-b from-black via-gray-950 to-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.03),transparent_70%)]"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl mb-16">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">{t.features}</h2>
            <p className="text-4xl lg:text-5xl font-bold leading-tight">
              {t.featuresTitle}<br/>
              <span className="bg-gradient-to-r from-gray-500 to-gray-600 bg-clip-text text-transparent">
                {t.featuresSubtitle}
              </span>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 group relative p-8 bg-gradient-to-br from-green-500/10 via-transparent to-transparent border border-green-500/30 rounded-2xl overflow-hidden hover:border-green-500/50 transition-all hover:shadow-2xl hover:shadow-green-500/10">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/10 rounded-full blur-3xl group-hover:bg-green-500/20 transition-all"></div>
              <div className="relative z-10">
                <BarChart3 className="text-green-500 mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h3 className="text-2xl font-bold mb-3">{t.feature1}</h3>
                <p className="text-gray-400 mb-6 max-w-md leading-relaxed">{t.feature1Desc}</p>
                <div className="inline-flex items-center gap-2 text-sm text-green-500 font-medium group-hover:gap-3 transition-all">
                  Cœur du produit
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-white/5">
              <TrendingUp className="text-white mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-bold mb-3">{t.feature2}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.feature2Desc}</p>
            </div>

            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-yellow-500/30 transition-all hover:shadow-xl hover:shadow-yellow-500/10">
              <Zap className="text-yellow-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-bold mb-3">{t.feature3}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.feature3Desc}</p>
            </div>

            <div className="lg:col-span-2 group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <Lock className="text-gray-400 mb-4 group-hover:scale-110 group-hover:text-blue-400 transition-all" size={28} />
              <h3 className="text-2xl font-bold mb-3">{t.feature4}</h3>
              <p className="text-gray-400 mb-6 max-w-md leading-relaxed">{t.feature4Desc}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
                  <Check size={14} className="text-green-500" />
                  {t.encryption}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
                  <Check size={14} className="text-green-500" />
                  {t.rgpd}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 rounded-full">
                  <Check size={14} className="text-green-500" />
                  {t.anonymized}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-500/5 to-black"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">{t.pricing}</h2>
            <p className="text-4xl font-bold">{t.pricingTitle}</p> {/* ✅ UTILISE pricingTitle */}
            <p className="text-gray-400 mt-4">{t.pricingDesc}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Free */}
            <div className="group p-8 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-white/5">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2">{t.free}</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold">€0</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{t.forever}</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{t.free1}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{t.free2}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{t.free3}</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{t.free4}</span>
                </li>
              </ul>
              <button 
                onClick={handleStartFree}
                className="w-full py-3 border border-gray-800 rounded-lg hover:border-gray-700 hover:bg-gray-900 transition font-medium"
              >
                {t.startFree}
              </button>
            </div>

            {/* Pro */}
            <div className="relative transform md:scale-105">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-20 group-hover:opacity-30 transition"></div>
              <div className="relative p-8 bg-white text-black rounded-2xl shadow-2xl">
                <div className="mb-8">
                  <div className="text-sm text-gray-600 mb-2">{t.pro}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-4xl font-bold">€19</span>
                    <span className="text-sm text-gray-600">{t.perMonth}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Ou €190/an (économisez 17%)</div>
                </div>
                <ul className="space-y-3 mb-8 text-sm">
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>{t.pro1}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>{t.pro2}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>{t.pro3}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>{t.pro4}</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>{t.pro5}</strong></span>
                  </li>
                </ul>
                <button 
                  onClick={() => handleSignupWithPlan('PRO')}
                  className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition font-medium shadow-lg"
                >
                  {t.choosePro}
                </button>
              </div>
            </div>

            {/* Elite */}
            <div className="group p-8 border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/10">
              <div className="mb-8">
                <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                  {t.elite}
                  <Award size={14} className="text-purple-500" />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-4xl font-bold">€35</span>
                  <span className="text-sm text-gray-500">{t.perMonth}</span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Ou €350/an (économisez 17%)</div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400"><strong>{t.elite1}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400"><strong>{t.elite2}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400"><strong>{t.elite3}</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400"><strong>{t.elite4}</strong></span>
                </li>
              </ul>
              <button 
                onClick={() => handleSignupWithPlan('ELITE')}
                className="w-full py-3 border border-gray-800 rounded-lg hover:border-purple-500/50 hover:bg-purple-500/5 transition font-medium"
              >
                {t.chooseElite}
              </button>
            </div>
          </div>

          <div className="mt-12 text-center text-sm text-gray-500">
            <p>{t.trial}</p>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-6 py-24 bg-gradient-to-b from-gray-950 to-black relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(234,179,8,0.03),transparent_50%)]"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4 text-center">{t.testimonials}</h2>
          <p className="text-4xl font-bold text-center mb-16">{t.testimonialsTitle}</p>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marc D.",
                role: "Day Trader BTC",
                text: t.testimonial1,
                rating: 5,
                avatar: "M"
              },
              {
                name: "Sarah K.",
                role: "Swing Trader",
                text: t.testimonial2,
                rating: 5,
                avatar: "S"
              },
              {
                name: "Alex M.",
                role: "Trader professionnel",
                text: t.testimonial3,
                rating: 5,
                avatar: "A"
              }
            ].map((testimonial, i) => (
              <div key={i} className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all hover:shadow-xl hover:shadow-yellow-500/5">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-500 fill-yellow-500" size={16} />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 text-sm italic leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.name}</div>
                    <div className="text-xs text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="px-6 py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-green-500/5 to-black"></div>
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-sm uppercase tracking-wider text-gray-500 mb-4">FAQ</h2>
            <p className="text-4xl font-bold mb-4">{t.faqTitle}</p>
            <p className="text-gray-400">{t.faqDesc}</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className="border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 transition-all"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-900/30 transition-colors"
                >
                  <span className="font-semibold text-white pr-8">{faq.question}</span>
                  <ChevronDown 
                    size={20} 
                    className={`flex-shrink-0 text-gray-400 transition-transform ${
                      faqOpen === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <div 
                  className={`overflow-hidden transition-all duration-300 ${
                    faqOpen === index ? 'max-h-96' : 'max-h-0'
                  }`}
                >
                  <div className="px-6 pb-5 text-gray-400 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">Vous avez d'autres questions ?</p>
            <a 
              href="mailto:support@tradeguard.com" 
              className="inline-flex items-center gap-2 text-green-500 hover:text-green-400 transition-colors font-medium"
            >
              Contactez notre support
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="px-6 py-24 relative">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-green-500/10 to-black"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.1),transparent_70%)]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">{t.cta}</h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">{t.ctaDesc}</p>
          <button 
            onClick={handleStartFree}
            className="group relative px-10 py-5 bg-white text-black font-semibold text-lg rounded-lg overflow-hidden transition-all hover:shadow-2xl hover:shadow-white/30"
          >
            <span className="relative z-10 flex items-center gap-2">
              {t.startFree}
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </button>
          <p className="mt-6 text-sm text-gray-500">
            {t.noCard} • {t.install}
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-900 px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="relative">
                  <Shield className="text-white" size={20} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-[6px] font-bold text-black">$€¥</span>
                  </div>
                </div>
                <span className="font-bold">TradeGuard</span>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">{t.footer}</p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">{t.product}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#features" className="hover:text-white transition-colors">{t.features}</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">{t.pricing}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">{t.resources}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="#" className="hover:text-white transition-colors">{t.documentation}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.blog}</a></li>
                <li><a href="#faq" className="hover:text-white transition-colors">{t.faq}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.support}</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4 text-sm">{t.legal}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><a href="/terms" className="hover:text-white transition-colors">{t.terms}</a></li>
                <li><a href="/privacy" className="hover:text-white transition-colors">{t.privacy}</a></li>
                <li><a href="#" className="hover:text-white transition-colors">{t.legalNotices}</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
            <p>© 2024 TradeGuard. {t.rights}</p>
            <div className="flex items-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Discord</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Styles pour les animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
          animation-fill-mode: both;
        }
      `}</style>
    </div>
  );
}