import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Shield, ArrowLeft, Check } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// Initialiser Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ plan, priceId, isAnnual }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!stripe || !elements) {
      return;
    }

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
        billing_details: { email }
      });

      if (stripeError) {
        setError(stripeError.message);
        setLoading(false);
        return;
      }

      // Envoyer le paymentMethod.id à votre backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/create-subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          priceId: priceId,
          email: email
        })
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        // Rediriger vers la page de succès
        navigate('/stripe-success', { 
          state: { 
            plan: plan,
            isAnnual: isAnnual,
            amount: data.amount / 100 // Convertir centimes en euros
          } 
        });
      }
    } catch (err) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const planPrices = {
    'PRO': { monthly: 1900, annual: 18240 }, // 19€ * 12 * 0.8 = 182.40€
    'ELITE': { monthly: 4900, annual: 47040 } // 49€ * 12 * 0.8 = 470.40€
  };

  const amount = planPrices[plan]?.[isAnnual ? 'annual' : 'monthly'] || 0;
  const amountInEuros = amount / 100;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Récapitulatif de commande</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Plan {plan}</span>
            <span className="font-bold">{isAnnual ? 'Annuel' : 'Mensuel'}</span>
          </div>
          <div className="flex justify-between">
            <span>Prix</span>
            <span className="font-bold text-xl">{amountInEuros}€</span>
          </div>
          {isAnnual && (
            <div className="flex justify-between text-green-400">
              <span>Économie (20%)</span>
              <span className="font-bold">
                -{(plan === 'PRO' ? 45.6 : 117.6)}€
              </span>
            </div>
          )}
          <div className="border-t border-slate-700 pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total TTC</span>
              <span>{amountInEuros}€</span>
            </div>
            <p className="text-sm text-slate-400 mt-1">TVA française incluse</p>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Email pour la facture
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
          placeholder="vous@exemple.com"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Informations de paiement
        </label>
        <div className="p-4 bg-slate-900 border border-slate-700 rounded-lg">
          <CardElement 
            options={{
              style: {
                base: {
                  color: '#ffffff',
                  fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                  fontSize: '16px',
                  '::placeholder': { color: '#94a3b8' }
                }
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2 mt-3 text-sm text-slate-400">
          <Shield className="w-4 h-4" />
          <span>Paiement sécurisé par Stripe</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-4">
          <p className="text-red-200">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`w-full py-4 rounded-lg font-bold text-lg ${
          loading ? 'bg-slate-700 cursor-not-allowed' : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-90'
        }`}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Traitement en cours...
          </span>
        ) : (
          `Payer ${amountInEuros}€`
        )}
      </button>

      <div className="text-center text-sm text-slate-400">
        <p>En cliquant, vous acceptez nos Conditions d'utilisation</p>
        <p className="mt-1">Facture disponible immédiatement après paiement</p>
      </div>
    </form>
  );
};

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plan, setPlan] = useState('PRO');
  const [isAnnual, setIsAnnual] = useState(false);

  useEffect(() => {
    if (location.state) {
      setPlan(location.state.plan || 'PRO');
      setIsAnnual(location.state.isAnnual || false);
    }
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              <span>Retour</span>
            </button>
            <div className="flex items-center gap-2">
              <Shield className="w-8 h-8 text-cyan-400" />
              <span className="font-bold text-xl">TradeGuard</span>
            </div>
            <div className="w-20"></div> {/* Pour équilibrer */}
          </div>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Finaliser votre achat</h1>
          <p className="text-slate-400">Paiement 100% sécurisé</p>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-8">
          {/* Sélection période */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setIsAnnual(false)}
              className={`flex-1 py-3 rounded-lg border ${
                !isAnnual 
                  ? 'border-cyan-500 bg-cyan-500/10' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="font-bold">Mensuel</div>
              <div className="text-2xl font-bold mt-1">
                {plan === 'PRO' ? '19€' : '49€'}
              </div>
              <div className="text-sm text-slate-400 mt-1">par mois</div>
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`flex-1 py-3 rounded-lg border ${
                isAnnual 
                  ? 'border-green-500 bg-green-500/10' 
                  : 'border-slate-700 hover:border-slate-600'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span className="font-bold">Annuel</span>
                <span className="px-2 py-1 bg-green-500 text-xs font-bold rounded-full">
                  -20%
                </span>
              </div>
              <div className="text-2xl font-bold mt-1">
                {plan === 'PRO' ? '182,40€' : '470,40€'}
              </div>
              <div className="text-sm text-slate-400 mt-1">
                {plan === 'PRO' ? '15,20€/mois' : '39,20€/mois'}
              </div>
            </button>
          </div>

          <Elements stripe={stripePromise}>
            <CheckoutForm 
              plan={plan} 
              isAnnual={isAnnual}
              priceId={isAnnual 
                ? (plan === 'PRO' ? 'price_pro_annual' : 'price_elite_annual')
                : (plan === 'PRO' ? 'price_pro_monthly' : 'price_elite_monthly')
              }
            />
          </Elements>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>TradeGuard SAS • 123 Avenue du Trading, 75008 Paris, France</p>
          <p className="mt-1">SIRET : 123 456 789 00012 • TVA : FR12345678901</p>
        </div>
      </main>
    </div>
  );
}