import React from 'react';
import { Shield, AlertCircle, FileText, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                TradeGuard
              </span>
            </Link>
            <Link 
              to="/"
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <FileText className="w-10 h-10 text-cyan-400" />
            <h1 className="text-4xl font-bold">Conditions d'utilisation</h1>
          </div>
          <p className="text-slate-400">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
        </div>

        {/* Avertissement important */}
        <div className="bg-red-900/20 border border-red-700/30 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-8 h-8 text-red-400 flex-shrink-0" />
            <div>
              <h2 className="text-xl font-bold text-red-400 mb-3">AVERTISSEMENT IMPORTANT</h2>
              <p className="text-slate-300">
                Le trading comporte des risques de perte totale de capital. TradeGuard est un outil de calcul, 
                pas un conseiller financier. Vous êtes seul responsable de vos décisions de trading.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Acceptation des conditions</h2>
            <p className="text-slate-300 mb-3">
              En utilisant TradeGuard, vous acceptez ces conditions dans leur intégralité. Vous devez avoir au moins 18 ans 
              et être légalement autorisé à trader dans votre juridiction.
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Vous acceptez que TradeGuard n'est pas un conseiller financier</li>
              <li>Vous comprenez les risques liés au trading</li>
              <li>Vous êtes responsable de la vérification de vos calculs</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Abonnements et paiements</h2>
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-3">
              <h3 className="font-bold text-red-400 mb-2">⚠️ Aucun remboursement</h3>
              <p className="text-slate-300">
                Les abonnements payants ne sont pas remboursables. Les annulations prennent effet à la fin de la période 
                de facturation en cours. Aucun remboursement n'est accordé pour les périodes partielles.
              </p>
            </div>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Paiement par carte bancaire via Stripe</li>
              <li>Options : Mensuel ou Annuel (20% de réduction)</li>
              <li>Facture disponible pour tous les abonnements</li>
              <li>TVA française incluse dans tous les prix</li>
              <li>Renouvellement automatique sauf annulation</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Responsabilité limitée</h2>
            <p className="text-slate-300 mb-3">
              TradeGuard décline toute responsabilité pour :
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Pertes financières résultant du trading</li>
              <li>Erreurs dans les calculs dues à des données incorrectes fournies par l'utilisateur</li>
              <li>Décisions d'investissement prises par l'utilisateur</li>
              <li>Problèmes techniques sur les plateformes d'échange tierces</li>
              <li>Variations de marché affectant les résultats réels</li>
              <li>Interruptions de service temporaires pour maintenance</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Variations de marché</h2>
            <p className="text-slate-300">
              Les calculs fournis par TradeGuard sont basés sur les données que vous fournissez. Les conditions du marché 
              peuvent changer rapidement et les résultats réels peuvent différer significativement des calculs.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Protection des données</h2>
            <p className="text-slate-300 mb-3">
              Nous collectons uniquement les données nécessaires au fonctionnement du service :
            </p>
            <ul className="list-disc pl-5 text-slate-300 space-y-2">
              <li>Email pour l'authentification</li>
              <li>Données de calcul (stockées localement dans votre navigateur)</li>
              <li>Aucune clé API d'exchange n'est collectée</li>
              <li>Aucune information bancaire n'est stockée sur nos serveurs</li>
            </ul>
            <p className="text-slate-300 mt-3">
              Vos données sont chiffrées et protégées conformément au RGPD.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Modifications des conditions</h2>
            <p className="text-slate-300">
              Nous nous réservons le droit de modifier ces conditions d'utilisation. Les utilisateurs seront notifiés 
              par email des changements importants. La poursuite de l'utilisation du service après modifications 
              constitue l'acceptation des nouvelles conditions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Contact</h2>
            <p className="text-slate-300">
              Pour toute question concernant ces conditions :<br/>
              Email : legal@tradeguard.app<br/>
              Adresse : TradeGuard SAS, 123 Avenue du Trading, 75008 Paris, France
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-700">
          <div className="flex items-center justify-between">
            <p className="text-slate-400">
              Version 1.0 • {new Date().getFullYear()} TradeGuard
            </p>
            <Link 
              to="/"
              className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg hover:opacity-90 transition"
            >
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}