import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, ArrowRight, Check, TrendingUp, BarChart3, Lock, Zap, ChevronDown, Star, Sparkles, Award, Globe } from 'lucide-react';
import LiquidEther from '../components/LiquidEther';
import SplitText from '../components/SplitText';
import AnimatedCounter from '../components/AnimatedCounter';

export default function Landing() {
  const navigate = useNavigate();
  const [activeScreen, setActiveScreen] = useState(0);
  const [faqOpen, setFaqOpen] = useState(null);
  const [scrollY, setScrollY] = useState(0);
  const [language, setLanguage] = useState('fr');
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);

  useEffect(() => {
    const screenInterval = setInterval(() => {
      setActiveScreen((prev) => (prev + 1) % 4); // Modified to 4 screens
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
      feature5: "Trading Live Chart",
      feature5Desc: "Suivez le marché en temps réel. Accédez aux paires Binance instantanément avec vos indicateurs favoris.",
      feature6: "AI Chart Analysis",
      feature6Desc: "Envoyez une capture de votre graphique et laissez l'IA l'analyser pour vous donner la tendance, les supports et les résistances.",
      feature7: "AI Trade Advisor",
      feature7Desc: "Notre IA analyse vos trades avant validation. Elle vous avertit si votre R:R est faible ou si vous prenez trop de risque par rapport aux conditions du marché.",
      pricingTitle: "Simple et transparent", // ✅ RENOMMÉ
      pricingDesc: "Commencez gratuitement. Évoluez quand vous êtes prêt.",
      free: "Gratuit",
      forever: "Pour toujours",
      free1: "1 position simultanée",
      free2: "Calculs basiques",
      free3: "R:R calculator",
      free4: "2 Analyses de graphiques IA/mois",
      free5: "Support communauté",
      startFree: "Commencer gratuitement",
      pro: "Pro",
      perMonth: "/mois",
      pro1: "10 positions simultanées",
      pro2: "Prix live via API",
      pro3: "Historique illimité",
      pro4: "50 Analyses de graphiques IA/mois",
      pro5: "Export PDF/CSV",
      pro6: "Support prioritaire",
      choosePro: "Choisir Pro",
      elite: "Elite",
      elite1: "Tout Pro +",
      elite2: "Positions illimitées",
      elite3: "200 Analyses de graphiques IA/mois",
      elite4: "AI Trade Advisor",
      elite5: "API access",
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
      feature5: "Live Trading Chart",
      feature5Desc: "Track the market in real-time. Instantly access Binance pairs with your favorite technical indicators.",
      feature6: "AI Chart Analysis",
      feature6Desc: "Upload a screenshot of your chart and let the AI analyze it, identifying trends, supports, and resistances.",
      feature7: "AI Trade Advisor",
      feature7Desc: "Our AI analyzes your trades before execution. It warns you if your R:R is weak or if you are taking too much risk based on market conditions.",
      pricingTitle: "Simple and transparent", // ✅ RENOMMÉ
      pricingDesc: "Start free. Upgrade when you're ready.",
      free: "Free",
      forever: "Forever",
      free1: "1 simultaneous position",
      free2: "Basic calculations",
      free3: "R:R calculator",
      free4: "2 AI Chart Analyses/month",
      free5: "Community support",
      startFree: "Start free",
      pro: "Pro",
      perMonth: "/month",
      pro1: "10 simultaneous positions",
      pro2: "Live prices via API",
      pro3: "Unlimited history",
      pro4: "50 AI Chart Analyses/month",
      pro5: "PDF/CSV export",
      pro6: "Priority support",
      choosePro: "Choose Pro",
      elite: "Elite",
      elite1: "Everything in Pro +",
      elite2: "Unlimited positions",
      elite3: "200 AI Chart Analyses/month",
      elite4: "AI Trade Advisor",
      elite5: "API access",
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
    <div className="bg-transparent text-white min-h-screen overflow-x-hidden">
      {/* Liquid Ether animated background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: -10, pointerEvents: 'none', width: '100vw', height: '100vh' }}>
        <LiquidEther
          colors={['#5227FF', '#FF9FFC', '#B19EEF']}
          mouseForce={20}
          cursorSize={100}
          isViscous
          viscous={30}
          resolution={0.5}
          autoDemo
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
          style={{ width: '100%', height: '100%' }}
        />
        {/* light overlay to keep text readable */}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
      </div>

      {/* Navigation avec sélecteur de langue */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-black/90 backdrop-blur-xl border-b border-gray-800/50 shadow-lg shadow-black/20' : 'bg-transparent border-b border-gray-900/50'
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
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${language === 'fr' ? 'text-green-500 bg-gray-800/50' : 'text-gray-300'
                        }`}
                    >
                      <span className="text-base">🇫🇷</span>
                      <span>Français</span>
                      {language === 'fr' && <Check size={14} className="ml-auto" />}
                    </button>
                    <button
                      onClick={() => changeLanguage('en')}
                      className={`w-full px-4 py-2.5 text-left text-sm hover:bg-gray-800 transition-colors flex items-center gap-2 ${language === 'en' ? 'text-green-500 bg-gray-800/50' : 'text-gray-300'
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

            <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-none">
              <SplitText
                text={t.heroTitle}
                tag="span"
                className="block text-white"
                splitType="chars"
                delay={35}
                duration={0.9}
                ease="power3.out"
                from={{ opacity: 0, y: 60, rotateX: -15 }}
                to={{ opacity: 1, y: 0, rotateX: 0 }}
                textAlign="left"
                threshold={0.2}
                rootMargin="0px"
              />
              <SplitText
                text={t.heroSubtitle}
                tag="span"
                className="block text-gray-400"
                splitType="chars"
                delay={30}
                duration={0.9}
                ease="power3.out"
                from={{ opacity: 0, y: 60 }}
                to={{ opacity: 1, y: 0 }}
                textAlign="left"
                threshold={0.2}
                rootMargin="0px"
              />
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

        {/* Stats Animées - Marquee */}
        <div className="w-full mt-24 overflow-hidden py-10 relative">
          {/* Gradients pour cacher les bords */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-marquee whitespace-nowrap gap-16 md:gap-32 w-max">
            {/* On duplique le set de stats pour l'effet infini */}
            {[...Array(2)].map((_, idx) => (
              <div key={idx} className="flex gap-16 md:gap-32 items-center">
                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter value="500" suffix="+" duration={2000} />
                  </div>
                  <div className="text-sm font-medium text-gray-500 tracking-wider uppercase">{t.traders}</div>
                </div>

                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter value="10" prefix="€" suffix="M+" duration={2500} />
                  </div>
                  <div className="text-sm font-medium text-gray-500 tracking-wider uppercase">{t.volume}</div>
                </div>

                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter value="99.9" suffix="%" duration={1500} />
                  </div>
                  <div className="text-sm font-medium text-gray-500 tracking-wider uppercase">{t.uptime}</div>
                </div>

                <div className="text-center group">
                  <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2">
                    <AnimatedCounter value="4.9" suffix="/5" duration={1500} />
                  </div>
                  <div className="text-sm font-medium text-gray-500 tracking-wider uppercase">{t.rating}</div>
                </div>
              </div>
            ))}
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

                {/* Header du faux composant */}
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-[#1AE5A1]/10 flex items-center justify-center border border-[#1AE5A1]/20">
                    <Shield size={16} className="text-[#1AE5A1]" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Position Calculator</h2>
                </div>

                {/* Contenu du Calculator Mock */}
                <div className="grid lg:grid-cols-[1fr,400px] gap-8">

                  {/* Inputs Section */}
                  <div className="space-y-4">
                    <div className="bg-[#0A0E17] border border-gray-800/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">Capital Total</div>
                      <div className="w-full bg-[#121826] border border-gray-800 rounded-lg p-3 text-white font-mono">
                        €10,000
                      </div>
                    </div>

                    <div className="bg-[#0A0E17] border border-gray-800/50 rounded-xl p-4">
                      <div className="text-sm text-gray-400 mb-2">Risque par Trade (%)</div>
                      <div className="w-full bg-[#121826] border border-gray-800 rounded-lg p-3 text-white font-mono">
                        2.0
                      </div>
                    </div>

                    <div className="bg-[#0A0E17] border border-[#1AE5A1]/20 rounded-xl p-4 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#1AE5A1]/5 rounded-bl-[100px] pointer-events-none"></div>
                      <div className="flex justify-between items-center mb-4 relative z-10">
                        <div className="text-sm text-[#1AE5A1] font-medium flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1AE5A1]"></div>
                          Entrée
                        </div>
                      </div>
                      <div className="w-full bg-[#121826] border border-gray-800 rounded-lg p-3 text-white font-mono relative z-10">
                        €50,000
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0A0E17] border border-red-500/20 rounded-xl p-4">
                        <div className="text-sm text-red-400 font-medium mb-2">Stop Loss</div>
                        <div className="w-full bg-[#121826] border border-red-500/30 rounded-lg p-3 text-red-400 font-mono">
                          €48,000
                        </div>
                      </div>

                      <div className="bg-[#0A0E17] border border-green-500/20 rounded-xl p-4">
                        <div className="text-sm text-green-400 font-medium mb-2">Take Profit</div>
                        <div className="w-full bg-[#121826] border border-green-500/30 rounded-lg p-3 text-green-400 font-mono">
                          €55,000
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Results Section */}
                  <div className="space-y-4">
                    {/* Main Result Card */}
                    <div className="bg-[#0A0E17] border border-[#1AE5A1]/30 rounded-2xl p-6 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-48 h-48 bg-[#1AE5A1]/10 rounded-bl-[150px] blur-2xl"></div>
                      <div className="relative z-10">
                        <div className="text-sm text-[#1AE5A1] font-medium mb-3 flex items-center gap-2">
                          <Sparkles size={14} /> Position Calculée
                        </div>
                        <div className="text-5xl font-bold text-[#1AE5A1] tracking-tight mb-2">
                          €5,000
                        </div>
                        <div className="text-gray-400 flex items-center gap-2">
                          ≈ 0.100 BTC
                        </div>
                      </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[#0A0E17] border border-red-500/20 rounded-xl p-5">
                        <div className="text-xs text-red-500/70 font-medium mb-1 uppercase tracking-wider">Risque</div>
                        <div className="text-2xl font-bold text-red-500">€200</div>
                        <div className="text-xs text-gray-500 mt-2">4.00% du prix</div>
                      </div>

                      <div className="bg-[#0A0E17] border border-green-500/20 rounded-xl p-5">
                        <div className="text-xs text-green-500/70 font-medium mb-1 uppercase tracking-wider">Gain Potentiel</div>
                        <div className="text-2xl font-bold text-green-500">€500</div>
                        <div className="text-xs text-gray-500 mt-2">10.00% du prix</div>
                      </div>
                    </div>

                    <div className="bg-[#0A0E17] border border-gray-800/50 rounded-xl p-5 flex items-center justify-between">
                      <span className="text-sm text-gray-400 font-medium">Risk/Reward Ratio</span>
                      <span className="text-xl font-bold text-white">1:2.50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trading Chart Screenshot (Active Screen 2) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${activeScreen === 2 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="p-8 lg:p-12 h-full relative z-10 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                    <BarChart3 size={16} className="text-blue-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Live Trading Chart</h2>
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-bold rounded shadow-lg ml-2 border border-blue-500/30">BINANCE</span>
                </div>

                <div className="flex-1 bg-[#0A0E17] border border-gray-800/80 rounded-2xl overflow-hidden flex flex-col relative">
                  {/* Top Bar */}
                  <div className="h-14 border-b border-gray-800/80 flex items-center px-4 justify-between bg-[#0A0E17]/80 backdrop-blur-sm z-10">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-white">BTC/USDT</span>
                        <span className="text-green-500 font-mono">64,230.50</span>
                      </div>
                      <div className="w-px h-6 bg-gray-800"></div>
                      <div className="flex gap-2">
                        {['1m', '5m', '15m', '1H', '4H', '1D'].map((tf, i) => (
                          <div key={tf} className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${i === 3 ? 'bg-blue-500/20 text-blue-400' : 'text-gray-500 hover:text-gray-300'}`}>{tf}</div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Chart Area Mock */}
                  <div className="flex-1 relative bg-[#05080E] p-4 flex flex-col justify-end">
                    {/* Grid lines */}
                    <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

                    {/* Candlesticks Mock (Enhanced) */}
                    <div className="relative z-10 w-full h-full flex items-end justify-between px-6 pb-4">
                      {/* Volume Bars */}
                      <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-between px-6 opacity-30">
                        {[40, 60, 30, 80, 50, 90, 45, 70, 55, 65, 35, 85, 40, 75, 50].map((h, i) => (
                          <div key={i} className={`w-4 flex-shrink-0 ${i % 3 === 0 ? 'bg-red-500' : 'bg-green-500'}`} style={{ height: `${h}%` }}></div>
                        ))}
                      </div>

                      {/* Moving Averages SVG */}
                      <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                        {/* 50 EMA */}
                        <path d="M0,80 Q15,75 25,78 T45,65 T65,58 T85,35 T100,28" fill="none" stroke="#eab308" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" strokeDasharray="2,2" />
                        {/* 20 EMA */}
                        <path d="M0,75 Q15,70 25,65 T45,50 T65,42 T85,20 T100,12" fill="none" stroke="#3b82f6" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                      </svg>

                      {/* Candlesticks */}
                      {[
                        { o: 75, c: 80, h: 72, l: 85, isUp: false },
                        { o: 80, c: 68, h: 65, l: 82, isUp: true },
                        { o: 68, c: 72, h: 65, l: 75, isUp: false },
                        { o: 72, c: 55, h: 50, l: 75, isUp: true },
                        { o: 55, c: 45, h: 40, l: 60, isUp: true },
                        { o: 45, c: 50, h: 42, l: 55, isUp: false },
                        { o: 50, c: 35, h: 30, l: 52, isUp: true },
                        { o: 35, c: 38, h: 32, l: 45, isUp: false },
                        { o: 38, c: 20, h: 15, l: 42, isUp: true },
                        { o: 20, c: 25, h: 15, l: 30, isUp: false },
                        { o: 25, c: 22, h: 18, l: 28, isUp: true },
                        { o: 22, c: 10, h: 5, l: 25, isUp: true },
                        { o: 10, c: 15, h: 5, l: 20, isUp: false },
                        { o: 15, c: 12, h: 8, l: 18, isUp: true },
                        { o: 12, c: 5, h: 2, l: 15, isUp: true }
                      ].map((candle, i) => {
                        const top = Math.min(candle.o, candle.c);
                        const bodyHeight = Math.abs(candle.c - candle.o);
                        const high = Math.min(candle.h, candle.l);
                        const low = Math.max(candle.h, candle.l);

                        return (
                          <div key={i} className="relative flex justify-center w-4 h-full group z-10 flex-shrink-0 cursor-crosshair">
                            {/* Wick */}
                            <div className={`absolute w-0.5 ${candle.isUp ? 'bg-green-500' : 'bg-red-500'} group-hover:bg-white transition-colors`} style={{ top: `${high}%`, bottom: `${100 - low}%` }}></div>
                            {/* Body */}
                            <div className={`w-full ${candle.isUp ? 'bg-green-500' : 'bg-red-500'} absolute group-hover:bg-white transition-colors rounded-[1px] shadow-sm`} style={{ top: `${top}%`, height: `${Math.max(1, bodyHeight)}%` }}></div>

                            {/* Simple Tooltip on hover */}
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#121826] border border-gray-700 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-20 pointer-events-none transition-opacity shadow-lg flex flex-col items-center">
                              <span className={candle.isUp ? 'text-green-400' : 'text-red-400'}>
                                {candle.isUp ? '+' : '-'}{(Math.random() * 1.5 + 0.1).toFixed(2)}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Chart Analysis Screenshot (Active Screen 3) */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${activeScreen === 3 ? 'opacity-100' : 'opacity-0'}`}>
              <div className="p-8 lg:p-12 h-full relative z-10 flex flex-col">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                    <Sparkles size={16} className="text-purple-500" />
                  </div>
                  <h2 className="text-xl font-bold text-white">AI Chart Analysis</h2>
                  <span className="px-2 py-0.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs font-bold rounded shadow-lg ml-2">ELITE</span>
                </div>

                <div className="flex-1 grid lg:grid-cols-[400px,1fr] gap-8">
                  {/* Upload Zone Mock with Simulated Image */}
                  <div className="bg-[#0A0E17] border border-gray-800/80 rounded-2xl p-6 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                    <div className="absolute inset-0 bg-purple-500/5 blur-3xl rounded-full"></div>

                    {/* Simulated Uploaded Image */}
                    <div className="w-full h-48 bg-[#05080E] border border-gray-800 rounded-xl mb-6 relative overflow-hidden flex items-end px-4 pb-4">
                      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, #111 1px, transparent 1px), linear-gradient(to bottom, #111 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                      {/* Fake Chart Lines */}
                      <svg className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M0,80 Q10,70 20,85 T40,60 T60,50 T80,30 T100,20" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M0,80 Q10,70 20,85 T40,60 T60,50 T80,30 T100,20" fill="url(#gradient-chart)" fillOpacity="0.2" />
                        <defs>
                          <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#22c55e" stopOpacity="0.5" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0" />
                          </linearGradient>
                        </defs>

                        {/* Highlights/Annotations */}
                        <circle cx="80" cy="30" r="3" fill="#a855f7" className="animate-pulse" />
                        <circle cx="60" cy="50" r="3" fill="#a855f7" className="animate-pulse" />
                        <line x1="60" y1="50" x2="80" y2="30" stroke="#a855f7" strokeWidth="1" strokeDasharray="2,2" />
                      </svg>

                      {/* Scanning Effect Overlay */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-purple-500/50 blur-[2px] z-20 animate-[scan_3s_ease-in-out_infinite]"></div>
                    </div>

                    <div className="flex items-center gap-3 relative z-10 w-full bg-[#121826] border border-purple-500/30 p-3 rounded-lg justify-center">
                      <Award size={18} className="text-purple-400" />
                      <span className="text-sm font-bold text-purple-400">Analyse Vision Terminée</span>
                    </div>
                  </div>

                  {/* AI Results Mock */}
                  <div className="bg-[#0A0E17] border border-gray-800/80 rounded-2xl p-6 flex flex-col space-y-6 overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                    <div className="flex gap-4 border-b border-gray-800/50 pb-6 relative z-10">
                      <div className="flex-1">
                        <div className="text-sm text-gray-500 mb-1">Tendance Principale</div>
                        <div className="text-lg font-bold text-green-500">Haussière (Bullish)</div>
                      </div>
                      <div className="w-px bg-gray-800/50"></div>
                      <div className="flex-1 pl-4">
                        <div className="text-sm text-gray-500 mb-1">Signal Suggéré</div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-md font-bold">
                          LONG POSITION
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 relative z-10">
                      <div>
                        <div className="text-sm text-gray-400 mb-2 font-medium">Analyse Technique GPT-4 Vision</div>
                        <div className="p-4 bg-[#121826] border border-gray-800 rounded-xl text-sm text-gray-300 leading-relaxed">
                          Le graphique montre une forte cassure d'une résistance clé à 62,000$. La figure en « Tasse avec anse » est validée avec des volumes en augmentation. Le RSI à 65 indique une marge de progression avant la zone de surachat.
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#121826] border border-gray-800 rounded-xl">
                          <div className="text-xs text-gray-500 mb-1">Plafond (Résistance)</div>
                          <div className="text-lg font-mono text-white">€68,500.00</div>
                        </div>
                        <div className="p-4 bg-[#121826] border border-gray-800 rounded-xl">
                          <div className="text-xs text-gray-500 mb-1">Plancher (Support)</div>
                          <div className="text-lg font-mono text-white">€61,200.00</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Dots for 4 screens */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full border border-gray-800">
              {[0, 1, 2, 3].map((index) => (
                <button
                  key={index}
                  onClick={() => setActiveScreen(index)}
                  className={`h-2 rounded-full transition-all ${activeScreen === index
                    ? 'w-8 bg-white shadow-lg shadow-white/50'
                    : 'w-2 bg-gray-600 hover:bg-gray-500'
                    }`}
                  aria-label={`Voir l'écran ${index + 1}`}
                />
              ))}
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
            {t.problemTitle}<br />
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
              {t.featuresTitle}<br />
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

            {/* Feature 5: Live Trading Chart */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/10">
              <BarChart3 className="text-blue-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-bold mb-3">{t.feature5}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.feature5Desc}</p>
            </div>

            {/* Feature 6: AI Chart Analysis */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/10">
              <Sparkles className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-bold mb-3">{t.feature6}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.feature6Desc}</p>
            </div>

            {/* Feature 7: AI Trade Advisor */}
            <div className="group p-8 bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-2xl hover:border-purple-500/30 transition-all hover:shadow-xl hover:shadow-purple-500/10">
              <Zap className="text-purple-500 mb-4 group-hover:scale-110 transition-transform" size={28} />
              <h3 className="text-xl font-bold mb-3">{t.feature7}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{t.feature7Desc}</p>
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
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400">{t.free5}</span>
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
                  <li className="flex items-start gap-2">
                    <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                    <span><strong>{t.pro6}</strong></span>
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
                <li className="flex items-start gap-2">
                  <Check size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-400"><strong>{t.elite5}</strong></span>
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
                    className={`flex-shrink-0 text-gray-400 transition-transform ${faqOpen === index ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${faqOpen === index ? 'max-h-96' : 'max-h-0'
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
                <li><span className="text-gray-700 cursor-not-allowed">Changelog (Bientôt)</span></li>
                <li><span className="text-gray-700 cursor-not-allowed">Roadmap (Bientôt)</span></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">{t.resources}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><span className="text-gray-700 cursor-not-allowed">{t.documentation} (Bientôt)</span></li>
                <li><span className="text-gray-700 cursor-not-allowed">{t.blog} (Bientôt)</span></li>
                <li><a href="#faq" className="hover:text-white transition-colors">{t.faq}</a></li>
                <li><a href="mailto:support@tradeguard.com" className="hover:text-white transition-colors">{t.support}</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-sm">{t.legal}</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li><Link to="/terms" className="hover:text-white transition-colors">{t.terms}</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">{t.privacy}</Link></li>
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
      <style>{`
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