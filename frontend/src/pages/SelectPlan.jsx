import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, ArrowRight, Zap, TrendingUp, Lock, Crown, BarChart3, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UpgradeButton from '../components/UpgradeButton';
import LiquidEther from '../components/LiquidEther';

export default function SelectPlan() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedPlan, setSelectedPlan] = useState('pro');

  const handleStartFree = () => {
    navigate('/dashboard');
  };

  return (
    <div className="bg-transparent text-white min-h-screen relative overflow-x-hidden pt-20 pb-24 px-4">
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

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg blur opacity-20"></div>
              <div className="relative bg-[#131517] p-3 rounded-lg">
                <Shield className="text-green-500" size={32} />
              </div>
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Bienvenue ! Choisissez votre <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">plan</span>
          </h1>
          <p className="text-xl text-gray-400">
            Commencez gratuitement ou passez à la vitesse supérieure
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* FREE */}
          <div className="bg-black/60 backdrop-blur-xl border border-gray-800/80 rounded-2xl p-8 hover:border-gray-700 hover:shadow-2xl hover:shadow-white/5 transition-all flex flex-col">
            <h3 className="text-2xl font-bold text-white mb-2">Gratuit</h3>
            <div className="text-4xl font-bold text-white mb-6">0€<span className="text-lg text-gray-400 font-normal">/mois</span></div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="text-gray-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-400">1 position simultanée</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-gray-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-400">Calculateur R:R basique</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-gray-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-400">2 Analyses graphiques IA/mois</span>
              </li>
            </ul>

            <button
              onClick={handleStartFree}
              className="w-full py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition flex items-center justify-center gap-2"
            >
              Continuer Gratuitement
              <ArrowRight size={20} />
            </button>
          </div>

          {/* PRO */}
          <div className="bg-gradient-to-b from-gray-900/90 to-black/80 backdrop-blur-xl border-2 border-green-500 rounded-2xl p-8 transform md:-translate-y-4 shadow-2xl shadow-green-500/20 flex flex-col relative">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
              Le plus populaire
            </div>

            <h3 className="text-2xl font-bold text-white mb-2 font-display">PRO</h3>
            <div className="text-4xl font-bold text-white mb-6">19€<span className="text-lg text-green-400 font-normal">/mois</span></div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-white">10 positions simultanées</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-white">Prix en direct via API</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-white">50 Analyses graphiques IA/mois</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-green-500 flex-shrink-0 mt-1" size={18} />
                <span className="text-white">Historique illimité & Export</span>
              </li>
            </ul>

            <UpgradeButton plan="pro" variant="default" size="lg" className="w-full py-4 rounded-xl text-lg relative group overflow-hidden">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative z-10 flex items-center justify-center gap-2">
                Commencer PRO
              </span>
            </UpgradeButton>
          </div>

          {/* ELITE */}
          <div className="bg-black/60 backdrop-blur-xl border border-purple-500/30 rounded-2xl p-8 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 transition-all flex flex-col relative">
            <h3 className="text-2xl font-bold text-purple-400 mb-2 font-display">ELITE</h3>
            <div className="text-4xl font-bold text-white mb-6">49€<span className="text-lg text-gray-400 font-normal">/mois</span></div>

            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start gap-3">
                <Check className="text-purple-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-gray-300">Tout de PRO, plus :</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-purple-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-white font-medium">Positions illimitées</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-purple-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-white font-medium">200 Analyses graphiques IA/mois</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="text-purple-400 flex-shrink-0 mt-1" size={18} />
                <span className="text-white font-medium">AI Trade Advisor (50 crédits)</span>
              </li>
            </ul>

            <UpgradeButton plan="elite" variant="default" size="lg" className="w-full py-4 rounded-xl text-lg relative group overflow-hidden !bg-gradient-to-r !from-purple-600 !to-indigo-600 hover:!from-purple-500 hover:!to-indigo-500 shadow-purple-500/25">
              <span className="relative z-10 flex items-center justify-center gap-2">
                Commencer ELITE
              </span>
            </UpgradeButton>
          </div>
        </div>
      </div>
    </div>
  );
}