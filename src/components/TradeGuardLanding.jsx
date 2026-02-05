import React, { useState } from 'react';
import { 
  TrendingUp, Shield, Zap, BarChart3, Brain, Bell, 
  CheckCircle2, X, ChevronDown, Star, Users, Lock, 
  Smartphone, ArrowRight, Check, AlertCircle, User, Mail, Calculator
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import UpgradeButton from './UpgradeButton';

export default function TradeGuardLanding() {
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState(null);
  const [email, setEmail] = useState('');

  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleSignup = (plan) => {
    navigate(`/auth?plan=${plan.toLowerCase()}`);
  };

  const handleLogin = () => {
    navigate('/auth');
  };

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Shield className="text-white" size={32} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-black">$€¥</span>
                </div>
              </div>
              <span className="text-2xl font-bold text-white">
                TradeGuard
              </span>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#features" className="text-gray-400 hover:text-white transition">Features</a>
              <a href="#pricing" className="text-gray-400 hover:text-white transition">Pricing</a>
              <a href="#faq" className="text-gray-400 hover:text-white transition">FAQ</a>
            </div>
            <button 
              onClick={handleLogin} 
              className="bg-white text-black hover:bg-gray-100 px-6 py-2 rounded-lg font-semibold transition flex items-center gap-2"
            >
              Se connecter
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/20 via-black to-gray-900/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-green-600/20 border border-green-500/30 rounded-full">
            <span className="text-green-300 text-sm">✨ Utilisé par 500+ traders crypto</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Arrêtez de perdre de l'argent<br />
            par <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">mauvaise gestion</span> de risque
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Calculez vos positions crypto en <span className="text-green-400 font-semibold">10 secondes</span>, pas 10 minutes.<br/>
            Le seul outil avec IA, prix live et multi-positions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-4 bg-gray-900 border border-gray-800 rounded-lg w-full sm:w-80 focus:outline-none focus:border-green-500 text-white"
            />
            <button 
              onClick={() => handleSignup('free')}
              className="px-8 py-4 bg-white text-black hover:bg-gray-100 rounded-lg font-bold text-lg transition w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Commencer Gratuitement
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="text-green-400" size={18} />
              Gratuit pour toujours
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-400" size={18} />
              Pas de carte requise
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-400" size={18} />
              Setup en 2min
            </div>
          </div>

          {/* Demo Screenshot Placeholder */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10"></div>
            <div className="bg-gray-900/40 rounded-2xl border border-gray-800 p-8 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-gray-800/50 rounded-lg p-6 text-left">
                <div className="text-green-400 mb-4">💰 Position: $5,000 | Risque: $200 | R:R: 1:2.50</div>
                <div className="text-green-400">✅ Setup validé par l'IA - Excellent ratio risque/rendement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-900/30 border-y border-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-80">
            <div className="text-gray-400">APIs supportées:</div>
            <div className="text-xl font-bold text-gray-300">Binance</div>
            <div className="text-xl font-bold text-gray-300">Bybit</div>
            <div className="text-xl font-bold text-gray-300">Coinbase</div>
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              <span className="text-lg font-semibold text-gray-300">4.8/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Vous reconnaissez ces <span className="text-red-400">erreurs</span> ?
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "J'ai pris une position trop grosse et j'ai été liquidé",
              "Je calcule mes positions sur Excel, ça prend 5 minutes",
              "Je ne sais jamais si mon R:R est bon avant d'entrer",
              "Je gère 5 trades et je perds le fil de mon risque total"
            ].map((pain, i) => (
              <div key={i} className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 flex items-start gap-4">
                <X className="text-red-400 flex-shrink-0 mt-1" size={24} />
                <p className="text-gray-200 text-lg">{pain}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <p className="text-xl text-orange-400 font-semibold">
              → Un seul mauvais calcul peut détruire des mois de profits
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            TradeGuard fait <span className="text-green-400">tout</span> pour vous
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            La suite complète de risk management crypto
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/30 transition">
              <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Gestion Multi-Positions</h3>
              <p className="text-gray-300 mb-4">Gérez 10 trades en même temps sans perdre la tête</p>
              <p className="text-green-400 text-sm">→ Voyez votre risque total sur votre capital en un coup d'œil</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/30 transition">
              <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Prix Live API</h3>
              <p className="text-gray-300 mb-4">Les prix se mettent à jour automatiquement</p>
              <p className="text-green-400 text-sm">→ Plus de tab switching entre Binance et Excel</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/30 transition">
              <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">AI Trade Advisor</h3>
              <p className="text-gray-300 mb-4">L'IA analyse votre setup et vous dit si le R:R est bon</p>
              <p className="text-green-400 text-sm">→ Comme avoir un mentor pro 24/7</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/30 transition">
              <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6">
                <Bell className="text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Alertes Liquidation</h3>
              <p className="text-gray-300 mb-4">Notifications en temps réel si vous approchez du danger</p>
              <p className="text-green-400 text-sm">→ Ne vous réveillez plus avec un compte à zéro</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/30 transition">
              <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Calculateurs Avancés</h3>
              <p className="text-gray-300 mb-4">DCA, Liquidation, Kelly Criterion, Break-even</p>
              <p className="text-green-400 text-sm">→ Tous les outils pros dans une seule app</p>
            </div>

            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 hover:border-green-500/30 transition">
              <div className="w-14 h-14 bg-green-900/20 rounded-xl flex items-center justify-center mb-6">
                <Lock className="text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">100% Sécurisé</h3>
              <p className="text-gray-300 mb-4">Aucune connexion à vos exchanges requise</p>
              <p className="text-green-400 text-sm">→ Vos clés API restent chez vous</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Choisissez votre <span className="text-green-400">plan</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Tous les plans incluent 14 jours de garantie satisfait ou remboursé
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* FREE */}
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-2">GRATUIT</h3>
              <div className="text-4xl font-bold text-white mb-6">0€<span className="text-lg text-gray-400">/mois</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">1 position simultanée</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Calculs basiques</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">R:R calculator</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={20} className="text-gray-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-500">Prix live</span>
                </li>
                <li className="flex items-start gap-3">
                  <X size={20} className="text-gray-500 flex-shrink-0 mt-1" />
                  <span className="text-gray-500">Historique</span>
                </li>
              </ul>

              <button 
                onClick={() => handleSignup('free')}
                className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2"
              >
                Commencer Gratuitement
                <ArrowRight size={18} />
              </button>
            </div>

            {/* PRO */}
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-green-500 rounded-2xl p-8 relative scale-105 shadow-2xl shadow-green-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 px-4 py-1 rounded-full text-sm font-bold text-white">
                ⭐ Populaire
              </div>
              
              <h3 className="text-2xl font-bold text-white mb-2">PRO</h3>
              <div className="text-4xl font-bold text-white mb-2">19€<span className="text-lg text-gray-400">/mois</span></div>
              <div className="text-sm text-green-400 mb-6">ou 190€/an (2 mois offerts)</div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300"><strong>10 positions</strong> simultanées</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300"><strong>Prix live API</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Historique illimité</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Export PDF/CSV</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Tous calculateurs</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Alertes email</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Support prioritaire</span>
                </li>
              </ul>

              <UpgradeButton 
                plan="pro" 
                variant="default" 
                size="lg"
                className="w-full py-3"
                showIcon={false}
              >
                Choisir Pro - $19/mois
              </UpgradeButton>
            </div>

            {/* ELITE */}
            <div className="bg-gray-900/50 border border-purple-500/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-purple-400 mb-2">ELITE</h3>
              <div className="text-4xl font-bold text-white mb-6">49€<span className="text-lg text-gray-400">/mois</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300"><strong>Tout PRO +</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300"><strong className="text-purple-400">AI Advisor</strong> (50 analyses/mois)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Positions illimitées</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Backtesting avancé</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">White-label</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span className="text-gray-300">Support VIP 24/7</span>
                </li>
              </ul>
              <UpgradeButton 
                  plan="elite" 
                  variant="default" 
                  size="lg"
                  className="w-full py-3"
                  showIcon={false}
                >
                  Choisir Elite - $49/mois
                </UpgradeButton>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-900/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Ce que disent nos <span className="text-green-400">traders</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Marc D.",
                role: "Day Trader BTC",
                text: "Depuis que j'utilise TradeGuard, je n'ai plus jamais été liquidé. Le calculateur de position m'a sauvé 10,000€ en 1 mois.",
                rating: 5
              },
              {
                name: "Sarah K.",
                role: "Swing Trader",
                text: "L'AI advisor m'a empêché d'entrer dans 3 trades foireux hier. Best 19€/mois que je dépense.",
                rating: 5
              },
              {
                name: "Alex M.",
                role: "Trader professionnel",
                text: "Enfin un outil qui comprend vraiment le crypto. La gestion multi-positions est indispensable.",
                rating: 5
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center font-bold text-white">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-gray-400">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Questions <span className="text-green-400">fréquentes</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Dois-je connecter mon exchange ?",
                a: "Non, aucune connexion requise. TradeGuard utilise uniquement les prix publics via API. Vos clés API et vos fonds restent 100% sécurisés chez vous."
              },
              {
                q: "Mes données sont-elles sécurisées ?",
                a: "Absolument. Hébergement EU (RGPD compliant), encryption end-to-end, aucune donnée vendue à des tiers. Vos calculs et stratégies restent privés."
              },
              {
                q: "Puis-je annuler à tout moment ?",
                a: "Oui, annulation en 1 clic depuis votre dashboard. Aucune question posée, aucun frais caché. Vous gardez l'accès jusqu'à la fin de votre période payée."
              },
              {
                q: "Quelle est la différence avec un Excel ?",
                a: "TradeGuard offre des prix en temps réel, l'automatisation complète, l'intelligence artificielle, la gestion multi-positions, les alertes automatiques, le backtesting, et bien plus. Excel nécessite des formules manuelles et des mises à jour constantes."
              },
              {
                q: "L'AI Trade Advisor est-il fiable ?",
                a: "L'IA analyse votre setup selon les principes de risk management éprouvés. Elle ne prédit pas le marché mais valide que votre position respecte les bonnes pratiques (R:R, sizing, etc.)."
              },
              {
                q: "Puis-je essayer avant de payer ?",
                a: "Oui ! Le plan FREE est disponible à vie sans carte bancaire. Testez l'outil, et upgradez uniquement quand vous en voyez la valeur."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-6 flex justify-between items-center hover:bg-gray-800 transition text-left"
                >
                  <span className="font-semibold text-lg text-white">{faq.q}</span>
                  <ChevronDown 
                    className={`text-green-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}
                    size={24}
                  />
                </button>
                {faqOpen === i && (
                  <div className="px-6 pb-6 text-gray-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Prêt à trader plus <span className="text-green-400">intelligemment</span> ?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rejoignez 500+ traders qui protègent leur capital avec TradeGuard
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <input
              type="email"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-6 py-4 bg-gray-900 border border-gray-800 rounded-lg w-full sm:w-80 focus:outline-none focus:border-green-500 text-white"
            />
            <button 
              onClick={() => handleSignup('free')}
              className="px-8 py-4 bg-white text-black hover:bg-gray-100 rounded-lg font-bold text-lg transition w-full sm:w-auto flex items-center justify-center gap-2"
            >
              Commencer Gratuitement
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Check className="text-green-400" size={18} />
              Setup en 2 minutes
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-400" size={18} />
              Annulation 1-clic
            </div>
            <div className="flex items-center gap-2">
              <Check className="text-green-400" size={18} />
              Support 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-green-400" size={28} />
                <span className="text-xl font-bold text-white">TradeGuard</span>
              </div>
              <p className="text-gray-400 text-sm">
                Le calculateur de position crypto le plus avancé du marché.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-green-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-green-400">Pricing</a></li>
                <li><a href="#" className="hover:text-green-400">Changelog</a></li>
                <li><a href="#" className="hover:text-green-400">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Ressources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400">Documentation</a></li>
                <li><a href="#" className="hover:text-green-400">Tutoriels</a></li>
                <li><a href="#" className="hover:text-green-400">Blog</a></li>
                <li><a href="#" className="hover:text-green-400">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-white mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-400">CGV</a></li>
                <li><a href="#" className="hover:text-green-400">Confidentialité</a></li>
                <li><a href="#" className="hover:text-green-400">Mentions légales</a></li>
                <li><a href="#" className="hover:text-green-400">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 TradeGuard. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-green-400">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-green-400">Discord</a>
              <a href="#" className="text-gray-400 hover:text-green-400">Telegram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}