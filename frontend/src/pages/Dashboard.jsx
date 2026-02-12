// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Calculator, BarChart, TrendingUp, Zap, Shield, AlertTriangle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [isVisitor, setIsVisitor] = useState(false);
  const [calculationsLeft, setCalculationsLeft] = useState(1);
  const [calculationsUsed, setCalculationsUsed] = useState(0);
  const [showUpsell, setShowUpsell] = useState(false);

  useEffect(() => {
    // Vérifier le mode visiteur
    const visitorMode = localStorage.getItem('visitor_mode') === 'true';
    const userIsVisitor = visitorMode && !user;
    setIsVisitor(userIsVisitor);
    
    if (userIsVisitor) {
      // Gérer les calculs du jour
      const today = new Date().toDateString();
      const lastDate = localStorage.getItem('last_calculation_date');
      const used = parseInt(localStorage.getItem('calculations_used') || '0');
      
      if (lastDate !== today) {
        // Nouveau jour
        localStorage.setItem('calculations_used', '0');
        localStorage.setItem('last_calculation_date', today);
        setCalculationsUsed(0);
        setCalculationsLeft(1);
      } else {
        setCalculationsUsed(used);
        setCalculationsLeft(Math.max(0, 1 - used));
      }
      
      // Afficher upsell si limite atteinte
      if (used >= 1) {
        setTimeout(() => setShowUpsell(true), 1000);
      }
    }
  }, [user]);

  const handleUseCalculator = () => {
    if (isVisitor) {
      if (calculationsLeft <= 0) {
        setShowUpsell(true);
        return;
      }
      
      // Utiliser un calcul
      const newUsed = calculationsUsed + 1;
      localStorage.setItem('calculations_used', newUsed.toString());
      setCalculationsUsed(newUsed);
      setCalculationsLeft(0);
      
      // Afficher upsell après 2 secondes
      setTimeout(() => setShowUpsell(true), 2000);
    }
    
    navigate('/calculator');
  };

  const handleSignupFromVisitor = () => {
    localStorage.setItem('visitor_mode', 'false');
    navigate('/signup');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4 md:p-8">
      
      {/* Modal d'upsell */}
      {showUpsell && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-8 max-w-md border border-amber-700">
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🚀</div>
              <h3 className="text-2xl font-bold text-amber-400 mb-2">
                Pour profiter réellement de notre calculateur
              </h3>
            </div>
            
            <div className="text-center mb-8">
              <p className="text-gray-300 mb-4">
                Vous avez utilisé votre unique calcul du jour en mode visiteur.
              </p>
              
              <div className="bg-gray-900/50 rounded-xl p-4 mb-4 border border-amber-700/50">
                <div className="flex items-center justify-center gap-6 mb-3">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gray-400">1</div>
                    <div className="text-xs text-gray-500">Calcul visiteur</div>
                  </div>
                  <div className="text-2xl text-amber-400">→</div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-400">10</div>
                    <div className="text-xs text-amber-300">Calculs inscrit</div>
                  </div>
                </div>
                <p className="text-amber-300 font-bold">+900% de calculs gratuitement !</p>
              </div>
              
              <p className="text-cyan-300 font-bold text-xl">
                Inscrivez-vous gratuitement et gagnez <span className="text-amber-400">10 calculs par jour !!!</span>
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={handleSignupFromVisitor}
                className="py-4 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl font-bold text-lg"
              >
                ✨ S'inscrire gratuitement
              </button>
              <button
                onClick={() => setShowUpsell(false)}
                className="py-4 bg-gray-800 hover:bg-gray-700 rounded-xl font-medium"
              >
                Fermer
              </button>
            </div>
            
            <p className="text-xs text-gray-500 mt-6 text-center">
              <span className="text-green-400">✓</span> Aucune carte bancaire • 
              <span className="text-green-400">✓</span> 10 calculs/jour • 
              <span className="text-green-400">✓</span> Accès complet
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center">
            <Shield className="w-10 h-10 text-cyan-400 mr-3" />
            <h1 className="text-3xl font-bold">TradeGuard Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-gray-300">Bonjour, {user.email?.split('@')[0]}</span>
                <Link to="/calculator" className="px-4 py-2 bg-cyan-700 hover:bg-cyan-600 rounded-xl">
                  Calculatrice
                </Link>
              </>
            ) : (
              <>
                <span className="text-amber-300">Mode visiteur</span>
                <button
                  onClick={handleSignupFromVisitor}
                  className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl font-bold"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>
        </div>

        {/* Bannière visiteur */}
        {isVisitor && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-900/20 to-amber-800/10 border border-amber-700 rounded-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-amber-300 font-bold text-lg mb-1">
                  <AlertTriangle className="w-5 h-5 inline mr-2" />
                  Mode visiteur limité
                </p>
                <p className="text-amber-200 mb-2">
                  <span className="font-bold">{calculationsLeft} calcul{calculationsLeft !== 1 ? 's' : ''} restant{calculationsLeft !== 1 ? 's' : ''}</span> aujourd'hui
                </p>
                <p className="text-cyan-300">
                  💡 <span className="font-bold">Pour profiter réellement : </span>
                  <span className="text-amber-400 font-bold">Inscrivez-vous pour 10 calculs/jour !!!</span>
                </p>
              </div>
              <button
                onClick={handleSignupFromVisitor}
                className="px-6 py-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl font-bold whitespace-nowrap"
              >
                S'inscrire → 10 calculs/jour
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Quick Calculator Card */}
          <div 
            onClick={handleUseCalculator}
            className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 border border-cyan-700 rounded-2xl p-6 hover:border-cyan-500 cursor-pointer transition-all hover:scale-105"
          >
            <div className="flex items-center mb-4">
              <Calculator className="w-10 h-10 text-cyan-400 mr-3" />
              <h2 className="text-2xl font-bold">Calculatrice rapide</h2>
            </div>
            <p className="text-gray-300 mb-4">
              Calculez instantanément votre position size et risque
            </p>
            <button className="w-full py-3 bg-cyan-700 hover:bg-cyan-600 rounded-xl font-medium">
              {isVisitor ? `Utiliser (${calculationsLeft} restant)` : 'Commencer un calcul'}
            </button>
          </div>

          {/* Stats Card */}
          <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <BarChart className="w-10 h-10 text-green-400 mr-3" />
              <h2 className="text-2xl font-bold">Statistiques</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-gray-400">Calculs effectués</p>
                <p className="text-3xl font-bold">{isVisitor ? calculationsUsed : '0'}</p>
              </div>
              <div>
                <p className="text-gray-400">Type de compte</p>
                <p className="text-xl font-bold text-amber-400">
                  {user ? (user.profile?.subscription_plan || 'FREE') : 'VISITEUR'}
                </p>
              </div>
            </div>
          </div>

          {/* Upgrade Card */}
          <div className="bg-gradient-to-br from-amber-900/20 to-amber-800/10 border border-amber-700 rounded-2xl p-6">
            <div className="flex items-center mb-4">
              <Zap className="w-10 h-10 text-amber-400 mr-3" />
              <h2 className="text-2xl font-bold">Améliorer</h2>
            </div>
            <p className="text-gray-300 mb-4">
              {isVisitor ? (
                <>
                  <span className="text-amber-300 font-bold">Limité à 1 calcul/jour</span>
                  <span className="block mt-2">Passez à <span className="text-cyan-300">10 calculs/jour</span> gratuitement !</span>
                </>
              ) : (
                'Explorez nos plans pour débloquer plus de fonctionnalités'
              )}
            </p>
            <button
              onClick={() => navigate(isVisitor ? '/signup' : '/select-plan')}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 rounded-xl font-bold"
            >
              {isVisitor ? 'S\'inscrire gratuitement' : 'Voir les plans'}
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-6">
          <h2 className="text-2xl font-bold mb-4">Derniers calculs</h2>
          {isVisitor && calculationsUsed === 0 ? (
            <div className="text-center py-8">
              <Calculator className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucun calcul effectué aujourd'hui</p>
              <p className="text-amber-300 mt-2">
                Utilisez votre calcul gratuit pour commencer !
              </p>
            </div>
          ) : isVisitor ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-900/50 rounded-xl">
                <div>
                  <p className="font-medium">Calcul #{calculationsUsed}</p>
                  <p className="text-sm text-gray-400">Aujourd'hui</p>
                </div>
                <span className="px-3 py-1 bg-amber-900/30 text-amber-300 rounded-full text-sm">
                  Mode visiteur
                </span>
              </div>
              <p className="text-center text-gray-500 text-sm">
                Inscrivez-vous pour sauvegarder vos calculs
              </p>
            </div>
          ) : (
            <div className="text-center py-8">
              <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Aucun calcul sauvegardé</p>
              <p className="text-cyan-300 mt-2">
                Commencez à utiliser la calculatrice !
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            {isVisitor ? (
              <>
                <span className="text-amber-400">💡 Astuce : </span>
                <span className="text-cyan-300">Inscrivez-vous gratuitement pour <span className="font-bold">10 calculs par jour</span> et sauvegarder vos résultats !</span>
              </>
            ) : (
              'TradeGuard - Calculateur de risque crypto professionnel'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;