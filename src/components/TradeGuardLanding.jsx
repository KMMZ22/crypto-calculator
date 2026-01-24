import React, { useState } from 'react';
import { TrendingUp, Shield, Zap, BarChart3, Brain, Bell, CheckCircle2, X, ChevronDown, Star, Users, Lock, Smartphone } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

export default function TradeGuardLanding() {
  const navigate = useNavigate();
  const [faqOpen, setFaqOpen] = useState(null);
  const [email, setEmail] = useState('');
  const toggleFaq = (index) => {
    setFaqOpen(faqOpen === index ? null : index);
  };

  const handleSignup = (plan) => {
  navigate('/calculator');
};
  return (
    <div className="bg-slate-900 text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Shield className="text-purple-400" size={32} />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                TradeGuard
              </span>
            </div>
            <div className="hidden md:flex gap-8">
              <a href="#features" className="text-gray-300 hover:text-purple-400 transition">Features</a>
              <a href="#pricing" className="text-gray-300 hover:text-purple-400 transition">Pricing</a>
              <a href="#faq" className="text-gray-300 hover:text-purple-400 transition">FAQ</a>
            </div>
            <button onClick={handleLogin} className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg font-semibold transition">
                Se connecter
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-slate-900 to-blue-900/20"></div>
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-block mb-6 px-4 py-2 bg-purple-600/20 border border-purple-500/30 rounded-full">
            <span className="text-purple-300 text-sm">✨ Utilisé par 500+ traders crypto</span>
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
              className="px-6 py-4 bg-slate-800 border border-purple-500/30 rounded-lg w-full sm:w-80 focus:outline-none focus:border-purple-500"
            />
            <button 
              onClick={() => handleSignup('FREE')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold text-lg transition w-full sm:w-auto"
            >
              Commencer Gratuitement
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Gratuit pour toujours
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Pas de carte requise
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Setup en 2min
            </div>
          </div>

          {/* Demo Screenshot Placeholder */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent z-10"></div>
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 rounded-2xl border border-purple-500/30 p-8 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-slate-800/50 rounded-lg p-6 text-left">
                <div className="text-purple-400 mb-4">💰 Position: $5,000 | Risque: $200 | R:R: 1:2.50</div>
                <div className="text-green-400">✅ Setup validé par l'IA - Excellent ratio risque/rendement</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-slate-800/30 border-y border-purple-500/20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-gray-400">APIs supportées:</div>
            <div className="text-2xl font-bold">Binance</div>
            <div className="text-2xl font-bold">Bybit</div>
            <div className="text-2xl font-bold">Coinbase</div>
            <div className="flex items-center gap-2">
              <Star className="text-yellow-400 fill-yellow-400" size={20} />
              <span className="text-lg font-semibold">4.8/5</span>
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
      <section id="features" className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            TradeGuard fait <span className="text-green-400">tout</span> pour vous
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            La suite complète de risk management crypto
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-purple-900/40 to-slate-800/40 border border-purple-500/30 rounded-2xl p-8 hover:scale-105 transition">
              <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center mb-6">
                <BarChart3 className="text-purple-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Multi-Position Management</h3>
              <p className="text-gray-300 mb-4">Gérez 10 trades en même temps sans perdre la tête</p>
              <p className="text-purple-300 text-sm">→ Voyez votre risque total sur votre capital en un coup d'œil</p>
            </div>

            <div className="bg-gradient-to-br from-blue-900/40 to-slate-800/40 border border-blue-500/30 rounded-2xl p-8 hover:scale-105 transition">
              <div className="w-14 h-14 bg-blue-600/20 rounded-xl flex items-center justify-center mb-6">
                <Zap className="text-blue-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Prix Live API</h3>
              <p className="text-gray-300 mb-4">Les prix se mettent à jour automatiquement</p>
              <p className="text-blue-300 text-sm">→ Plus de tab switching entre Binance et Excel</p>
            </div>

            <div className="bg-gradient-to-br from-green-900/40 to-slate-800/40 border border-green-500/30 rounded-2xl p-8 hover:scale-105 transition">
              <div className="w-14 h-14 bg-green-600/20 rounded-xl flex items-center justify-center mb-6">
                <Brain className="text-green-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">AI Trade Advisor</h3>
              <p className="text-gray-300 mb-4">L'IA analyse votre setup et vous dit si le R:R est bon</p>
              <p className="text-green-300 text-sm">→ Comme avoir un mentor pro 24/7</p>
            </div>

            <div className="bg-gradient-to-br from-orange-900/40 to-slate-800/40 border border-orange-500/30 rounded-2xl p-8 hover:scale-105 transition">
              <div className="w-14 h-14 bg-orange-600/20 rounded-xl flex items-center justify-center mb-6">
                <Bell className="text-orange-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Alertes Liquidation</h3>
              <p className="text-gray-300 mb-4">Notifications en temps réel si vous approchez du danger</p>
              <p className="text-orange-300 text-sm">→ Ne vous réveillez plus avec un compte à zéro</p>
            </div>

            <div className="bg-gradient-to-br from-pink-900/40 to-slate-800/40 border border-pink-500/30 rounded-2xl p-8 hover:scale-105 transition">
              <div className="w-14 h-14 bg-pink-600/20 rounded-xl flex items-center justify-center mb-6">
                <TrendingUp className="text-pink-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">Calculateurs Avancés</h3>
              <p className="text-gray-300 mb-4">DCA, Liquidation, Kelly Criterion, Break-even</p>
              <p className="text-pink-300 text-sm">→ Tous les outils pros dans une seule app</p>
            </div>

            <div className="bg-gradient-to-br from-indigo-900/40 to-slate-800/40 border border-indigo-500/30 rounded-2xl p-8 hover:scale-105 transition">
              <div className="w-14 h-14 bg-indigo-600/20 rounded-xl flex items-center justify-center mb-6">
                <Lock className="text-indigo-400" size={28} />
              </div>
              <h3 className="text-2xl font-bold mb-4">100% Sécurisé</h3>
              <p className="text-gray-300 mb-4">Aucune connexion à vos exchanges requise</p>
              <p className="text-indigo-300 text-sm">→ Vos clés API restent chez vous</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Choisissez votre <span className="text-purple-400">plan</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16">
            Tous les plans incluent 14 jours de garantie satisfait ou remboursé
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* FREE */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2">FREE</h3>
              <div className="text-4xl font-bold mb-6">0€<span className="text-lg text-gray-400">/mois</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>1 position simultanée</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Calculs basiques</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>R:R calculator</span>
                </li>
                <li className="flex items-start gap-3 text-gray-500">
                  <X size={20} className="flex-shrink-0 mt-1" />
                  <span>Prix live</span>
                </li>
                <li className="flex items-start gap-3 text-gray-500">
                  <X size={20} className="flex-shrink-0 mt-1" />
                  <span>Historique</span>
                </li>
              </ul>

              <button 
                onClick={() => handleSignup('FREE')}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-lg font-semibold transition"
              >
                Essayer Gratuitement
              </button>
            </div>

            {/* PRO */}
            <div className="bg-gradient-to-br from-purple-900/40 to-blue-900/40 border-2 border-purple-500 rounded-2xl p-8 relative scale-105 shadow-2xl shadow-purple-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 px-4 py-1 rounded-full text-sm font-bold">
                ⭐ Populaire
              </div>
              
              <h3 className="text-2xl font-bold mb-2">PRO</h3>
              <div className="text-4xl font-bold mb-2">19€<span className="text-lg text-gray-400">/mois</span></div>
              <div className="text-sm text-green-400 mb-6">ou 190€/an (2 mois offerts)</div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span><strong>10 positions</strong> simultanées</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span><strong>Prix live API</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Historique illimité</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Export PDF/CSV</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Tous calculateurs</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Alertes email</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Support prioritaire</span>
                </li>
              </ul>

              <button 
                onClick={() => handleSignup('PRO')}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold transition"
              >
                Commencer PRO
              </button>
            </div>

            {/* ELITE */}
            <div className="bg-slate-800/50 border border-yellow-600/50 rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-2 text-yellow-400">ELITE</h3>
              <div className="text-4xl font-bold mb-6">49€<span className="text-lg text-gray-400">/mois</span></div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span><strong>Tout PRO +</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span><strong className="text-yellow-400">AI Advisor</strong> (50 analyses/mois)</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Positions illimitées</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Backtesting avancé</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>API access</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>White-label</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={20} />
                  <span>Support VIP 24/7</span>
                </li>
              </ul>

              <button 
                onClick={() => handleSignup('ELITE')}
                className="w-full py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-bold transition"
              >
                Contacter
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-slate-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16">
            Ce que disent nos <span className="text-purple-400">traders</span>
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
              <div key={i} className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="text-yellow-400 fill-yellow-400" size={18} />
                  ))}
                </div>
                <p className="text-gray-300 mb-4 italic">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center font-bold">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <div className="font-semibold">{testimonial.name}</div>
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
            Questions <span className="text-purple-400">fréquentes</span>
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
              <div key={i} className="bg-slate-800/50 border border-purple-500/30 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full p-6 flex justify-between items-center hover:bg-slate-800/80 transition"
                >
                  <span className="font-semibold text-lg text-left">{faq.q}</span>
                  <ChevronDown 
                    className={`text-purple-400 transition-transform ${faqOpen === i ? 'rotate-180' : ''}`}
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
      <section className="py-20 px-4 bg-gradient-to-br from-purple-900/40 via-slate-900 to-blue-900/40">
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
              className="px-6 py-4 bg-slate-800 border border-purple-500/30 rounded-lg w-full sm:w-80 focus:outline-none focus:border-purple-500"
            />
            <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg font-bold text-lg transition w-full sm:w-auto">
              Commencer Gratuitement
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Setup en 2 minutes
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Annulation 1-clic
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="text-green-400" size={18} />
              Support 24/7
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/20 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="text-purple-400" size={28} />
                <span className="text-xl font-bold">TradeGuard</span>
              </div>
              <p className="text-gray-400 text-sm">
                Le calculateur de position crypto le plus avancé du marché.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Produit</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-purple-400">Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400">Pricing</a></li>
                <li><a href="#" className="hover:text-purple-400">Changelog</a></li>
                <li><a href="#" className="hover:text-purple-400">Roadmap</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Ressources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">Documentation</a></li>
                <li><a href="#" className="hover:text-purple-400">Tutoriels</a></li>
                <li><a href="#" className="hover:text-purple-400">Blog</a></li>
                <li><a href="#" className="hover:text-purple-400">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-purple-400">CGV</a></li>
                <li><a href="#" className="hover:text-purple-400">Confidentialité</a></li>
                <li><a href="#" className="hover:text-purple-400">Mentions légales</a></li>
                <li><a href="#" className="hover:text-purple-400">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-purple-500/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2026 TradeGuard. Tous droits réservés.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-purple-400">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-purple-400">Discord</a>
              <a href="#" className="text-gray-400 hover:text-purple-400">Telegram</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}