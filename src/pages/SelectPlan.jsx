import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Check, ArrowRight, Zap, TrendingUp, Lock } from 'lucide-react';

export default function SelectPlan() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState('pro');
  const [loading, setLoading] = useState(false);

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '$0',
      period: '/mois',
      description: 'Pour découvrir TradeGuard',
      features: [
        '1 position simultanée',
        'Calculs basiques',
        'R:R calculator',
        'Interface simple'
      ],
      notIncluded: [
        'Prix live',
        'Historique',
        'Export PDF/CSV'
      ]
    },
    {
      id: 'pro',
      name: 'Pro',
      price: '$19',
      period: '/mois',
      popular: true,
      description: 'Pour les traders sérieux',
      features: [
        '10 positions simultanées',
        'Prix live API',
        'Historique illimité',
        'Export PDF/CSV',
        'Tous calculateurs avancés',
        'Alertes email',
        'Support prioritaire'
      ],
      notIncluded: []
    },
    {
      id: 'elite',
      name: 'Elite',
      price: '$49',
      period: '/mois',
      description: 'Pour les professionnels',
      features: [
        'Tout Pro +',
        'Positions illimitées',
        'AI Trade Advisor (50/mois)',
        'Backtesting avancé',
        'API access',
        'White-label',
        'Support VIP 24/7'
      ],
      notIncluded: []
    }
  ];

  const handleSelectPlan = async (planId) => {
    setLoading(true);
    
    // Simuler une sauvegarde du plan (à connecter avec Supabase plus tard)
    console.log(`Plan sélectionné: ${planId}`);
    
    // Attendre 500ms pour l'effet visuel
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Rediriger vers le dashboard
    navigate('/dashboard', { replace: true });
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-gray-900 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Shield className="text-white" size={28} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[9px] font-bold text-black">$€¥</span>
              </div>
            </div>
            <span className="text-xl font-bold">TradeGuard</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Intro */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-full mb-6">
            <Check className="text-green-500" size={18} />
            <span className="text-green-400 text-sm font-medium">Compte créé avec succès</span>
          </div>
          
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Choisissez votre plan
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Sélectionnez le plan qui correspond à vos besoins. 
            Vous pourrez changer à tout moment.
          </p>
        </div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedPlan === plan.id
                  ? 'border-white bg-white text-black scale-105 shadow-2xl'
                  : plan.popular
                  ? 'border-gray-700 bg-gray-900 hover:border-gray-600'
                  : 'border-gray-800 bg-gray-900/50 hover:border-gray-700'
              }`}
            >
              {/* Popular badge */}
              {plan.popular && selectedPlan !== plan.id && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  POPULAIRE
                </div>
              )}

              {/* Selected indicator */}
              {selectedPlan === plan.id && (
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="text-white" size={18} />
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className={`text-lg font-bold mb-2 ${
                  selectedPlan === plan.id ? 'text-black' : 'text-white'
                }`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className={`text-4xl font-bold ${
                    selectedPlan === plan.id ? 'text-black' : 'text-white'
                  }`}>
                    {plan.price}
                  </span>
                  <span className={selectedPlan === plan.id ? 'text-gray-600' : 'text-gray-400'}>
                    {plan.period}
                  </span>
                </div>
                <p className={selectedPlan === plan.id ? 'text-gray-600' : 'text-gray-400'}>
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check 
                      size={16} 
                      className={`mt-0.5 flex-shrink-0 ${
                        selectedPlan === plan.id ? 'text-green-600' : 'text-green-500'
                      }`} 
                    />
                    <span className={`text-sm ${
                      selectedPlan === plan.id ? 'text-black' : 'text-gray-300'
                    }`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Not included (for free plan) */}
              {plan.notIncluded.length > 0 && selectedPlan !== plan.id && (
                <ul className="space-y-2 pt-4 border-t border-gray-800">
                  {plan.notIncluded.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 flex-shrink-0 mt-0.5">
                        <div className="w-full h-full border border-gray-700 rounded"></div>
                      </div>
                      <span className="text-sm text-gray-600 line-through">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={() => handleSelectPlan(selectedPlan)}
            disabled={loading}
            className="group px-12 py-4 bg-white text-black font-bold text-lg rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-3"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Chargement...
              </>
            ) : (
              <>
                Continuer avec {plans.find(p => p.id === selectedPlan)?.name}
                <ArrowRight size={20} className="group-hover:translate-x-1 transition" />
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-4">
            {selectedPlan === 'free' 
              ? '✓ Gratuit pour toujours • Aucune carte requise'
              : '✓ Annulation en 1 clic • 14 jours satisfait ou remboursé'
            }
          </p>
        </div>

        {/* Features highlight */}
        <div className="mt-16 pt-16 border-t border-gray-900">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Zap className="text-green-500" size={24} />
              </div>
              <h3 className="font-semibold text-white mb-2">Activation immédiate</h3>
              <p className="text-sm text-gray-400">
                Accès instantané à toutes les fonctionnalités de votre plan
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-blue-500" size={24} />
              </div>
              <h3 className="font-semibold text-white mb-2">Changement flexible</h3>
              <p className="text-sm text-gray-400">
                Passez à un plan supérieur ou inférieur à tout moment
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Lock className="text-purple-500" size={24} />
              </div>
              <h3 className="font-semibold text-white mb-2">Paiement sécurisé</h3>
              <p className="text-sm text-gray-400">
                Vos données sont protégées par encryption SSL
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}